gsap.registerPlugin(CustomEase, ScrollTrigger);

const version = "1.7.2";
const DEBUG = false;

// history.scrollRestoration = "manual";

let lenis = null;
const lenisLerpValue = 0.165;
let nextPage = document;
let onceFunctionsInitialized = false;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", (e) => (reducedMotion = e.matches));
rmMQ.addListener?.((e) => (reducedMotion = e.matches));

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("default", "0.625, 0.05, 0, 1");
CustomEase.create("smooth", "M0,0 C0.38,0.005 0.215,1 1,1");
CustomEase.create("outQuad", "M0,0 C0.25,0.46 0.45,0.94 1,1");
gsap.defaults({ ease: "default", duration: durationDefault });

const colors = {
  "color-Text": "#212121",
  main: "#63e89f",
  text: "#212121",
  "color-White": "#fff",
  "color-Background": "#f3f3f3",
  "color-BigFooterBack": "#262626",
  "color-FooterBlock": "#191919",
  "color-DarkTint": "#191919",
  "color-FooterDivider": "#f5f3f02e",
  white: "#fff",
  "color-BtnAnimatedArrow": "#63e89f",
  background: "#f3f3f3",
  "dark-FooterDivider": "#21212126",
  darkTint: "#191919",
  "dark-Background": "#212121",
  border: "#f5f3f02e",
  "dark-Text": "#fff",
  "dark-White": "#191919",
  "dark-DarkTint": "#f3f3f3",
  "dark-BigFooterBack": "#f3f3f3",
  "dark-FooterBlock": "#fff",
  "dark-BtnAnimatedArrow": "#212121",
};

document.addEventListener("DOMContentLoaded", () => {
  initOnceFunctions();

  if (has("[data-faq-item]")) initFAQ();
  if (has("[data-footer]")) {
    initFooterLinkHoverAnimation();
    setCopyrightYear();
    initOpeningHours();
  }
  if (has("[data-copy-email-button]")) initCopyEmailClipboard();
  if (has("[data-button-hover-animation]")) initButtonHoverAnimation();

  if (has('[data-add-uuid]')) formRandomUUID();

  if (has("[data-creation-date]")) initBlogPostDate();
  if (has("[data-filter-group]")) initBlogPostFilter();
  if (has("[data-blog-post-item]")) initBlogPostHoverAnimation();

  if (has("[data-bmi-calculator-v2]")) initBMICalculatorV3();

  if (has("[data-tdee-calculator-v2]")) initTDEECalculatorV3();

  if (has("[data-faq-section]")) initFAQSectionAnimation();

  if (has("[data-footer]")) {
    initFooterSignature();
    initFooterLogoFlowerSpin();
  }

  if (has("[data-six-card]")) initSixCardAnimations();

  if (has("[data-marquee-track]")) initClientMarqueeAnimation();

  if (has("[data-steps-section]")) {
    initStepsFlowerAnimation();
    // initStepsProgressBarAnimation();
    initStepsScrollAnimation();
  }

  if (has("[data-testimonial-marquee-section]"))
    initTestimonialMarqueeAnimation();

  if (has("[data-form-validate]")) initBasicFormValidation();

  if (has("[data-plan-popup-wrapper]")) initPlanPopupV2();

  if (hasLenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
});

function normalizePaths(paths) {
  const heights = Array.from(paths).map((p) => p.getBBox().height);
  const maxHeight = Math.max(...heights);

  return (index) => {
    const h = heights[index];
    return (maxHeight / h) * 100;
  };
}

function runFirstLoadAnimation() {
  // const next = document.querySelector('[data-barba="container"]');
  const transitionWrap = document.querySelector("[data-transition-init-wrap]");
  const transitionPanel = transitionWrap.querySelector(
    "[data-transition-init-panel]",
  );
  const transitionPanelTop = transitionWrap.querySelector(
    "[data-transition-init-panel-top]",
  );
  const transitionPanelBottom = transitionWrap.querySelector(
    "[data-transition-init-panel-bottom]",
  );
  const transitionLogo = transitionWrap.querySelector(
    "[data-transition-init-logo]",
  );
  const transitionLogoPath = transitionWrap.querySelectorAll("path");

  const getY = normalizePaths(transitionLogoPath);

  const tl = gsap.timeline();

  // if (reducedMotion) {
  //   tl.set(next, { autoAlpha: 1 });
  //   tl.add("pageReady");
  //   tl.call(resetPage, [next], "pageReady");
  //   return new Promise(resolve => tl.call(resolve, [], "pageReady"));
  // }

  tl.add("startEnter", 1.35);

  tl.to(
    transitionPanel,
    {
      yPercent: -200,
      duration: 1,
      overwrite: "auto",
      immediateRender: false,
    },
    "startEnter",
  );

  tl.to(
    transitionPanelBottom,
    {
      scaleY: 0,
      duration: 1,
    },
    "<",
  );

  tl.to(
    transitionLogoPath,
    {
      yPercent: (i) => -getY(i) * 1.3,
      duration: 1.2,
      ease: "expo.inOut",
      stagger: {
        each: -0.02,
      },
    },
    "startEnter-=0.4",
  );

  // tl.fromTo(next, {
  //   y: "25vh"
  // }, {
  //   y: "0vh",
  //   duration: 1,
  // }, "startEnter");

  tl.set(
    transitionPanel,
    {
      autoAlpha: 0,
    },
    ">",
  );

  tl.set(
    transitionLogo,
    {
      autoAlpha: 0,
    },
    ">",
  );

  tl.set(
    transitionLogoPath,
    {
      yPercent: 0,
    },
    ">",
  );

  // tl.add("pageReady");
  // tl.call(resetPage, [next], "pageReady");
  // scrollToInitialHash(next);

  // return new Promise(resolve => {
  //   tl.call(resolve, [], "pageReady");
  // });
}

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  // Runs once on first load
  // if (has('[data-something]')) initSomething();

  handleMobileNavLinkClick();
  initNavLinkHoverAnimation();
  initNavButtonAnimation();
  initSkipLink();

  runFirstLoadAnimation();
}

function initLenis() {
  if (lenis) return; // already created
  if (!hasLenis) return;

  lenis = new Lenis({
    // lerp: 0.165,
    lerp: lenisLerpValue,
    wheelMultiplier: 1.25,
  });

  history.scrollRestoration = "manual";

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  let disableScrollElements = document.querySelectorAll(
    '[scrolldisable-element="disable"]',
  );
  let enableScrollElements = document.querySelectorAll(
    '[scrolldisable-element="enable"]',
  );

  disableScrollElements.forEach((element) => {
    element.addEventListener("click", () => {
      lenis.stop();
      if (DEBUG) console.log("Lenis stopped due to click on", element);
    });
  });

  enableScrollElements.forEach((element) => {
    element.addEventListener("click", () => {
      lenis.start();
      if (DEBUG) console.log("Lenis started due to click on", element);
    });
  });

  if (DEBUG) console.log("Lenis initialized");
}

function initSkipLink() {
  document
    .querySelector("[data-skip-link]")
    .addEventListener("click", function (e) {
      const target = document.getElementById("main");
      if (!target) return;

      target.setAttribute("tabindex", "-1"); // ensure focusable
      target.focus();
    });

  // if (DEBUG) console.log("Skip link initialized");
}

//plan popup
function initPlanPopupV2(page = document) {
  const pageContainer = document.querySelector('[data-barba="container"]');

  const popupWrapper =
    page.querySelector("[data-plan-popup-wrapper]") ||
    document.querySelector("[data-plan-popup-wrapper]");
  if (!popupWrapper) {
    if (DEBUG) console.warn("Plan popup wrapper not found");
    return;
  }
  const popupTriggers =
    page.querySelectorAll("[data-plan-popup-trigger]") ||
    document.querySelectorAll("[data-plan-popup-trigger]");
  if (popupTriggers.length === 0) {
    if (DEBUG) console.warn("No plan popup triggers found");
    return;
  }
  const allPopups = Array.from(
    popupWrapper.querySelectorAll("[data-plan-popup]"),
  );
  if (allPopups.length === 0) {
    if (DEBUG) console.warn("No plan popups found");
    return;
  }
  const popupCloseTriggers = popupWrapper.querySelectorAll(
    "[data-popup-close-trigger]",
  );
  if (popupCloseTriggers.length === 0) {
    if (DEBUG) console.warn("No plan popup close triggers found");
    return;
  }
  const blurTargets = popupWrapper.querySelectorAll(".popup-background-blur");
  if (blurTargets.length === 0) {
    if (DEBUG) console.warn("No plan popup blur targets found");
    return;
  }

  // Prevent duplicate listeners if this container is initialized again
  if (popupWrapper._planPopupCleanup) popupWrapper._planPopupCleanup();

  const controller = new AbortController();
  popupWrapper._planPopupCleanup = () => controller.abort();

  let activePopup = null;

  gsap.set(popupWrapper, { display: "none" });
  gsap.set(allPopups, { autoAlpha: 0, display: "none" });
  gsap.set(blurTargets, { "--blur": "0px" });

  function getPopup(triggerData) {
    if (!triggerData) return null;

    return document.querySelector(`[data-plan-popup="${triggerData}"]`);
  }

  function openPopup(popup) {
    if (!popup) return;

    activePopup = popup;

    gsap.killTweensOf([popupWrapper, allPopups, blurTargets]);

    gsap
      .timeline()
      // .set(pageContainer, { zIndex: 201 }, 0)
      .set(allPopups, { autoAlpha: 0, display: "none" })
      .set(popupWrapper, { display: "flex" })
      .set(popup, { display: "grid" }, 0.01)
      .to(popup, { autoAlpha: 1 }, 0.01)
      .to(blurTargets, { "--blur": "10px" }, 0.01);

    if (DEBUG) console.log("Opened popup", popup);
  }

  function closePopup() {
    if (!activePopup) return;

    const popup = activePopup;
    activePopup = null;

    gsap.killTweensOf([popupWrapper, allPopups, blurTargets]);

    gsap
      .timeline()
      // .set(pageContainer, { zIndex: 0 }, 0)
      .to(popup, { autoAlpha: 0 })
      .set(popup, { display: "none" })
      .to(popupWrapper, { display: "none" }, 0.01)
      .to(blurTargets, { "--blur": "0px" }, 0.01);

    if (DEBUG) console.log("Closed popup", popup);
  }

  popupTriggers.forEach((trigger) => {
    trigger.addEventListener(
      "click",
      () => {
        const triggerData = trigger.getAttribute("data-plan-popup-trigger");
        const popup = getPopup(triggerData);

        openPopup(popup);
      },
      { signal: controller.signal },
    );
  });

  popupCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closePopup, {
      signal: controller.signal,
    });
  });

  if (DEBUG) console.log("Plan popup V2 initialized");
}

// footer
function initOpeningHours(page = document) {
  const defaultTimezone = "Europe/Belgrade";
  const timeTables = page.querySelectorAll("[data-opening-hours-init]");
  if (!timeTables.length) return;

  timeTables.forEach((root) => {
    const tz =
      root.getAttribute("data-opening-hours-timezone") || defaultTimezone;

    const timeToMinutes = (str) => {
      const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(str || "");
      return m ? parseInt(m[1], 10) * 60 + parseInt(m[2], 10) : null;
    };

    const getNowParts = () => {
      let useTz = tz;
      try {
        new Intl.DateTimeFormat("en-GB", { timeZone: tz });
      } catch {
        useTz = defaultTimezone;
      }
      const fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: useTz,
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      const parts = fmt.formatToParts(new Date());
      const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
      const weekdayIdx = [
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
        "Sun",
      ].indexOf(map.weekday);
      return {
        weekdayIdx,
        hour: parseInt(map.hour, 10),
        minute: parseInt(map.minute, 10),
      };
    };

    const dayIndex = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6,
    };
    const rows = Array.from(root.querySelectorAll("[data-opening-hours-day]"));
    if (!rows.length) return;

    // check duplicates
    const dayCount = {};
    rows.forEach((r) => {
      const d = (r.getAttribute("data-opening-hours-day") || "")
        .trim()
        .toLowerCase();
      if (d) dayCount[d] = (dayCount[d] || 0) + 1;
    });
    Object.keys(dayCount).forEach((d) => {
      if (dayCount[d] > 1)
        console.error([OpeningHours], `Duplicate day "${d}" found in`, root);
    });

    const ordered = new Array(7);
    rows.forEach((r) => {
      const d = (r.getAttribute("data-opening-hours-day") || "")
        .trim()
        .toLowerCase();
      if (d in dayIndex) ordered[dayIndex[d]] = r;
    });
    if (ordered.some((r) => !r)) return;

    const schedule = ordered.map((row) => {
      const o = (row.getAttribute("data-opening-hours-open") || "").trim();
      const c = (row.getAttribute("data-opening-hours-close") || "").trim();
      const openMin = timeToMinutes(o);
      const closeMin = timeToMinutes(c);
      if (openMin == null || closeMin == null)
        return { open: false, openMin: 0, closeMin: 0, overnight: false };
      const overnight = openMin > closeMin;
      return { open: true, openMin, closeMin, overnight };
    });

    const evaluate = () => {
      const now = getNowParts();
      const curIdx = now.weekdayIdx;
      const nowMin = now.hour * 60 + now.minute;

      // mark current day
      ordered.forEach((r) =>
        r.removeAttribute("data-opening-hours-current-day"),
      );
      ordered[curIdx].setAttribute("data-opening-hours-current-day", "");

      const today = schedule[curIdx];
      const yesterday = schedule[(curIdx + 6) % 7];

      let isOpen = false;
      if (today.open) {
        if (!today.overnight) {
          isOpen = nowMin >= today.openMin && nowMin < today.closeMin;
        } else {
          isOpen = nowMin >= today.openMin || nowMin < today.closeMin;
        }
      }
      if (
        !isOpen &&
        yesterday.open &&
        yesterday.overnight &&
        nowMin < yesterday.closeMin
      ) {
        isOpen = true;
      }

      ordered.forEach((row, idx) => {
        row.setAttribute(
          "data-opening-hours-status",
          idx === curIdx && isOpen ? "open" : "closed",
        );
      });

      root.setAttribute(
        "data-opening-hours-store-status",
        isOpen ? "open" : "closed",
      );
    };

    evaluate();
    clearInterval(root._openingHoursTimer);
    root._openingHoursTimer = setInterval(evaluate, 60 * 1000);

    const visHandler = () => {
      if (!page.hidden) evaluate();
    };
    if (root._openingHoursVisHandler) {
      page.removeEventListener(
        "visibilitychange",
        root._openingHoursVisHandler,
      );
    }
    root._openingHoursVisHandler = visHandler;
    page.addEventListener("visibilitychange", visHandler);
  });

  // if (DEBUG) console.log("Opening hours initialized");
}
function initFooterSignature(page = document) {
  const main = page.querySelector("#main-text"),
    random = page.querySelector("#random-text"),
    trigger = page.querySelector("#signature-trigger"),
    SOURCE = "Powered by AVOSS",
    CHARS =
      "E?n\\H(BmsRKk~SFV9J/gWy!*xaGA6[L]I7QDv-3pYz#t}T^O|{%$r1McPUXe0dij4&ubwfN)Z+h8Cqo25l",
    RAND_LENGTH = 5,
    SPEED = 50;
  let intervalId = null,
    isAnimating = !1;
  const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  function scramble(t) {
    return Array.from(
      {
        length: t,
      },
      randChar,
    ).join("");
  }

  function startAnimation() {
    if (isAnimating) return;
    ((isAnimating = !0), (main.textContent = ""), (random.textContent = ""));
    let t = 0,
      n = 0,
      e = SOURCE.length;
    intervalId = setInterval(() => {
      if (t < 5) {
        (t++, (random.textContent = scramble(t)));
        return;
      }
      if (n < e) {
        main.textContent += SOURCE[n++];
        let i = e - n,
          r = Math.min(5, i);
        r > 0
          ? (random.textContent = scramble(r))
          : ((random.textContent = ""),
            clearInterval(intervalId),
            (isAnimating = !1));
      }
    }, 50);
  }

  function resetAnimation() {
    (clearInterval(intervalId),
      (intervalId = null),
      (isAnimating = !1),
      (main.textContent = ""),
      (random.textContent = ""));
  }

  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      let t = document.body.clientHeight,
        e = new ResizeObserver((e) => {
          for (let n of e) {
            let o = n.contentRect.height,
              i = Math.abs(o - t);
            i >= 5 && ((t = o), ScrollTrigger.refresh());
          }
        });
      (e.observe(document.body),
        ScrollTrigger.create({
          trigger,
          start: "top bottom",
          end: "bottom top",
          onEnter: startAnimation,
          onEnterBack: startAnimation,
          onLeave: resetAnimation,
          onLeaveBack: resetAnimation,
          scrub: !1,
          toggleActions: "none",
        }));
    },
    "(max-width: 991px)": function () {
      main.textContent = SOURCE;
    },
  });

  // if (DEBUG) console.log("Footer signature animation initialized");
}
function setCopyrightYear(page = document) {
  const yearElement = page.querySelector("[data-copyright-year]");
  if (!yearElement) return;
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;

  // if (DEBUG) console.log("Copyright year set to", currentYear);
}
function initFooterLinkHoverAnimation(page = document) {
  const linkWraps = page.querySelectorAll("[data-footer-link-wrap]");

  const canHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    window.innerWidth > 991;

  linkWraps.forEach((wrap) => {
    const links = Array.from(wrap.querySelectorAll("[data-footer-link]"));

    links.forEach((link) => {
      link.addEventListener("pointerenter", () => {
        if (!canHover()) return;

        gsap.to(links, {
          autoAlpha: 0.5,
          duration: 0.3,
          ease: "smooth",
          overwrite: true,
        });

        gsap.to(link, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "smooth",
          overwrite: true,
        });
      });
    });

    wrap.addEventListener("pointerleave", () => {
      if (!canHover()) return;
      gsap.to(links, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "smooth",
        overwrite: true,
      });
    });
  });

  // if (DEBUG) console.log("Footer link hover animation initialized");
}
function initCopyEmailClipboard(page = document) {
  const buttons = page.querySelectorAll("[data-copy-email-button]");
  if (!buttons.length) return;

  const copyEmail = (button) => {
    // Email to copy to clipboard is taking from the button itself, or if that's empty,
    // from a text element inside the button
    const email =
      button.getAttribute("data-copy-email") ||
      button.querySelector("[data-copy-email-element]").textContent.trim();
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        button.setAttribute("data-copy-button", "copied");
        button.setAttribute("aria-label", "Email copied to clipboard!");

        const textElement = button.querySelector(
          "[data-copy-email-element-text]",
        );
        if (textElement) {
          const textElementOriginalText = textElement.textContent; // store original text
          textElement.textContent =
            button.getAttribute("data-copy-email-copied-text") || "Copied!"; // change to "Copied!"
          setTimeout(
            () => {
              textElement.textContent = textElementOriginalText; // revert to original text
            },
            button.getAttribute("data-copy-email-duration") || 2000,
          ); // default to 2 seconds if no custom duration provided
        } else {
          const originalText = button.textContent; // store original text
          button.textContent =
            button.getAttribute("data-copy-email-copied-text") || "Copied!"; // change to "Copied!"
          setTimeout(
            () => {
              button.textContent = originalText; // revert to original text
            },
            button.getAttribute("data-copy-email-duration") || 2000,
          ); // default to 2 seconds if no custom duration provided
        }
      });
    }
  };

  const handleInteraction = (e) => {
    if (
      e.type === "click" ||
      (e.type === "keydown" && (e.key === "Enter" || e.key === " "))
    ) {
      e.preventDefault();
      copyEmail(e.currentTarget);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener("click", handleInteraction);
    button.addEventListener("keydown", handleInteraction);
    button.addEventListener("mouseleave", () => {
      // Remove 'active' attribute to reset color and text transform
      button.removeAttribute("data-copy-button");
      // Remove focus on mouseleave to clear keyboard focus styling
      button.blur();
      button.setAttribute("aria-label", "Copy email to clipboard");
    });
    button.addEventListener("blur", () => {
      button.removeAttribute("data-copy-button");
      button.setAttribute("aria-label", "Copy email to clipboard");
    });
  });

  // if (DEBUG) console.log("Copy email to clipboard initialized");
}
function initFooterLogoFlowerSpin(page = document) {
  const animationTrigger = page.querySelector("[data-footer]");
  const logo = page.querySelector("[data-footer-logo-flower]");
  if (!animationTrigger || !logo) return;

  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      gsap.fromTo(
        logo,
        {
          rotation: 0,
        },
        {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: animationTrigger,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
  });

  // if (DEBUG) console.log("Footer logo flower spin initialized");
}

//form specific
function formRandomUUID(form) {
  const uuid = crypto.randomUUID();
  const formName = form.getAttribute("data-name") || "Nova Poruka - ";
  const newFormName = formName + " #" + uuid;
  form.setAttribute("data-name", newFormName);

  if (DEBUG) console.log("Form name changed to: " + form.getAttribute("data-name"));
}
function initBasicFormValidation(page = document) {
  const forms = page.querySelectorAll("[data-form-validate]");

  forms.forEach((form) => {
    const fields = form.querySelectorAll(
      "[data-validate] input, [data-validate] textarea",
    );
    const submitButtonDiv = form.querySelector("[data-submit]"); // The div wrapping the submit button
    const submitInput = submitButtonDiv.querySelector('input[type="submit"]'); // The actual submit button

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest("[data-validate]"); // Get the parent div
      const minLength = field.getAttribute("min");
      const maxLength = field.getAttribute("max");
      const type = field.getAttribute("type");
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== "") {
        parent.classList.add("is--filled");
      } else {
        parent.classList.remove("is--filled");
      }

      // Validation logic for min and max length
      if (minLength && field.value.length < minLength) {
        isValid = false;
      }

      if (maxLength && field.value.length > maxLength) {
        isValid = false;
      }

      // Validation logic for email input type
      function isValidEmail(email) {
        if (typeof email !== "string") return false;
        if (email.length === 0 || email.length > 254) return false;
        if (email !== email.trim()) return false;
        if (
          email.includes("\n") ||
          email.includes("\r") ||
          email.includes("\t")
        )
          return false;

        const atParts = email.split("@");
        if (atParts.length !== 2) return false;

        const [local, domain] = atParts;

        if (!local || !domain) return false;
        if (local.length > 64) return false;
        if (domain.length > 253) return false;

        if (!isValidLocalPart(local)) return false;
        if (!isValidDomain(domain)) return false;

        return true;
      }

      function isValidLocalPart(local) {
        // Quoted local part: "john..doe"@example.com
        if (local.startsWith('"') && local.endsWith('"')) {
          const inner = local.slice(1, -1);

          if (inner.length === 0) return false;

          for (let i = 0; i < inner.length; i++) {
            const char = inner[i];

            if (char === "\\") {
              i++;
              if (i >= inner.length) return false;
              continue;
            }

            const code = char.charCodeAt(0);

            if (code < 32 || code === 127) return false;
            if (char === '"') return false;
          }

          return true;
        }

        // Unquoted local part
        const localRegex =
          /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;

        return localRegex.test(local);
      }

      function isValidDomain(domain) {
        // Domain literal: user@[192.168.1.1]
        if (domain.startsWith("[") && domain.endsWith("]")) {
          const literal = domain.slice(1, -1);

          if (isValidIPv4(literal)) return true;

          if (literal.toLowerCase().startsWith("ipv6:")) {
            return isValidIPv6(literal.slice(5));
          }

          return false;
        }

        if (domain.endsWith(".")) return false;

        let asciiDomain;

        try {
          asciiDomain = new URL("http://" + domain).hostname;
        } catch {
          return false;
        }

        if (!asciiDomain || asciiDomain.length > 253) return false;

        const labels = asciiDomain.split(".");
        if (labels.length < 2) return false;

        for (const label of labels) {
          if (!label) return false;
          if (label.length > 63) return false;
          if (!/^[A-Za-z0-9-]+$/.test(label)) return false;
          if (label.startsWith("-") || label.endsWith("-")) return false;
        }

        const tld = labels[labels.length - 1];
        if (!/^[A-Za-z]{2,63}$/.test(tld)) return false;

        return true;
      }
      // if (type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
      if (type === "email" && !isValidEmail(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove("is--error");
        parent.classList.add("is--success");
      } else {
        parent.classList.remove("is--success");
        parent.classList.add("is--error");
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener("input", function () {
        validateField(field);
      });
    };

    // Function to validate and start live validation for all fields, focusing on the first field with an error
    const validateAndStartLiveValidationForAll = () => {
      let allValid = true;
      let firstInvalidField = null;

      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid && !firstInvalidField) {
          firstInvalidField = field; // Track the first invalid field
        }
        if (!valid) {
          allValid = false;
        }
        startLiveValidation(field); // Start live validation for all fields
      });

      // If there is an invalid field, focus on the first one
      if (firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    };

    // Anti-spam: Check if form was filled too quickly
    const isSpam = () => {
      const currentTime = new Date().getTime();
      const timeDifference = (currentTime - formLoadTime) / 1000; // Convert milliseconds to seconds
      return timeDifference < 5; // Return true if form is filled within 5 seconds
    };

    // Handle clicking the custom submit button
    submitButtonDiv.addEventListener("click", function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert("Form submitted too quickly. Please try again.");
          return; // Stop form submission
        }
        submitInput.click(); // Simulate a click on the <input type="submit">
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert("Form submitted too quickly. Please try again.");
            return; // Stop form submission
          }
          submitInput.click(); // Trigger our custom form submission
        }
      }
    });
  });

  if (DEBUG) console.log("Basic form validation initialized");
}

//faq
function initFAQ(page = document) {
  const faqItems = page.querySelectorAll("[data-faq-item]");

  faqItems.forEach((item) => {
    const question = item.querySelector("[data-faq-question]");
    const answer = item.querySelector("[data-faq-answer]");

    if (!question || !answer) return;

    const faqIconWrap = item.querySelector("[data-faq-icon-wrap]");
    const faqIcon = item.querySelector("[data-faq-icon]");
    const faqIconBar = faqIcon?.querySelector("[data-faq-icon-bar]");

    const faqAnimationDuration = 0.25;

    const openTimeline = gsap.timeline({ paused: true });
    const closeTimeline = gsap.timeline({ paused: true });

    openTimeline
      .to(
        answer,
        {
          height: "auto",
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        faqIconWrap,
        {
          backgroundColor: colors.white,
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        faqIconBar,
        {
          rotationZ: 0,
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        faqIcon,
        {
          rotationZ: 180,
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      );

    closeTimeline
      .to(
        answer,
        {
          height: "0px",
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        faqIconWrap,
        {
          backgroundColor: colors.main,
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        faqIconBar,
        {
          rotationZ: 90,
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      )
      .to(
        faqIcon,
        {
          rotationZ: -180,
          duration: faqAnimationDuration,
          ease: "power1.inOut",
        },
        0,
      );

    // Set initial state
    closeTimeline.restart();

    question.addEventListener("click", () => {
      let isOpen = item.getAttribute("data-faq-open") === "true";

      if (isOpen) {
        closeTimeline.restart();

        item.setAttribute("data-faq-open", "false");

        if (DEBUG)
          console.log(
            "FAQ item closed:",
            question.textContent.trim(),
            item.getAttribute("data-faq-open"),
          );
      } else {
        openTimeline.restart();

        item.setAttribute("data-faq-open", "true");

        // if (DEBUG) console.log("FAQ item opened:", question.textContent.trim(), item.getAttribute("data-faq-open"));
      }
    });
  });

  if (hasLenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }

  if (DEBUG) console.log("FAQ initialized");
}
function initFAQSectionAnimation(page = document) {
  const faqSection = page.querySelector("[data-faq-section]");
  if (!faqSection) return;

  const faqItems = faqSection.querySelectorAll("[data-faq-item]");
  if (faqItems.length === 0) return;

  gsap.fromTo(
    faqItems,
    {
      autoAlpha: 0,
      yPercent: 75,
    },
    {
      autoAlpha: 1,
      yPercent: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: faqSection,
        start: "top 50%",
        end: "bottom top",
        markers: DEBUG,
      },
    },
  );
  // if (DEBUG) console.log("FAQ section animation initialized");
}

// steps section animation
function initStepsFlowerAnimation(page = document) {
  const steps = page.querySelectorAll("[data-step]");
  if (steps.length === 0) return;

  const flowers = page.querySelectorAll("[data-steps-flower]");
  if (flowers.length === 0) return;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const flower = flowers[i];

    // ScrollTrigger.matchMedia({
    //   "(min-width: 992px)": function () {
    gsap.fromTo(
      flower,
      {
        rotation: 0,
      },
      {
        rotation: 360,
        ease: "none",
        scrollTrigger: {
          trigger: step,
          start: "top center",
          end: "bottom center",
          scrub: true,
          markers: DEBUG,
        },
      },
    );
  }
  //   });
  // }

  // if (DEBUG) console.log("Steps flower animation initialized");
}
// function initStepsProgressBarAnimation(page = document) {
//   const container = page.querySelector("[data-steps-container]");
//   if (!container) return;
//   const wrap = page.querySelector("[data-steps-progress-wrap]");
//   if (!wrap) return;
//   const progressBar = wrap.querySelector("[data-steps-progress-bar]");
//   if (!progressBar) return;

//   gsap.fromTo(progressBar, {
//     height: "0%",
//   }, {
//     height: "100%",
//     ease: "none",
//     scrollTrigger: {
//       trigger: container,
//       start: "top center",
//       end: "bottom center",
//       scrub: true,
//       markers: DEBUG,
//     }
//   });

//   // if (DEBUG) console.log("Steps progress bar animation initialized");
// }
function initStepsScrollAnimation(page = document) {
  const steps = page.querySelectorAll("[data-step]");
  if (steps.length === 0) return;

  const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

  const startTriggerDesktop = "top 45%";
  const endTriggerDesktop = "top 35%";

  const startTriggerMobile = "top 55%";
  const endTriggerMobile = "top 45%";

  steps.forEach((step) => {
    const stepLeft = step.querySelector("[data-step-left]");
    const stepRight = step.querySelector("[data-step-right]");
    if (!stepLeft || !stepRight) return;

    gsap.fromTo(
      [stepLeft, stepRight],
      {
        autoAlpha: 0.25,
      },
      {
        autoAlpha: 1,
        scrollTrigger: {
          trigger: step,
          start: () => (isMobile() ? startTriggerMobile : startTriggerDesktop),
          end: () => (isMobile() ? endTriggerMobile : endTriggerDesktop),
          scrub: 1,
          invalidateOnRefresh: true,
          markers: DEBUG,
        },
      },
    );
  });

  if (DEBUG) console.log("Steps scroll animation initialized");
}

// blog
function initBlogPostDate(page = document) {
  let dateElements = page.querySelectorAll("[data-creation-date]");
  if (dateElements.length === 0) return;

  dateElements.forEach((dateElement) => {
    let date = new Date(dateElement.getAttribute("data-creation-date"));
    let monthText = [
      "Januar",
      "Februar",
      "Mart",
      "April",
      "Maj",
      "Jun",
      "Jul",
      "Avgust",
      "Septembar",
      "Oktobar",
      "Novembar",
      "Decembar",
    ];
    dateElement.textContent =
      date.getDate() +
      ". " +
      monthText[date.getMonth()] +
      " " +
      date.getFullYear();
  });

  // if (DEBUG) console.log("Blog post dates initialized");
}
function initBlogPostFilter(page = document) {
  // Find all filter groups on the page
  const groups = page.querySelectorAll("[data-filter-group]");

  groups.forEach((group) => {
    const buttons = group.querySelectorAll("[data-filter-target]");
    const items = group.querySelectorAll("[data-filter-name]");
    const transitionDelay = 300; // Delay for transition effect (in milliseconds)

    // Function to update the status and accessibility attributes of items
    const updateStatus = (element, shouldBeActive) => {
      // If the item should be active, set it to "active", otherwise "not-active"
      element.setAttribute(
        "data-filter-status",
        shouldBeActive ? "active" : "not-active",
      );
      element.setAttribute("aria-hidden", shouldBeActive ? "false" : "true");
    };

    // Function to handle filtering logic when a button is clicked
    const handleFilter = (target) => {
      // Loop through all items and ensure every item transitions out first
      items.forEach((item) => {
        const shouldBeActive =
          target === "all" || item.getAttribute("data-filter-name") === target;
        const currentStatus = item.getAttribute("data-filter-status");

        // Only transition items currently visible (status: active)
        if (currentStatus === "active") {
          item.setAttribute("data-filter-status", "transition-out");
          // After the transition delay, set the final status
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          // For items not currently visible, simply update their status after the delay
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      // Update the active status for all buttons
      buttons.forEach((button) => {
        const isActive = button.getAttribute("data-filter-target") === target;
        button.setAttribute(
          "data-filter-status",
          isActive ? "active" : "not-active",
        );
        button.setAttribute("aria-pressed", isActive ? "true" : "false"); // Accessibility: indicate active state
      });
    };

    // Attach click event listeners to each button
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-filter-target");

        // If the button is already active, do nothing
        if (button.getAttribute("data-filter-status") === "active") return;

        // Trigger the filter logic with the selected target
        handleFilter(target);
      });
    });
  });

  // if (DEBUG) console.log("Blog post filter initialized");
}
function initBlogPostHoverAnimation(page = document) {
  const blogPostItems = page.querySelectorAll("[data-blog-post-item]");
  if (blogPostItems.length === 0) return;

  blogPostItems.forEach((post) => {
    const animationTrigger = post.querySelector("[data-blog-item-link]");
    if (!animationTrigger) return;

    const postButton = post.querySelector("[data-button-hover-animation]");
    if (!postButton) return;

    const animationElements = postButton.querySelectorAll(
      "[data-button-arrow]",
    );
    if (animationElements.length === 0) return;

    animationTrigger.addEventListener("mouseenter", () => {
      animateButtonHoverON(animationElements);
    });
    animationTrigger.addEventListener("mouseleave", () => {
      animateButtonHoverOFF(animationElements);
    });
  });

  // if (DEBUG) console.log("Blog post hover animation initialized");
}

// BMI calc
function initBMICalculatorV3(page = document) {
  const heightInput = page.querySelector("[data-bmi-height]");
  const weightInput = page.querySelector("[data-bmi-weight]");

  const heightErrorText = page.querySelector("[data-bmi-height-error-text]");
  const weightErrorText = page.querySelector("[data-bmi-weight-error-text]");

  const rangeIndicator = page.querySelector("[data-bmi-range-indicator]");
  const rangeIndicatorTextWrap = page.querySelector(
    "[data-bmi-indicator-text-wrap]",
  );
  const rangeIndicatorText = page.querySelector(
    "[data-bmi-indicator-text-main]",
  );
  const rangeIndicatorSecondaryText = page.querySelector(
    "[data-bmi-indicator-text-secondary]",
  );
  const rangeIndicatorErrorText = page.querySelector(
    "[data-bmi-indicator-text-error]",
  );
  // Optional: your main result/error element
  const mainResultText = page.querySelector("[data-bmi-result-text]");
  const mainTextWrap = page.querySelector("[data-main-text-wrap]");

  const inputs = {
    height: {
      input: heightInput,
      error: heightErrorText,
      min: 100,
      max: 250,
      unitString: "cm",
      touched: false,
    },
    weight: {
      input: weightInput,
      error: weightErrorText,
      min: 30,
      max: 300,
      unitString: "kg",
      touched: false,
    },
  };

  let hasCalculated = false;

  const setError = (field, message = "") => {
    const { input, error } = inputs[field];

    const hasError = Boolean(message);

    input.classList.toggle("is-error", hasError);

    if (error) {
      error.textContent = message;
      error.classList.toggle("is-visible", hasError);
    }
  };

  const validateField = (field) => {
    const { input, min, max, unitString } = inputs[field];

    const value = input.value.trim();

    // Empty fields aren't considered an error while typing.
    if (!value) {
      return {
        valid: true,
        empty: true,
      };
    }

    const number = Number(value);

    // Invalid number
    if (!Number.isFinite(number)) {
      return {
        valid: false,
        empty: false,
        message: "Unesite ispravan broj",
      };
    }

    // Below minimum
    if (number < min) {
      return {
        valid: false,
        empty: false,
        message: `Minimalna vrednost je ${min}${unitString}`,
      };
    }

    // Above maximum
    if (number > max) {
      return {
        valid: false,
        empty: false,
        message: `Maksimalna vrednost je ${max}${unitString}`,
      };
    }

    return {
      valid: true,
      empty: false,
    };
  };

  const validateAll = () => {
    const height = validateField("height");
    const weight = validateField("weight");

    // Only display field errors after the field has been touched.
    if (inputs.height.touched) {
      setError("height", height.valid ? "" : height.message);
    }

    if (inputs.weight.touched) {
      setError("weight", weight.valid ? "" : weight.message);
    }

    const hasInvalidField = !height.valid || !weight.valid;

    const hasEmptyField = height.empty || weight.empty;

    return {
      height,
      weight,
      hasInvalidField,
      hasEmptyField,
      valid: !hasInvalidField && !hasEmptyField,
    };
  };

  // const updateMainMessage = () => {
  //   const state = validateAll();
  //   const errorTextString = "Molimo ispravite označene vrednosti.";

  //   if (!mainResultText) {
  //     mainTextWrap.style.display = "none";
  //     rangeIndicatorText.textContent = "";
  //     rangeIndicatorSecondaryText.textContent = "";
  //     rangeIndicatorErrorText.textContent = errorTextString;
  //     return state;
  //   }

  //   if (state.hasInvalidField) {
  //     // rangeIndicatorSecondaryText.textContent = errorTextString;
  //     return state;
  //   }

  //   // Don't show an error while the user hasn't completed both fields.
  //   if (state.hasEmptyField) {
  //     rangeIndicatorSecondaryText.textContent = "";
  //     return state;
  //   }

  //   // Everything is valid.
  //   rangeIndicatorSecondaryText.textContent = "";

  //   return state;
  // };

  const updateMainMessage = () => {
    const state = validateAll();
    const errorTextString = "Molimo ispravite označene vrednosti.";

    if (!mainResultText) {
      mainTextWrap.style.display = "none";
      rangeIndicatorText.textContent = "";
      rangeIndicatorSecondaryText.textContent = "";

      if (hasCalculated && state.hasInvalidField) {
        rangeIndicatorErrorText.textContent = errorTextString;
      } else {
        rangeIndicatorErrorText.textContent = "";
      }

      return state;
    }

    if (state.hasInvalidField) {
      if (hasCalculated) {
        rangeIndicatorErrorText.textContent = errorTextString;
      }

      return state;
    }

    if (state.hasEmptyField) {
      rangeIndicatorSecondaryText.textContent = "";
      return state;
    }

    rangeIndicatorErrorText.textContent = "";

    return state;
  };

  function updateBMIResultText(
    BMI,
    error = false,
    errorText = "Neispravan unos",
  ) {
    let indicatorText = "";

    switch (true) {
      case BMI < 18.5:
        indicatorText = "Pothranjenost";
        break;
      case BMI < 25:
        indicatorText = "Normalna težina";
        break;
      case BMI < 30:
        indicatorText = "Prekomerna težina";
        break;
      case BMI < 35:
        indicatorText = "Gojaznost I stepena";
        break;
      case BMI < 40:
        indicatorText = "Gojaznost II stepena";
        break;
      case BMI >= 40:
        indicatorText = "Gojaznost III stepena";
        break;
    }

    mainTextWrap.style.display = "block";
    rangeIndicatorText.textContent = BMI.toFixed(2);
    rangeIndicatorSecondaryText.textContent = indicatorText;
    rangeIndicatorErrorText.textContent = "";
  }

  const calculateBMI = () => {
    const state = updateMainMessage();

    if (!state.valid) {
      return;
    }

    const height = Number(heightInput.value);
    const weight = Number(weightInput.value);

    // const heightInMeters = height / 100;
    let bmi = weight / Math.pow(height / 100, 2);
    bmi = Math.round((bmi + Number.EPSILON) * 100) / 100;

    const rangeIndicatorMultiplier = 2;
    let rangeIndicatorPosition =
      Math.round((bmi * rangeIndicatorMultiplier + Number.EPSILON) * 100) / 100;

    if (rangeIndicatorPosition < 0) rangeIndicatorPosition = 0;
    if (rangeIndicatorPosition > 100) rangeIndicatorPosition = 100;

    rangeIndicator.style.left = rangeIndicatorPosition + "%";

    if (document.body.clientWidth > 991) {
      rangeIndicatorTextWrap.style.left = rangeIndicatorPosition + "%";
    } else {
      rangeIndicatorTextWrap.style.left = "0%";
    }

    // Update your result here
    updateBMIResultText(bmi);
    hasCalculated = true;
    // console.log(bmi);
  };

  // ------------------------------------
  // Input events
  // ------------------------------------

  heightInput.addEventListener("input", () => {
    inputs.height.touched = true;
    calculateBMI();
  });

  weightInput.addEventListener("input", () => {
    inputs.weight.touched = true;
    calculateBMI();
  });

  // ------------------------------------
  // Blur events
  // ------------------------------------

  heightInput.addEventListener("blur", () => {
    inputs.height.touched = true;

    const state = validateField("height");

    if (state.empty) {
      setError("height", "This field is required.");
    } else {
      setError("height", state.valid ? "" : state.message);
    }

    calculateBMI();
  });

  weightInput.addEventListener("blur", () => {
    inputs.weight.touched = true;

    const state = validateField("weight");

    if (state.empty) {
      setError("weight", "This field is required.");
    } else {
      setError("weight", state.valid ? "" : state.message);
    }

    calculateBMI();
  });

  initBMICalculatorIndicatorFlowerSpinAnimation();
}
function initBMICalculatorIndicatorFlowerSpinAnimation(page = document) {
  const rangeIndicator = page.querySelector("[data-bmi-range-indicator]");
  const flower = page.querySelector("[data-indicator-flower]");

  const initialRight = parseFloat(getComputedStyle(rangeIndicator).right);
  const parentWidth = rangeIndicator.parentElement.offsetWidth;

  gsap.ticker.add(() => {
    const right = parseFloat(getComputedStyle(rangeIndicator).right);

    const progress = (initialRight - right) / parentWidth;

    gsap.set(flower, {
      rotation: progress * 360,
    });
  });
}

function initBMICalculatorV2(page = document) {
  const heightInput = page.querySelector("[data-bmi-height]");
  const weightInput = page.querySelector("[data-bmi-weight]");

  if (!heightInput || !weightInput) return;

  let calculated = false;

  const rangeIndicator = page.querySelector("[data-bmi-range-indicator]");
  const rangeIndicatorTextWrap = page.querySelector(
    "[data-bmi-indicator-text-wrap]",
  );
  const rangeIndicatorText = page.querySelector(
    "[data-bmi-indicator-text-main]",
  );
  const rangeIndicatorSecondaryText = page.querySelector(
    "[data-bmi-indicator-text-secondary]",
  );
  const rangeIndicatorErrorText = page.querySelector(
    "[data-bmi-indicator-text-error]",
  );
  const mainTextWrap = page.querySelector("[data-main-text-wrap]");

  const heightErrorText = page.querySelector("[data-bmi-height-error-text]");
  const weightErrorText = page.querySelector("[data-bmi-weight-error-text]");

  const weightMIN = 30;
  const weightMAX = 300;
  const heightMIN = 100;
  const heightMAX = 250;
  const defaultRangeIndicatorPosition = "42.44%";

  function updateText(BMI, error = false, errorText = "Neispravan unos") {
    if (error) {
      mainTextWrap.style.display = "none";
      rangeIndicatorText.textContent = "";
      rangeIndicatorSecondaryText.textContent = "";
      rangeIndicatorErrorText.textContent = errorText;
      return;
    }

    let indicatorText = "";

    switch (true) {
      case BMI < 18.5:
        indicatorText = "Pothranjenost";
        break;
      case BMI < 25:
        indicatorText = "Normalna težina";
        break;
      case BMI < 30:
        indicatorText = "Prekomerna težina";
        break;
      case BMI < 35:
        indicatorText = "Gojaznost I stepena";
        break;
      case BMI < 40:
        indicatorText = "Gojaznost II stepena";
        break;
      case BMI >= 40:
        indicatorText = "Gojaznost III stepena";
        break;
    }

    mainTextWrap.style.display = "block";
    rangeIndicatorText.textContent = BMI.toFixed(2);
    rangeIndicatorSecondaryText.textContent = indicatorText;
    rangeIndicatorErrorText.textContent = "";
  }

  function showError(inputType) {
    if (inputType === "weight") {
      weightInput.classList.add("error");

      gsap.to(weightErrorText, {
        autoAlpha: 1,
        duration: 0.25,
      });
    }

    if (inputType === "height") {
      heightInput.classList.add("error");

      gsap.to(heightErrorText, {
        autoAlpha: 1,
        duration: 0.25,
      });
    }
  }

  function hideError(inputType) {
    if (inputType === "weight") {
      weightInput.classList.remove("error");

      gsap.to(weightErrorText, {
        autoAlpha: 0,
        duration: 0.25,
      });
    }

    if (inputType === "height") {
      heightInput.classList.remove("error");

      gsap.to(heightErrorText, {
        autoAlpha: 0,
        duration: 0.25,
      });
    }
  }

  function getInputNumber(input) {
    const value = input.value.trim();

    if (value === "") return null;

    const number = Number(value);

    return Number.isFinite(number) ? number : NaN;
  }

  function validateRange(value, min, max) {
    if (value === null) {
      return {
        empty: true,
        invalid: false,
      };
    }

    return {
      empty: false,
      invalid: !Number.isFinite(value) || value < min || value > max,
    };
  }

  function resetIndicatorPosition() {
    if (document.body.clientWidth > 991) {
      rangeIndicator.style.left = defaultRangeIndicatorPosition;
      rangeIndicatorTextWrap.style.left = defaultRangeIndicatorPosition;
    } else {
      rangeIndicator.style.left = "0%";
      rangeIndicatorTextWrap.style.left = "0%";
    }
  }

  let heightTouched = false;
  let weightTouched = false;

  function calcBMI() {
    const height = getInputNumber(heightInput);
    const weight = getInputNumber(weightInput);

    const heightState = validateRange(height, heightMIN, heightMAX);
    const weightState = validateRange(weight, weightMIN, weightMAX);

    const heightEmptyError = heightState.empty && heightTouched;
    const weightEmptyError = weightState.empty && weightTouched;

    if (heightState.invalid || heightEmptyError) {
      if (calculated) showError("height");
    } else {
      hideError("height");
    }

    if (weightState.invalid || weightEmptyError) {
      if (calculated) showError("weight");
    } else {
      hideError("weight");
    }

    if (heightState.empty || weightState.empty) {
      const errorText =
        heightEmptyError && weightEmptyError
          ? "Unesite visinu i težinu"
          : heightEmptyError
            ? "Unesite visinu"
            : weightEmptyError
              ? "Unesite težinu"
              : "";

      if (errorText) {
        updateText(null, true, errorText);
        resetIndicatorPosition();
      }

      return;
    }

    if (heightState.invalid || weightState.invalid) {
      const errorText =
        heightState.invalid && weightState.invalid
          ? "Visina i težina su van opsega"
          : heightState.invalid
            ? "Visina je van opsega"
            : "Težina je van opsega";

      updateText(null, true, errorText);
      resetIndicatorPosition();
      return;
    }

    let BMI = weight / Math.pow(height / 100, 2);
    BMI = Math.round((BMI + Number.EPSILON) * 100) / 100;

    const rangeIndicatorMultiplier = 2;
    let rangeIndicatorPosition =
      Math.round((BMI * rangeIndicatorMultiplier + Number.EPSILON) * 100) / 100;

    if (rangeIndicatorPosition < 0) rangeIndicatorPosition = 0;
    if (rangeIndicatorPosition > 100) rangeIndicatorPosition = 100;

    rangeIndicator.style.left = rangeIndicatorPosition + "%";

    if (document.body.clientWidth > 991) {
      rangeIndicatorTextWrap.style.left = rangeIndicatorPosition + "%";
    } else {
      rangeIndicatorTextWrap.style.left = "0%";
    }

    updateText(BMI);
    calculated = true;
  }

  heightInput.addEventListener("input", () => {
    heightTouched = true;
    calcBMI();
  });

  weightInput.addEventListener("input", () => {
    weightTouched = true;
    calcBMI();
  });

  window.addEventListener("resize", calcBMI);

  if (DEBUG) console.log("BMI calculator initialized");
}

//TDEE calc
function initTDEECalculatorV3(page = document) {
  const weightMIN = 30;
  const weightMAX = 300;
  const heightMIN = 100;
  const heightMAX = 250;
  const ageMIN = 16;
  const ageMAX = 100;

  const counter = { var: 0 };

  // ------------------------------------
  // Elements
  // ------------------------------------

  const ageInput = page.querySelector("[data-tdee-age]");
  const heightInput = page.querySelector("[data-tdee-height]");
  const weightInput = page.querySelector("[data-tdee-weight]");
  const activitySelect = page.querySelector("[data-activity-select]");
  const genderInputs = page.querySelectorAll('input[name="gender"]');

  const resultTextWrap = page.querySelector("[data-tdee-result-text-wrap]");
  const errorTextWrap = page.querySelector("[data-tdee-error-text-wrap]");
  const errorTextElement = page.querySelector("[data-tdee-error-text]");
  const ageErrorElement = page.querySelector("[data-tdee-age-error-text]");
  const heightErrorElement = page.querySelector("[data-tdee-height-error-text]");
  const weightErrorElement = page.querySelector("[data-tdee-weight-error-text]");
  const selectErrorElement = page.querySelector("[data-tdee-activity-error-text]");
  const resultElement = page.querySelector("[data-tdee-result-main]");

  // ------------------------------------
  // Error messages
  // ------------------------------------

  const errorText = {
    age: "Neispravan unos za godine",
    height: "Neispravan unos za visinu",
    weight: "Neispravan unos za težinu",
    select: "Odaberite nivo aktivnosti",
  };

  // ------------------------------------
  // Field state
  // ------------------------------------

  const fields = {
    age: {
      input: ageInput,
      error: ageErrorElement,
      min: ageMIN,
      max: ageMAX,
      unitString: "godina",
      touched: false,
      errorMessage: errorText.age,
    },

    height: {
      input: heightInput,
      error: heightErrorElement,
      min: heightMIN,
      max: heightMAX,
      unitString: "cm",
      touched: false,
      errorMessage: errorText.height,
    },

    weight: {
      input: weightInput,
      error: weightErrorElement,
      min: weightMIN,
      max: weightMAX,
      unitString: "kg",
      touched: false,
      errorMessage: errorText.weight,
    },

    activity: {
      input: activitySelect,
      error: selectErrorElement,
      touched: false,
      errorMessage: errorText.select,
    },
  };

  // ------------------------------------
  // Validation
  // ------------------------------------

  // function validateNumberField(field) {
  //   const { input, min, max } = fields[field];

  //   const value = input.value.trim();

  //   // Empty is not considered an error while typing.
  //   if (!value) {
  //     return {
  //       valid: true,
  //       empty: true,
  //     };
  //   }

  //   const number = Number(value);

  //   if (!Number.isFinite(number)) {
  //     return {
  //       valid: false,
  //       empty: false,
  //       message: fields[field].errorMessage,
  //     };
  //   }

  //   if (number < min || number > max) {
  //     return {
  //       valid: false,
  //       empty: false,
  //       message: fields[field].errorMessage,
  //     };
  //   }

  //   return {
  //     valid: true,
  //     empty: false,
  //   };
  // }
  function validateNumberField(field) {
    const { input, min, max, unitString } = fields[field];

    const value = input.value.trim();

    // Empty = not an error while typing
    if (!value) {
      return {
        valid: true,
        empty: true,
      };
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
      return {
        valid: false,
        empty: false,
        message: "Unesite ispravnu vrednost",
      };
    }

    if (number < min) {
      return {
        valid: false,
        empty: false,
        message: `Minimalna vrednost je ${min}${unitString}`,
      };
    }

    if (number > max) {
      return {
        valid: false,
        empty: false,
        message: `Maksimalna vrednost je ${max}${unitString}`,
      };
    }

    return {
      valid: true,
      empty: false,
    };
  }


  function validateActivity() {
    const value = Number(activitySelect.value);

    return {
      valid: value !== 0,
      empty: false,
      message: errorText.select,
    };
  }

  // ------------------------------------
  // Error UI
  // ------------------------------------

  function setFieldError(field, message = "") {
    const { input, error } = fields[field];

    const hasError = Boolean(message);

    // Border
    input.classList.toggle("error", hasError);

    // Error text
    if (error) {
      error.textContent = message;

      gsap.to(error, {
        autoAlpha: hasError ? 1 : 0,
        duration: 0.25,
      });
    }
  }

  // ------------------------------------
  // Validate everything
  // ------------------------------------

  function validateAll() {
    const age = validateNumberField("age");
    const height = validateNumberField("height");
    const weight = validateNumberField("weight");
    const activity = validateActivity();

    return {
      age,
      height,
      weight,
      activity,

      valid:
        age.valid &&
        height.valid &&
        weight.valid &&
        activity.valid,

      hasInvalidField:
        !age.valid ||
        !height.valid ||
        !weight.valid ||
        !activity.valid,

      hasEmptyField:
        age.empty ||
        height.empty ||
        weight.empty,
    };
  }

  // ------------------------------------
  // Main error message
  // ------------------------------------

  function getGlobalErrorMessage(state) {
    const errors = [];

    if (!state.age.valid && !state.age.empty) {
      errors.push(errorText.age);
    }

    if (!state.height.valid && !state.height.empty) {
      errors.push(errorText.height);
    }

    if (!state.weight.valid && !state.weight.empty) {
      errors.push(errorText.weight);
    }

    if (!state.activity.valid) {
      errors.push(errorText.select);
    }

    if (errors.length === 1) {
      return errors[0];
    }

    return "Više grešaka u unosu.";
  }

  // ------------------------------------
  // Update validation UI
  // ------------------------------------

  function updateErrorState() {
    const state = validateAll();

    // Individual field errors
    if (fields.age.touched) {
      setFieldError(
        "age",
        state.age.valid ? "" : state.age.message,
      );
    }

    if (fields.height.touched) {
      setFieldError(
        "height",
        state.height.valid ? "" : state.height.message,
      );
    }

    if (fields.weight.touched) {
      setFieldError(
        "weight",
        state.weight.valid ? "" : state.weight.message,
      );
    }

    if (fields.activity.touched) {
      setFieldError(
        "activity",
        state.activity.valid ? "" : state.activity.message,
      );
    }

    // ------------------------------------
    // Global error
    // ------------------------------------

    if (state.hasInvalidField) {
      // if (errorTextWrap) {
      //   errorTextWrap.style.display = "flex";
      // }

      // if (errorTextElement) {
      //   errorTextElement.textContent = getGlobalErrorMessage(state);
      // }

      // if (resultTextWrap) {
      //   resultTextWrap.style.display = "none";
      // }

      return state;
    }

    // Don't show an error while fields are
    // simply incomplete.
    if (state.hasEmptyField) {
      if (errorTextWrap) {
        errorTextWrap.style.display = "none";
      }

      if (errorTextElement) {
        errorTextElement.textContent = "";
      }

      if (resultTextWrap) {
        resultTextWrap.style.display = "none";
      }

      return state;
    }

    // ------------------------------------
    // Everything valid
    // ------------------------------------

    if (errorTextWrap) {
      errorTextWrap.style.display = "none";
    }

    if (errorTextElement) {
      errorTextElement.textContent = "";
    }

    if (resultTextWrap) {
      resultTextWrap.style.display = "flex";
    }

    return state;
  }

  // ------------------------------------
  // TDEE calculation
  // ------------------------------------

  function calcTDEE() {
    const state = validateAll();

    // Never calculate if the form isn't valid.
    if (!state.valid) {
      return;
    }

    const weight = Number(weightInput.value);
    const height = Number(heightInput.value);
    const age = Number(ageInput.value);

    const gender = page.querySelector(
      'input[name="gender"]:checked',
    )?.value;

    const activityIndexArray = [
      1.2,
      1.375,
      1.55,
      1.725,
      1.9,
    ];

    const activityIndex =
      activityIndexArray[
        Number(activitySelect.value) - 1
      ];

    let BMR;

    if (gender === "women") {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
    }

    const TDEEResult = Math.round( BMR * activityIndex );

    // Update all activity result values
    for (let i = 0; i < activityIndexArray.length; i++) {
      const element = page.getElementById?.(String(i + 1));

      if (element) {
        element.textContent = TDEEResult;
      }
    }

    // Main animated result
    if (resultElement) {
      gsap.to(counter, {
        var: TDEEResult,
        duration: 0.5,

        onUpdate: () => {
          resultElement.textContent =
            Math.round(counter.var);
        },
      });
    }
  }

  // ------------------------------------
  // Input events
  // ------------------------------------

  ageInput.addEventListener("input", () => {
    fields.age.touched = true;

    const state = updateErrorState();

    if (state.valid) {
      calcTDEE();
    }
  });

  heightInput.addEventListener("input", () => {
    fields.height.touched = true;

    const state = updateErrorState();

    if (state.valid) {
      calcTDEE();
    }
  });

  weightInput.addEventListener("input", () => {
    fields.weight.touched = true;

    const state = updateErrorState();

    if (state.valid) {
      calcTDEE();
    }
  });

  // ------------------------------------
  // Blur events
  // ------------------------------------

  ageInput.addEventListener("blur", () => {
    fields.age.touched = true;

    const state = validateNumberField("age");

    if (state.empty) {
      setFieldError("age", "Unesite godine.");
    } else {
      setFieldError(
        "age",
        state.valid ? "" : state.message,
      );
    }

    updateErrorState();
  });

  heightInput.addEventListener("blur", () => {
    fields.height.touched = true;

    const state = validateNumberField("height");

    if (state.empty) {
      setFieldError("height", "Unesite visinu.");
    } else {
      setFieldError(
        "height",
        state.valid ? "" : state.message,
      );
    }

    updateErrorState();
  });

  weightInput.addEventListener("blur", () => {
    fields.weight.touched = true;

    const state = validateNumberField("weight");

    if (state.empty) {
      setFieldError("weight", "Unesite težinu.");
    } else {
      setFieldError(
        "weight",
        state.valid ? "" : state.message,
      );
    }

    updateErrorState();
  });

  // ------------------------------------
  // Activity select
  // ------------------------------------

  activitySelect.addEventListener("change", () => {
    fields.activity.touched = true;

    const state = updateErrorState();

    if (state.valid) {
      calcTDEE();
    }
  });

  // ------------------------------------
  // Gender
  // ------------------------------------

  genderInputs.forEach((input) => {
    input.addEventListener("change", () => {
      const state = validateAll();

      if (state.valid) {
        calcTDEE();
      }
    });
  });

  // ------------------------------------
  // Initial state
  // ------------------------------------

  if (errorTextWrap) {
    errorTextWrap.style.display = "none";
  }

  // if (resultTextWrap) {
  //   resultTextWrap.style.display = "none";
  // }

  if (DEBUG) {
    console.log("TDEE calculator initialized");
  }
}

function initTDEECalculatorV2(page = document) {
  var counter = { var: 0 };
  let calculated = false;

  function calcTDEE() {
    let weight = weightInput.value;
    let height = heightInput.value;
    let age = ageInput.value;
    let gender = String(
      page.querySelector('input[name="gender"]:checked').value,
    );
    let BMR = 0;
    let TDEEResult = 0;
    const activityIndexArray = [1.2, 1.375, 1.55, 1.725, 1.9];

    if (gender == "women") {
      BMR = 10 * weight + 6.25 * height - 5 * age - 161;
      TDEEResult = Math.round(
        BMR * activityIndexArray[parseInt(activitySelect.value) - 1],
      );
    } else {
      // men
      BMR = 10 * weight + 6.25 * height - 5 * age + 5;
      TDEEResult = Math.round(
        BMR * activityIndexArray[parseInt(activitySelect.value) - 1],
      );
    }

    for (let i = 0; i < activityIndexArray.length; i++) {
      document.getElementById(String(i + 1)).textContent = TDEEResult;
    }

    let selectedActivityLevel = activitySelect.value;

    let conuterElement = document.querySelector("[data-tdee-result-main]");

    function animateResult(result) {
      gsap.to(counter, 0.5, {
        var: parseInt(result),
        onUpdate: function () {
          let nwc = parseInt(counter.var);
          conuterElement.textContent = nwc;
        },
      });
    }

    animateResult(TDEEResult);
    calculated = true;
  }

  function singleInputCheck(element, min, max) {
    const value = Number(element.value);

    return !(
      element.value.trim() !== "" &&
      Number.isFinite(value) &&
      value >= min &&
      value <= max
    );
  }

  function selectCheck() {
    return Number(activitySelect.value) === 0;
  }

  function hasAnyError() {
    return ageError || heightError || weightError || selectError;
  }

  function getGlobalErrorMessage() {
    const errors = [];

    if (ageError) errors.push(errorText.age);
    if (heightError) errors.push(errorText.height);
    if (weightError) errors.push(errorText.weight);
    if (selectError) errors.push(errorText.select);

    return errors.length === 1 ? errors[0] : "Više grešaka u unosu.";
  }

  function setFieldError(errorElement, inputElement, hasError) {
    const shouldShow = calculated && hasError;

    inputElement.classList.toggle("error", shouldShow);

    gsap.to(errorElement, {
      autoAlpha: shouldShow ? 1 : 0,
      duration: 0.25,
    });
  }

  function updateErrorState() {
    setFieldError(ageErrorElement, ageInput, ageError);
    setFieldError(heightErrorElement, heightInput, heightError);
    setFieldError(weightErrorElement, weightInput, weightError);
    setFieldError(selectErrorElement, activitySelect, selectError);

    if (hasAnyError()) {
      errorTextWrap.style.display = "flex";
      errorTextElement.innerText = getGlobalErrorMessage();
      resultTextWrap.style.display = "none";
      return;
    }

    errorTextWrap.style.display = "none";
    errorTextElement.innerText = "";
    resultTextWrap.style.display = "flex";

    if (!hasAnyError()) {
      calcTDEE();
    }
  }

  const ageInput = document.querySelector("[data-tdee-age]");
  const heightInput = document.querySelector("[data-tdee-height]");
  const weightInput = document.querySelector("[data-tdee-weight]");
  const activitySelect = document.querySelector("[data-activity-select]");
  // const activityLevelResultRows = document.querySelectorAll("[data-tdee-result-row]");
  const genderInputs = document.querySelectorAll('input[name="gender"]');

  const resultTextWrap = document.querySelector("[data-tdee-result-text-wrap]");
  const errorTextWrap = document.querySelector("[data-tdee-error-text-wrap]");
  const errorTextElement = document.querySelector("[data-tdee-error-text]");
  const errorText = {
    age: "Neispravan unos za godine",
    height: "Neispravan unos za visinu",
    weight: "Neispravan unos za težinu",
    select: "Odaberite nivo aktivnosti",
  };
  const ageErrorElement = document.querySelector("[data-tdee-age-error-text]");
  const heightErrorElement = document.querySelector(
    "[data-tdee-height-error-text]",
  );
  const weightErrorElement = document.querySelector(
    "[data-tdee-weight-error-text]",
  );
  const selectErrorElement = document.querySelector(
    "[data-tdee-activity-error-text]",
  );

  if (errorTextWrap) errorTextWrap.style.display = "none";

  let ageError = true;
  let heightError = true;
  let weightError = true;
  let selectError = true;

  ageInput.addEventListener("input", () => {
    ageError = singleInputCheck(ageInput, ageMIN, ageMAX);
    updateErrorState();
  });

  heightInput.addEventListener("input", () => {
    heightError = singleInputCheck(heightInput, heightMIN, heightMAX);
    updateErrorState();
  });

  weightInput.addEventListener("input", () => {
    weightError = singleInputCheck(weightInput, weightMIN, weightMAX);
    updateErrorState();
  });

  activitySelect.addEventListener("change", () => {
    selectError = selectCheck();
    updateErrorState();
  });

  genderInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!ageError && !heightError && !weightError && !selectError) {
        calcTDEE();
      }
    });
  });

  const weightMIN = 30;
  const weightMAX = 300;
  const heightMIN = 100;
  const heightMAX = 250;
  const ageMIN = 16;
  const ageMAX = 100;

  if (DEBUG) console.log("TDEE calculator initialized");
}

//nav
function initNavButtonAnimation() {
  const navWrap = document.querySelector("[data-navbar-wrap]");
  if (!navWrap) return;

  const navButtons = navWrap.querySelectorAll("[data-button-hover-animation]");
  if (navButtons.length === 0) return;

  navButtons.forEach((button) => {
    const animationElements = button.querySelectorAll("[data-button-arrow]");
    if (animationElements.length === 0) return;

    button.addEventListener("mouseenter", () => {
      animateButtonHoverON(animationElements);
    });
    button.addEventListener("mouseleave", () => {
      animateButtonHoverOFF(animationElements);
    });
  });

  // if (DEBUG) console.log("Nav button animation initialized");
}
function initNavLinkHoverAnimation() {
  const navMenu = document.querySelector("[data-nav-menu]");
  if (!navMenu) return;

  const navLinks = Array.from(navMenu.querySelectorAll("[data-nav-link]"));
  if (navLinks.length === 0) return;

  const canHover = () =>
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    window.innerWidth > 991;

  navLinks.forEach((link) => {
    link.addEventListener("pointerenter", () => {
      if (!canHover()) return;

      gsap.to(navLinks, {
        autoAlpha: 0.5,
        duration: 0.3,
        ease: "smooth",
        overwrite: true,
        // onComplete: () => {
        // if (DEBUG) console.log("Nav links dimmed for hover effect");
        // },
      });

      gsap.to(link, {
        autoAlpha: 1,
        duration: 0.3,
        ease: "smooth",
        overwrite: true,
      });
    });
  });

  navMenu.addEventListener("pointerleave", () => {
    if (!canHover()) return;

    gsap.to(navLinks, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "smooth",
      overwrite: true,
      // onComplete: () => {
      // if (DEBUG) console.log("Nav links opacity reset after hover");
      // },
    });
  });

  // if (DEBUG) console.log("Nav link hover animation initialized");
}
function handleMobileNavLinkClick() {
  const navMenu = document.querySelector("[data-nav-menu]");
  if (!navMenu) return;
  const navMenuButton = document.querySelector("[data-nav-mobile-menu-button]");
  if (!navMenuButton) return;
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 991) {
        navMenuButton.click(); // Simulate a click on the mobile nav menu button to close the menu
        // if (DEBUG) console.log("Mobile nav link clicked, closing mobile menu");
      }
    });
  });

  // if (DEBUG) console.log("Mobile nav link click handling initialized");
}

//element animations
function animateButtonHoverON(animationElements) {
  gsap.fromTo(
    animationElements,
    {
      x: "-50%",
    },
    {
      x: "50%",
      duration: 0.3,
      ease: "smooth",
    },
  );
}
function animateButtonHoverOFF(animationElements) {
  gsap.set(animationElements, {
    x: "-50%",
  });
}
function initButtonHoverAnimation(page = document) {
  const buttons = page.querySelectorAll("[data-button-hover-animation]");
  if (buttons.length === 0) return;

  buttons.forEach((button) => {
    const animationElements = button.querySelectorAll("[data-button-arrow]");
    if (animationElements.length === 0) return;

    button.addEventListener("mouseenter", () => {
      animateButtonHoverON(animationElements);
    });
    button.addEventListener("mouseleave", () => {
      animateButtonHoverOFF(animationElements);
    });
  });

  // if (DEBUG) console.log("Button hover animation initialized");
}

function initSixCardAnimations(page = document) {
  const cards = page.querySelectorAll("[data-six-card]");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      {
        y: "-2em",
        autoAlpha: 0,
      },
      {
        y: "0em",
        autoAlpha: 1,
        duration: 0.5,
        ease: "linear",
        scrollTrigger: {
          trigger: card,
          start: "top 75%",
          end: "bottom top",
          toggleActions: "play none none none",
          markers: DEBUG,
        },
      },
    );

    let cardButton = card.querySelector("[data-button-hover-animation]");
    if (cardButton) {
      const animationElements = cardButton.querySelectorAll(
        "[data-button-arrow]",
      );
      if (animationElements.length === 0) return;

      card.addEventListener("mouseenter", () => {
        animateButtonHoverON(animationElements);
      });
      card.addEventListener("mouseleave", () => {
        animateButtonHoverOFF(animationElements);
      });
    }
  });

  // if (DEBUG) console.log("Six card animation initialized");
}

function initClientMarqueeAnimation(page = document) {
  const marqueeTracks = page.querySelectorAll("[data-marquee-track]");
  if (marqueeTracks.length === 0) {
    // if (DEBUG) console.log("No marquee tracks found, skipping marquee animation initialization");
    return;
  }

  marqueeTracks.forEach((track) => {
    const marqueeItems = track.querySelectorAll("[data-marquee-item]");
    if (marqueeItems.length === 0) {
      // if (DEBUG) console.log("No marquee items found for this track, skipping...");
      return;
    }
    marqueeItems.forEach((item) => {
      gsap.fromTo(
        item,
        {
          x: "0%",
        },
        {
          x: "100%",
          duration: 45,
          ease: "linear",
          repeat: -1,
          // scrollTrigger: {
          //   trigger: track,
          //   start: "top bottom",
          //   toggleActions: "play none none none",
          //   markers: DEBUG,
          // }
        },
      );
    });
  });

  // if (DEBUG) console.log("Marquee tracks initialized");
}

function initTestimonialMarqueeAnimation(page = document) {
  const testimonialMarqueeSection = page.querySelectorAll(
    "[data-testimonial-marquee-section]",
  );
  if (testimonialMarqueeSection.length === 0) {
    // if (DEBUG) console.log("No testimonial marquee section found, skipping testimonial marquee animation initialization");
    return;
  }
  testimonialMarqueeSection.forEach((section) => {
    const marqueeItems = section.querySelectorAll(
      "[data-testimonial-marquee-item]",
    );
    if (marqueeItems.length === 0) {
      // if (DEBUG) console.log("No testimonial marquee items found for this section, skipping...");
      return;
    }
    marqueeItems.forEach((item) => {
      gsap.fromTo(
        item,
        {
          x: "0%",
        },
        {
          x: "100%",
          duration: 30,
          ease: "linear",
          repeat: -1,
          // scrollTrigger: {
          //   trigger: section,
          //   start: "top bottom",
          //   toggleActions: "play none none none",
          //   markers: DEBUG,
          // }
        },
      );
    });
  });

  // if (DEBUG) console.log("Testimonial marquee tracks initialized");
}

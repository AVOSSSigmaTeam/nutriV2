gsap.registerPlugin(CustomEase, ScrollTrigger);

const version = "2.0.72";

history.scrollRestoration = "manual";

let lenis = null;
const lenisLerpValue = 0.165;
let nextPage = document;
let onceFunctionsInitialized = false;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", e => (reducedMotion = e.matches));
rmMQ.addListener?.(e => (reducedMotion = e.matches));

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("default", "0.625, 0.05, 0, 1");
CustomEase.create("smooth", "M0,0 C0.38,0.005 0.215,1 1,1");
CustomEase.create("outQuad", "M0,0 C0.25,0.46 0.45,0.94 1,1");
gsap.defaults({ ease: "default", duration: durationDefault });

const DEBUG = true;

const colors = {
  "color-Text": "#212121",
  "main": "#63e89f",
  "text": "#212121",
  "color-White": "#fff",
  "color-Background": "#f3f3f3",
  "color-BigFooterBack": "#262626",
  "color-FooterBlock": "#191919",
  "color-DarkTint": "#191919",
  "color-FooterDivider": "#f5f3f02e",
  "white": "#fff",
  "color-BtnAnimatedArrow": "#63e89f",
  "background": "#f3f3f3",
  "dark-FooterDivider": "#21212126",
  "darkTint": "#191919",
  "dark-Background": "#212121",
  "border": "#f5f3f02e",
  "dark-Text": "#fff",
  "dark-White": "#191919",
  "dark-DarkTint": "#f3f3f3",
  "dark-BigFooterBack": "#f3f3f3",
  "dark-FooterBlock": "#fff",
  "dark-BtnAnimatedArrow": "#212121"
}

let pendingAnchorHash = window.location.hash || null;


// FUNCTION REGISTRY

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  initCrossPageAnchorLinks();

  // Runs once on first load
  // if (has('[data-something]')) initSomething();

  initNavLinkHoverAnimation();
  initNavButtonAnimation();
  initSkipLink();

}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;

  // Runs before the enter animation
  // if (has('[data-something]')) initSomething();

  if (has('[data-faq-section]')) {
    initFAQ(nextPage);
  }

  if (has('[data-footer]')) {
    initFooterLinkHoverAnimation(nextPage);
    setCopyrightYear(nextPage);
    initOpeningHours(nextPage);
  }

  if (has('[data-copy-email-button]')) initCopyEmailClipboard(nextPage);

  if (has('[data-button-hover-animation]')) initButtonHoverAnimation(nextPage);

  const pageName = nextPage.getAttribute("data-page-name") || '';
  if (DEBUG) console.log(pageName);

  switch (pageName) {
    // case "home":
    //   break;
    // case "popup-build":
    //   break;
    case "blog":
      initBlogPostDate(nextPage);
      initBlogPostFilter(nextPage);
      initBlogPostHoverAnimation(nextPage);
      break;
    case "blog-post":
      initBlogPostDate(nextPage);
      break;
    // case "contact":
      // initBasicFormValidation(nextPage);
      // break;
    case "bmi-calc":
      initBMICalculator(nextPage);
      break;
    case "tdee-calc":
      initTDEECalculator(nextPage);
      break;

  };


}

function initAfterEnterFunctions(next) {
  nextPage = next || document;

  // Runs after enter animation completes
  // if (has('[data-something]')) initSomething();

  if (has('[data-faq-section]')) {
    initFAQSectionAnimation(nextPage);
  }

  if (has('[data-footer]')) {
    initFooterSignature(nextPage);
    initFooterLogoFlowerSpin(nextPage);
  }

  if (has('[data-six-card]')) initSixCardAnimations(nextPage);

  if (has('[data-marquee-track]')) initClientMarqueeAnimation(nextPage);

  if (has('[data-steps-section]')) {
    initStepsFlowerAnimation(nextPage);
    initStepsProgressBarAnimation(nextPage);
    initStepsScrollAnimation(nextPage);
  }

  if (has('[data-testimonial-marquee-section]')) initTestimonialMarqueeAnimation(nextPage);

  if (has('[data-form-validate]')) initBasicFormValidation(nextPage);

  const formsWithoutUUID = nextPage.querySelectorAll("[data-add-uuid]");
  formsWithoutUUID.forEach((form) => {
    formRandomUUID(form);
  });

  const pageName = nextPage.getAttribute("data-page-name") || '';
  // if (DEBUG) console.log(pageName);

  switch (pageName) {
    case "home":
      initPlanPopupV2(nextPage);
      break;
    // case "popup-build":
    //   break;
    // case "blog":
    //   break;
    // case "blog-post":
    //   break;
    // case "contact":
    //   break;
    // case "bmi-calc":
    //   break;
    // case "tdee-calc":
    //   break;
  };


  if (hasLenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
}



// PAGE TRANSITIONS

function normalizePaths(paths) {
  const heights = Array.from(paths).map(p => p.getBBox().height);
  const maxHeight = Math.max(...heights);

  return (index) => {
    const h = heights[index];
    return (maxHeight / h) * 100;
  };
}

async function runPageEnterAnimation(next) {
  const transitionWrap = document.querySelector("[data-transition-wrap]");
  const transitionPanel = transitionWrap.querySelector("[data-transition-panel]");
  const transitionPanelTop = transitionWrap.querySelector("[data-transition-panel-top]");
  const transitionPanelBottom = transitionWrap.querySelector("[data-transition-panel-bottom]");
  const transitionLogo = transitionWrap.querySelector("[data-transition-logo]");
  const transitionLogoPath = transitionWrap.querySelectorAll("path");

  const getY = normalizePaths(transitionLogoPath);

  await resetPage(next);

  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, [], "pageReady"));
  }

  // if (DEBUG) {
  //   tl.set(next, { backgroundColor: "blue" }, 0);
  // }

  tl.add("startEnter", 1.35);

  tl.set(next, {
    autoAlpha: 1,
  }, "startEnter");

  tl.fromTo(transitionPanel, {
    yPercent: -100,
  }, {
    yPercent: -200,
    duration: 1,
    overwrite: "auto",
    immediateRender: false
  }, "startEnter");

  tl.fromTo(transitionPanelBottom, {
    scaleY: 1
  }, {
    scaleY: 0,
    duration: 1,
  }, "<");

  tl.to(transitionLogoPath, {
    yPercent: (i) => -getY(i) * 1.3,
    duration: 1.2,
    ease: "expo.inOut",
    stagger: {
      each: -0.02
    },
    force3D: false
  }, "startEnter-=0.4");

  tl.from(next, {
    y: "25vh",
    duration: 1,
  }, "startEnter");

  tl.set(transitionPanel, {
    autoAlpha: 0
  }, ">");

  tl.set(transitionLogo, {
    autoAlpha: 0
  }, ">");

  tl.set(transitionLogoPath, {
    yPercent: 0,
    force3D: false
  }, ">");

  tl.add("pageReady");
  // tl.call(resetPage, [next], "pageReady");

  return new Promise(resolve => {
    tl.call(resolve, [], "pageReady");
  });
}

async function runFirstLoadAnimation(next) {
// function runFirstLoadAnimation(next) {
  const transitionWrap = document.querySelector("[data-transition-init-wrap]");
  const transitionPanel = transitionWrap.querySelector("[data-transition-init-panel]");
  const transitionPanelTop = transitionWrap.querySelector("[data-transition-init-panel-top]");
  const transitionPanelBottom = transitionWrap.querySelector("[data-transition-init-panel-bottom]");
  const transitionLogo = transitionWrap.querySelector("[data-transition-init-logo]");
  const transitionLogoPath = transitionWrap.querySelectorAll("path");

  const getY = normalizePaths(transitionLogoPath);

  // await resetPage(next);

  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise(resolve => tl.call(resolve, [], "pageReady"));
  }

  tl.add("startEnter", 1.35);

  tl.to(transitionPanel, {
    yPercent: -200,
    duration: 1,
    overwrite: "auto",
    immediateRender: false
  }, "startEnter");

  tl.to(transitionPanelBottom, {
    scaleY: 0,
    duration: 1,
  }, "<");

  tl.to(transitionLogoPath, {
    yPercent: (i) => -getY(i) * 1.3,
    duration: 1.2,
    ease: "expo.inOut",
    stagger: {
      each: -0.02
    }
  }, "startEnter-=0.4");

  tl.fromTo(next, {
    y: "25vh"
  }, {
    y: "0vh",
    duration: 0.9,
  }, "startEnter");

  tl.set(transitionPanel, {
    autoAlpha: 0
  }, ">");

  tl.set(transitionLogo, {
    autoAlpha: 0
  }, ">");

  tl.set(transitionLogoPath, {
    yPercent: 0
  }, ">");

  tl.add("pageReady");
  // tl.call(resetPage, [next], "pageReady");
  await resetPage(next);

  return new Promise(resolve => {
    tl.call(resolve, [], "pageReady");
  });
}

function runPageLeaveAnimation(current, next) {
  const transitionWrap = document.querySelector("[data-transition-wrap]");
  const transitionPanel = transitionWrap.querySelector("[data-transition-panel]");
  const transitionPanelTop = transitionWrap.querySelector("[data-transition-panel-top]");
  const transitionPanelBottom = transitionWrap.querySelector("[data-transition-panel-bottom]");
  const transitionLogo = transitionWrap.querySelector("[data-transition-logo]");
  const transitionLogoPath = transitionWrap.querySelectorAll("path");

  const tl = gsap.timeline({
    onComplete: () => { current.remove(); }
  });

  if (reducedMotion) {
    return tl.set(current, { autoAlpha: 0 });
  }

  tl.set(transitionPanel, {
    autoAlpha: 1
  }, 0);

  tl.set(transitionPanelTop, {
    scaleY: 0,
    height: "15vw"
  }, 0);

  tl.set(transitionPanelBottom, {
    scaleY: 1,
    height: "20vw"
  }, 0);

  tl.set(transitionLogo, {
    autoAlpha: 0,
    yPercent: 105
  }, 0);

  tl.set(transitionLogoPath, {
    yPercent: 0
  }, 0);

  tl.set(next, {
    autoAlpha: 0
  }, 0);

  tl.fromTo(transitionPanel, {
    yPercent: 0
  }, {
    yPercent: -100,
    duration: 1,
  }, 0);

  tl.fromTo(transitionPanelTop, {
    scaleY: 0
  }, {
    scaleY: 1,
    duration: 1,
  }, "<");

  tl.set(transitionLogo, {
    autoAlpha: 1
  }, 0.25);

  tl.fromTo(transitionLogo, {
    yPercent: 105
  }, {
    yPercent: 0,
    duration: 0.8,
    ease: "expo.out",
  }, 0.25);

  // if (DEBUG) {
  //   tl.set(current, { backgroundColor: "red" }, 0);
  // }

  tl.fromTo(current, {
    y: "0vh"
  }, {
    y: "-15vh",
    duration: 0.9,
  }, 0);
  

  return tl;
}



barba.hooks.beforeEnter(data => {
  // Position new container
  gsap.set(data.next.container, {
    position: "fixed",
    left: 0,
    right: 0,
  });

  if (lenis && typeof lenis.stop === "function") {
    lenis.stop();
  }

  initBeforeEnterFunctions(data.next.container);
  applyThemeFrom(data.next.container);

  if (DEBUG) console.log("Barba beforeEnter");
});

barba.hooks.afterLeave(() => {
  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
  if (DEBUG) console.log("Barba afterLeave");
});

barba.hooks.enter(data => {
  initBarbaNavUpdate(data);
  if (DEBUG) console.log("Barba enter hook");
})

barba.hooks.afterEnter(data => {

  // Run page functions
  initAfterEnterFunctions(data.next.container);

  // Settle
  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
  if (DEBUG) console.log("Barba afterEnter");

});

barba.init({
  debug: DEBUG,
  timeout: 7000,
  preventRunning: true,
  transitions: [
    {
      name: "default",
      sync: true,

      async once(data) {
        if (DEBUG) console.log("Barba init once", version);
        initOnceFunctions();
        applyThemeFrom(data.next.container);

        await runFirstLoadAnimation(data.next.container);
      },

      // Current page leaves
      async leave(data) {
        if (DEBUG) console.log("Barba leave");
        return runPageLeaveAnimation(data.current.container, data.next.container);
      },

      // New page enters
      async enter(data) {
        if (DEBUG) console.log("Barba enter");
        return runPageEnterAnimation(data.next.container);
      },

    }
  ],
});



// GENERIC + HELPERS

const themeConfig = {
  light: {
    nav: "dark",
    transition: "light"
  },
  dark: {
    nav: "light",
    transition: "dark"
  }
};

function applyThemeFrom(container) {
  const pageTheme = container?.dataset?.pageTheme || "light";
  const config = themeConfig[pageTheme] || themeConfig.light;

  document.body.dataset.pageTheme = pageTheme;
  const transitionEl = document.querySelector('[data-theme-transition]');
  if (transitionEl) {
    transitionEl.dataset.themeTransition = config.transition;
  }

  const nav = document.querySelector('[data-theme-nav]');
  if (nav) {
    nav.dataset.themeNav = config.nav;
  }
}

function initLenis() {
  if (lenis) return; // already created
  if (!hasLenis) return;

  lenis = new Lenis({
    // lerp: 0.165,
    lerp: lenisLerpValue,
    wheelMultiplier: 1.25,
  });

  history.scrollRestoration = 'manual';

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  let disableScrollElements = document.querySelectorAll('[scrolldisable-element="disable"]');
  let enableScrollElements = document.querySelectorAll('[scrolldisable-element="enable"]');

  disableScrollElements.forEach(element => {
    element.addEventListener('click', () => {
      lenis.stop();
      if (DEBUG) console.log("Lenis stopped due to click on", element);
    })
  });

  enableScrollElements.forEach(element => {
    element.addEventListener('click', () => {
      lenis.start();
      if (DEBUG) console.log("Lenis started due to click on", element);
    })
  });

  if (DEBUG) console.log("Lenis initialized");

}

// function resetPage(container) {
//   window.scrollTo(0, 0);

//   gsap.set(container, {
//     clearProps: "position,left,right,transform"
//   });

//   if (hasLenis) {
//     lenis.resize();
//     lenis.start();
//   }

//   if (DEBUG) console.log("Page reset");
// }
// function resetPage(container) {
//   window.scrollTo(0, 0);

//   gsap.set(container, {
//     clearProps: "position,left,right,transform"
//   });

//   if (hasLenis) {
//     lenis.resize();
//     lenis.start();
//   }

//   requestAnimationFrame(() => {
//     requestAnimationFrame(() => {
//       if (hasLenis) lenis.resize();
//       if (hasScrollTrigger) ScrollTrigger.refresh();

//       scrollToPendingAnchor(container);
//     });
//   });

//   if (DEBUG) console.log("Page reset");
// }

function resetPage(container, { scrollAnchor = true } = {}) {
// function resetPage(container) {
  
  window.scrollTo(0, 0);
  if (DEBUG) console.log("Page scroll reset to top");

  gsap.set(container, {
    clearProps: "position,left,right,transform"
  });

  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }

  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (hasLenis) lenis.resize();
        if (hasScrollTrigger) ScrollTrigger.refresh();

        if (scrollAnchor) {
          scrollToPendingAnchor(container);
        }

        if (DEBUG) console.log("Page reset");
        resolve();
      });
    });
  });
}

function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

function initBarbaNavUpdate(data) {
  var tpl = document.createElement('template');
  tpl.innerHTML = data.next.html.trim();
  var nextNodes = tpl.content.querySelectorAll('[data-barba-update]');
  var currentNodes = document.querySelectorAll('nav [data-barba-update]');

  currentNodes.forEach(function (curr, index) {
    var next = nextNodes[index];
    if (!next) return;

    // Aria-current sync
    var newStatus = next.getAttribute('aria-current');
    if (newStatus !== null) {
      curr.setAttribute('aria-current', newStatus);
    } else {
      curr.removeAttribute('aria-current');
    }

    // Class list sync
    var newClassList = next.getAttribute('class') || '';
    curr.setAttribute('class', newClassList);
  });
}


function getCleanUrl(url) {
  const cleanUrl = new URL(url.href);
  cleanUrl.hash = "";
  return cleanUrl.href;
}

function normalizePath(pathname) {
  return pathname.replace(/\/$/, "") || "/";
}

function isCrossPageAnchorLink(url) {
  const current = new URL(window.location.href);

  return (
    url.origin === current.origin &&
    url.hash &&
    (
      normalizePath(url.pathname) !== normalizePath(current.pathname) ||
      url.search !== current.search
    )
  );
}

function initCrossPageAnchorLinks() { // TODO check if this function works propperly, as it is only called on first page load.
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;
    if (link.closest("[data-barba-prevent]")) return;

    const url = new URL(link.href);

    if (!isCrossPageAnchorLink(url)) return;

    pendingAnchorHash = url.hash;

    event.preventDefault();
    event.stopPropagation();

    barba.go(getCleanUrl(url), link);
  }, true);
}

function getAnchorTarget(container, hash) {
  if (!hash) return null;

  const id = decodeURIComponent(hash.slice(1));
  if (!id) return null;

  const escapedId = window.CSS?.escape ? CSS.escape(id) : id.replace(/["\\]/g, "\\$&");

  return (
    container.querySelector(`#${escapedId}`) ||
    container.querySelector(`[name="${escapedId}"]`)
  );
}

function scrollToPendingAnchor(container) {
  if (!pendingAnchorHash) return;

  const hash = pendingAnchorHash;
  pendingAnchorHash = null;

  const target = getAnchorTarget(container, hash);
  if (!target) return;

  const nav = document.querySelector("[data-theme-nav]");
  const offset = nav ? -nav.offsetHeight : 0;

  if (history.replaceState) {
    const url = new URL(window.location.href);
    url.hash = hash;
    history.replaceState(history.state, "", url.href);
  }

  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(target, {
      offset,
      // duration: reducedMotion ? 0 : 5,
      // lerp: reducedMotion ? 1 : lenisLerpValue,
      // easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // immediate: reducedMotion,
      immediate: true,
      force: true
    });
  } else {
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  }
}


// YOUR FUNCTIONS GO BELOW HERE

function initSkipLink() {
  document.querySelector('[data-skip-link]').addEventListener('click', function (e) {
    const target = document.getElementById('main');
    if (!target) return;

    target.setAttribute('tabindex', '-1'); // ensure focusable
    target.focus();
  });

  // if (DEBUG) console.log("Skip link initialized");

}

//plan popup
function initPlanPopupV2(page) {

  const popupWrapper = page.querySelector("[data-plan-popup-wrapper]") || document.querySelector("[data-plan-popup-wrapper]");
  if (!popupWrapper) {
    if (DEBUG) console.warn("Plan popup wrapper not found");
    return;
  }
  const popupTriggers = page.querySelectorAll("[data-plan-popup-trigger]") || document.querySelectorAll("[data-plan-popup-trigger]");
  if (popupTriggers.length === 0) {
    if (DEBUG) console.warn("No plan popup triggers found");
    return;
  }
  const allPopups = Array.from(popupWrapper.querySelectorAll("[data-plan-popup]"));
  if (allPopups.length === 0) {
    if (DEBUG) console.warn("No plan popups found");
    return;
  }
  const popupCloseTriggers = popupWrapper.querySelectorAll("[data-popup-close-trigger]");
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

    gsap.timeline()
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

    gsap.timeline()
      .to(popup, { autoAlpha: 0 })
      .set(popup, { display: "none" })
      .to(popupWrapper, { display: "none" }, 0.01)
      .to(blurTargets, { "--blur": "0px" }, 0.01);

    if (DEBUG) console.log("Closed popup", popup);
  }

  popupTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const triggerData = trigger.getAttribute("data-plan-popup-trigger");
      const popup = getPopup(triggerData);

      openPopup(popup);
    }, { signal: controller.signal });
  });

  popupCloseTriggers.forEach(trigger => {
    trigger.addEventListener("click", closePopup, { signal: controller.signal });
  });

  if (DEBUG) console.log("Plan popup V2 initialized");
}

// footer
function initOpeningHours(page) {
  const defaultTimezone = "Europe/Belgrade";
  const timeTables = page.querySelectorAll('[data-opening-hours-init]');
  if (!timeTables.length) return;

  timeTables.forEach(root => {
    const tz = root.getAttribute('data-opening-hours-timezone') || defaultTimezone;

    const timeToMinutes = str => {
      const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(str || '');
      return m ? (parseInt(m[1], 10) * 60 + parseInt(m[2], 10)) : null;
    };

    const getNowParts = () => {
      let useTz = tz;
      try { new Intl.DateTimeFormat('en-GB', { timeZone: tz }); }
      catch { useTz = defaultTimezone; }
      const fmt = new Intl.DateTimeFormat('en-GB', {
        timeZone: useTz,
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const parts = fmt.formatToParts(new Date());
      const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
      const weekdayIdx = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(map.weekday);
      return { weekdayIdx, hour: parseInt(map.hour, 10), minute: parseInt(map.minute, 10) };
    };

    const dayIndex = { monday: 0, tuesday: 1, wednesday: 2, thursday: 3, friday: 4, saturday: 5, sunday: 6 };
    const rows = Array.from(root.querySelectorAll('[data-opening-hours-day]'));
    if (!rows.length) return;

    // check duplicates
    const dayCount = {};
    rows.forEach(r => {
      const d = (r.getAttribute('data-opening-hours-day') || '').trim().toLowerCase();
      if (d) dayCount[d] = (dayCount[d] || 0) + 1;
    });
    Object.keys(dayCount).forEach(d => {
      if (dayCount[d] > 1) console.error([OpeningHours], `Duplicate day "${d}" found in`, root);
    });

    const ordered = new Array(7);
    rows.forEach(r => {
      const d = (r.getAttribute('data-opening-hours-day') || '').trim().toLowerCase();
      if (d in dayIndex) ordered[dayIndex[d]] = r;
    });
    if (ordered.some(r => !r)) return;

    const schedule = ordered.map(row => {
      const o = (row.getAttribute('data-opening-hours-open') || '').trim();
      const c = (row.getAttribute('data-opening-hours-close') || '').trim();
      const openMin = timeToMinutes(o);
      const closeMin = timeToMinutes(c);
      if (openMin == null || closeMin == null) return { open: false, openMin: 0, closeMin: 0, overnight: false };
      const overnight = openMin > closeMin;
      return { open: true, openMin, closeMin, overnight };
    });

    const evaluate = () => {
      const now = getNowParts();
      const curIdx = now.weekdayIdx;
      const nowMin = now.hour * 60 + now.minute;

      // mark current day
      ordered.forEach(r => r.removeAttribute('data-opening-hours-current-day'));
      ordered[curIdx].setAttribute('data-opening-hours-current-day', '');

      const today = schedule[curIdx];
      const yesterday = schedule[(curIdx + 6) % 7];

      let isOpen = false;
      if (today.open) {
        if (!today.overnight) {
          isOpen = nowMin >= today.openMin && nowMin < today.closeMin;
        } else {
          isOpen = (nowMin >= today.openMin) || (nowMin < today.closeMin);
        }
      }
      if (!isOpen && yesterday.open && yesterday.overnight && nowMin < yesterday.closeMin) {
        isOpen = true;
      }

      ordered.forEach((row, idx) => {
        row.setAttribute('data-opening-hours-status', (idx === curIdx && isOpen) ? 'open' : 'closed');
      });

      root.setAttribute('data-opening-hours-store-status', isOpen ? 'open' : 'closed');
    };

    evaluate();
    clearInterval(root._openingHoursTimer);
    root._openingHoursTimer = setInterval(evaluate, 60 * 1000);

    const visHandler = () => { if (!page.hidden) evaluate(); };
    if (root._openingHoursVisHandler) {
      page.removeEventListener('visibilitychange', root._openingHoursVisHandler);
    }
    root._openingHoursVisHandler = visHandler;
    page.addEventListener('visibilitychange', visHandler);
  });

  // if (DEBUG) console.log("Opening hours initialized");

}
function initFooterSignature(page) {

  const main = page.querySelector("#main-text"),
    random = page.querySelector("#random-text"),
    trigger = page.querySelector("#signature-trigger"),
    SOURCE = "Powered by AVOSS",
    CHARS = "E?n\\H(BmsRKk~SFV9J/gWy!*xaGA6[L]I7QDv-3pYz#t}T^O|{%$r1McPUXe0dij4&ubwfN)Z+h8Cqo25l",
    RAND_LENGTH = 5,
    SPEED = 50;
  let intervalId = null,
    isAnimating = !1;
  const randChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

  function scramble(t) {
    return Array.from({
      length: t
    }, randChar).join("")
  }

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = !0, main.textContent = "", random.textContent = "";
    let t = 0,
      n = 0,
      e = SOURCE.length;
    intervalId = setInterval(() => {
      if (t < 5) {
        t++, random.textContent = scramble(t);
        return
      }
      if (n < e) {
        main.textContent += SOURCE[n++];
        let i = e - n,
          r = Math.min(5, i);
        r > 0 ? random.textContent = scramble(r) : (random.textContent = "", clearInterval(intervalId), isAnimating = !1)
      }
    }, 50)
  }

  function resetAnimation() {
    clearInterval(intervalId), intervalId = null, isAnimating = !1, main.textContent = "", random.textContent = ""
  }


  ScrollTrigger.matchMedia({
    "(min-width: 992px)": function () {
      let t = document.body.clientHeight,
        e = new ResizeObserver(e => {
          for (let n of e) {
            let o = n.contentRect.height,
              i = Math.abs(o - t);
            i >= 5 && (t = o, ScrollTrigger.refresh())
          }
        });
      e.observe(document.body), ScrollTrigger.create({
        trigger,
        start: "top bottom",
        end: "bottom top",
        onEnter: startAnimation,
        onEnterBack: startAnimation,
        onLeave: resetAnimation,
        onLeaveBack: resetAnimation,
        scrub: !1,
        toggleActions: "none"
      })
    },
    "(max-width: 991px)": function () {
      main.textContent = SOURCE
    }
  })

  // if (DEBUG) console.log("Footer signature animation initialized");

}
function setCopyrightYear(page) {
  const yearElement = page.querySelector("[data-copyright-year]");
  if (!yearElement) return;
  const currentYear = new Date().getFullYear();
  yearElement.textContent = currentYear;

  // if (DEBUG) console.log("Copyright year set to", currentYear);

}
function initFooterLinkHoverAnimation(page) {
  const linkWraps = page.querySelectorAll("[data-footer-link-wrap]");

  linkWraps.forEach((wrap) => {
    const links = Array.from(wrap.querySelectorAll("[data-footer-link]"));

    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
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

    wrap.addEventListener("mouseleave", () => {
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
function initCopyEmailClipboard(page) {
  const buttons = page.querySelectorAll('[data-copy-email-button]');
  if (!buttons.length) return;

  const copyEmail = (button) => {
    // Email to copy to clipboard is taking from the button itself, or if that's empty,
    // from a text element inside the button
    const email =
      button.getAttribute('data-copy-email') ||
      button.querySelector('[data-copy-email-element]').textContent.trim();
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        button.setAttribute('data-copy-button', 'copied');
        button.setAttribute('aria-label', 'Email copied to clipboard!');

        const textElement = button.querySelector('[data-copy-email-element-text]');
        if (textElement) {

          const textElementOriginalText = textElement.textContent; // store original text
          textElement.textContent = button.getAttribute('data-copy-email-copied-text') || 'Copied!'; // change to "Copied!"
          setTimeout(() => {
            textElement.textContent = textElementOriginalText; // revert to original text
          }, (button.getAttribute('data-copy-email-duration') || 2000)); // default to 2 seconds if no custom duration provided

        } else {

          const originalText = button.textContent; // store original text
          button.textContent = button.getAttribute('data-copy-email-copied-text') || 'Copied!'; // change to "Copied!"
          setTimeout(() => {
            button.textContent = originalText; // revert to original text
          }, (button.getAttribute('data-copy-email-duration') || 2000)); // default to 2 seconds if no custom duration provided

        }
      });
    }
  };

  const handleInteraction = (e) => {
    if (
      e.type === 'click' ||
      (e.type === 'keydown' && (e.key === 'Enter' || e.key === ' '))
    ) {
      e.preventDefault();
      copyEmail(e.currentTarget);
    }
  };

  buttons.forEach((button) => {
    button.addEventListener('click', handleInteraction);
    button.addEventListener('keydown', handleInteraction);
    button.addEventListener('mouseleave', () => {
      // Remove 'active' attribute to reset color and text transform
      button.removeAttribute('data-copy-button');
      // Remove focus on mouseleave to clear keyboard focus styling
      button.blur();
      button.setAttribute('aria-label', 'Copy email to clipboard');
    });
    button.addEventListener('blur', () => {
      button.removeAttribute('data-copy-button');
      button.setAttribute('aria-label', 'Copy email to clipboard');
    });
  });

  // if (DEBUG) console.log("Copy email to clipboard initialized");

}
function initFooterLogoFlowerSpin(page) {
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
        }
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
function initBasicFormValidation(page) {
  const forms = page.querySelectorAll('[data-form-validate]');

  forms.forEach((form) => {
    const fields = form.querySelectorAll('[data-validate] input, [data-validate] textarea');
    const submitButtonDiv = form.querySelector('[data-submit]'); // The div wrapping the submit button
    const submitInput = submitButtonDiv.querySelector('input[type="submit"]'); // The actual submit button

    // Capture the form load time
    const formLoadTime = new Date().getTime(); // Timestamp when the form was loaded

    // Function to validate individual fields (input or textarea)
    const validateField = (field) => {
      const parent = field.closest('[data-validate]'); // Get the parent div
      const minLength = field.getAttribute('min');
      const maxLength = field.getAttribute('max');
      const type = field.getAttribute('type');
      let isValid = true;

      // Check if the field has content
      if (field.value.trim() !== '') {
        parent.classList.add('is--filled');
      } else {
        parent.classList.remove('is--filled');
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

        const trimmedEmail = email.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailPattern.test(trimmedEmail);
      }
      // if (type === 'email' && !/\S+@\S+\.\S+/.test(field.value)) {
      if (type === 'email' && !isValidEmail(field.value)) {
        isValid = false;
      }

      // Add or remove success/error classes on the parent div
      if (isValid) {
        parent.classList.remove('is--error');
        parent.classList.add('is--success');
      } else {
        parent.classList.remove('is--success');
        parent.classList.add('is--error');
      }

      return isValid;
    };

    // Function to start live validation for a field
    const startLiveValidation = (field) => {
      field.addEventListener('input', function () {
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
    submitButtonDiv.addEventListener('click', function () {
      // Validate the form first
      if (validateAndStartLiveValidationForAll()) {
        // Only check for spam after all fields are valid
        if (isSpam()) {
          alert('Form submitted too quickly. Please try again.');
          return; // Stop form submission
        }
        submitInput.click(); // Simulate a click on the <input type="submit">
      }
    });

    // Handle pressing the "Enter" key
    form.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
        event.preventDefault(); // Prevent the default form submission

        // Validate the form first
        if (validateAndStartLiveValidationForAll()) {
          // Only check for spam after all fields are valid
          if (isSpam()) {
            alert('Form submitted too quickly. Please try again.');
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
function initFAQ(page) {
  const faqItems = page.querySelectorAll("[data-faq-item]");

  faqItems.forEach(item => {
    const question = item.querySelector("[data-faq-question]");
    const answer = item.querySelector("[data-faq-answer]");

    if (!question || !answer) return;

    const faqIconWrap = item.querySelector("[data-faq-icon-wrap]");
    const faqIcon = item.querySelector("[data-faq-icon]");
    const faqIconBar = faqIcon?.querySelector("[data-faq-icon-bar]");

    const faqAnimationDuration = 0.25;

    const openTimeline = gsap.timeline({ paused: true });
    const closeTimeline = gsap.timeline({ paused: true });

    openTimeline.to(answer, {
      height: "auto",
      duration: faqAnimationDuration,
      ease: "power1.inOut"
    }, 0)
      .to(faqIconWrap, {
        backgroundColor: colors.white,
        duration: faqAnimationDuration,
        ease: "power1.inOut"
      }, 0)
      .to(faqIconBar, {
        rotationZ: 0,
        duration: faqAnimationDuration,
        ease: "power1.inOut"
      }, 0)
      .to(faqIcon, {
        rotationZ: 180,
        duration: faqAnimationDuration,
        ease: "power1.inOut"
      }, 0);

    closeTimeline.to(answer, {
      height: "0px",
      duration: faqAnimationDuration,
      ease: "power1.inOut"
    }, 0)
      .to(faqIconWrap, {
        backgroundColor: colors.main,
        duration: faqAnimationDuration,
        ease: "power1.inOut"
      }, 0)
      .to(faqIconBar, {
        rotationZ: 90,
        duration: faqAnimationDuration,
        ease: "power1.inOut"
      }, 0)
      .to(faqIcon, {
        rotationZ: -180,
        duration: faqAnimationDuration,
        ease: "power1.inOut"
      }, 0);

    // Set initial state
    closeTimeline.restart();

    question.addEventListener("click", () => {

      let isOpen = item.getAttribute("data-faq-open") === "true";

      if (isOpen) {

        closeTimeline.restart();

        item.setAttribute("data-faq-open", "false");

        if (DEBUG) console.log("FAQ item closed:", question.textContent.trim(), item.getAttribute("data-faq-open"));

      } else {

        openTimeline.restart();

        item.setAttribute("data-faq-open", "true");

        // if (DEBUG) console.log("FAQ item opened:", question.textContent.trim(), item.getAttribute("data-faq-open"));

      }
    });
  });

  if (DEBUG) console.log("FAQ initialized");

}
function initFAQSectionAnimation(page) {
  const faqSection = page.querySelector("[data-faq-section]");
  if (!faqSection) return;

  const faqItems = faqSection.querySelectorAll("[data-faq-item]");
  if (faqItems.length === 0) return;

  gsap.fromTo(faqItems, {
    autoAlpha: 0,
    yPercent: 75,
  }, {
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
    }
  });
  // if (DEBUG) console.log("FAQ section animation initialized");
}

// steps flower animation
function initStepsFlowerAnimation(page) {

  const steps = page.querySelectorAll("[data-step]");
  if (steps.length === 0) return;

  const flowers = page.querySelectorAll("[data-steps-flower]");
  if (flowers.length === 0) return;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const flower = flowers[i];

    // ScrollTrigger.matchMedia({
    //   "(min-width: 992px)": function () {
        gsap.fromTo(flower, {
          rotation: 0,
        }, {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: step,
            start: "top center",
            end: "bottom center",
            scrub: true,
            markers: DEBUG,
          }
        });
      }
  //   });
  // }

  // if (DEBUG) console.log("Steps flower animation initialized");

}
function initStepsProgressBarAnimation(page) {
  const container = page.querySelector("[data-steps-container]");
  if (!container) return;
  const wrap = page.querySelector("[data-steps-progress-wrap]");
  if (!wrap) return;
  const progressBar = wrap.querySelector("[data-steps-progress-bar]");
  if (!progressBar) return;

  gsap.fromTo(progressBar, {
    height: "0%",
  }, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top center",
      end: "bottom center",
      scrub: true,
      markers: DEBUG,
    }
  });

  // if (DEBUG) console.log("Steps progress bar animation initialized");
}
function initStepsScrollAnimation(page) {
  const steps = page.querySelectorAll("[data-step]");
  if (steps.length === 0) return;
  steps.forEach((step) => {
    const stepLeft = step.querySelector("[data-step-left]");
    const stepRight = step.querySelector("[data-step-right]");
    if (!stepLeft || !stepRight) return;

    
    gsap.fromTo([stepLeft, stepRight], {
      autoAlpha: 0.25,
    }, {
      autoAlpha: 1,
      scrollTrigger: {
        trigger: step,
        start: "top 35%",
        end: "top 45%",
        scrub: 1,
        markers: DEBUG,
      }
    });
  });

  if (DEBUG) console.log("Steps scroll animation initialized");
}


// blog
function initBlogPostDate(page) {

  let dateElements = page.querySelectorAll('[data-creation-date]');
  if (dateElements.length === 0) return;

  dateElements.forEach(dateElement => {
    let date = new Date(dateElement.getAttribute('data-creation-date'));
    let monthText = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
    dateElement.textContent = date.getDate() + ". " + monthText[date.getMonth()] + " " + date.getFullYear();
  });

  // if (DEBUG) console.log("Blog post dates initialized");

}
function initBlogPostFilter(page) {
  // Find all filter groups on the page
  const groups = page.querySelectorAll('[data-filter-group]');

  groups.forEach((group) => {
    const buttons = group.querySelectorAll('[data-filter-target]');
    const items = group.querySelectorAll('[data-filter-name]');
    const transitionDelay = 300; // Delay for transition effect (in milliseconds)

    // Function to update the status and accessibility attributes of items
    const updateStatus = (element, shouldBeActive) => {
      // If the item should be active, set it to "active", otherwise "not-active"
      element.setAttribute('data-filter-status', shouldBeActive ? 'active' : 'not-active');
      element.setAttribute('aria-hidden', shouldBeActive ? 'false' : 'true');
    };

    // Function to handle filtering logic when a button is clicked
    const handleFilter = (target) => {
      // Loop through all items and ensure every item transitions out first
      items.forEach((item) => {
        const shouldBeActive = target === 'all' || item.getAttribute('data-filter-name') === target;
        const currentStatus = item.getAttribute('data-filter-status');

        // Only transition items currently visible (status: active)
        if (currentStatus === 'active') {
          item.setAttribute('data-filter-status', 'transition-out');
          // After the transition delay, set the final status
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        } else {
          // For items not currently visible, simply update their status after the delay
          setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
        }
      });

      // Update the active status for all buttons
      buttons.forEach((button) => {
        const isActive = button.getAttribute('data-filter-target') === target;
        button.setAttribute('data-filter-status', isActive ? 'active' : 'not-active');
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false'); // Accessibility: indicate active state
      });
    };

    // Attach click event listeners to each button
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-filter-target');

        // If the button is already active, do nothing
        if (button.getAttribute('data-filter-status') === 'active') return;

        // Trigger the filter logic with the selected target
        handleFilter(target);
      });
    });
  });

  // if (DEBUG) console.log("Blog post filter initialized");

}
function initBlogPostHoverAnimation(page) {

  const blogPostItems = page.querySelectorAll("[data-blog-post-item]");
  if (blogPostItems.length === 0) return;

  blogPostItems.forEach(post => {
    const animationTrigger = post.querySelector("[data-blog-item-link]");
    if (!animationTrigger) return;

    const postButton = post.querySelector("[data-button-hover-animation]");
    if (!postButton) return;

    const animationElements = postButton.querySelectorAll("[data-button-arrow]");
    if (animationElements.length === 0) return;

    animationTrigger.addEventListener("mouseenter", () => { animateButtonHoverON(animationElements); });
    animationTrigger.addEventListener("mouseleave", () => { animateButtonHoverOFF(animationElements); });
  });

  // if (DEBUG) console.log("Blog post hover animation initialized");
}


// BMI calc
function initBMICalculator(page) {

  const heightInput = page.querySelector("[data-bmi-height]");
  const weightInput = page.querySelector("[data-bmi-weight]");

  if (!heightInput || !weightInput) return;

  const rangeIndicator = page.querySelector("[data-bmi-range-indicator]");
  const rangeIndicatorTextWrap = page.querySelector("[data-bmi-indicator-text-wrap]");
  const rangeIndicatorText = page.querySelector("[data-bmi-indicator-text-main]");
  const rangeIndicatorSecondaryText = page.querySelector("[data-bmi-indicator-text-secondary]");
  const rangeIndicatorErrorText = page.querySelector("[data-bmi-indicator-text-error]");
  const mainTextWrap = page.querySelector("[data-main-text-wrap]");

  const heightErrorText = page.querySelector("[data-bmi-height-error-text]");
  const weightErrorText = page.querySelector("[data-bmi-weight-error-text]");

  const weightMIN = 30;
  const weightMAX = 300;
  const heightMIN = 100;
  const heightMAX = 250;
  const defaultRangeIndicatorPosition = "42.44%"; // Position for the indicator when no valid BMI is calculated
  let calculated = false;

  function updateText(BMI, range, error = false, errorText = "Neispravan unos") {

    if (error) {
      mainTextWrap.style.display = "none";
      rangeIndicatorText.textContent = "";
      rangeIndicatorSecondaryText.textContent = "";
      rangeIndicatorErrorText.textContent = errorText;
      return;
    }

    let inidicatorText = "";

    switch (true) {
      // case (BMI < 16):
      //   inidicatorText = "Patološka pothranjenost";
      //   break;
      // case (BMI < 18):
      //   inidicatorText = "Ozbiljna pothranjenost";
      //   break;
      case (BMI < 18.5):
        inidicatorText = "Pothranjenost";
        break;
      case (BMI < 25):
        inidicatorText = "Normalna težina";
        break;
      case (BMI < 30):
        inidicatorText = "Prekomerna težina";
        break;
      case (BMI < 35):
        inidicatorText = "Gojaznost I stepena";
        break;
      case (BMI < 40):
        inidicatorText = "Gojaznost II stepena";
        break;
      case (BMI > 40):
        inidicatorText = "Gojaznost III stepena";
        break;
    }

    mainTextWrap.style.display = "block";
    rangeIndicatorText.textContent = (Math.round((BMI + Number.EPSILON) * 100) / 100).toFixed(2); // Show BMI with 2 decimal places
    rangeIndicatorSecondaryText.textContent = inidicatorText;
    rangeIndicatorErrorText.textContent = "";

  }

  function showError(inputType) {
    if (inputType === "weight") {
      weightInput.classList.add("error");
      gsap.to(weightErrorText, {
        autoAlpha: 1,
        duration: 0.25
      });
    }
    if (inputType === "height") {
      heightInput.classList.add("error");
      gsap.to(heightErrorText, {
        autoAlpha: 1,
        duration: 0.25
      });
    }
  } 

  function hideError(inputType) {
    if (inputType === "weight") {
      weightInput.classList.remove("error");
      gsap.to(weightErrorText, {
        autoAlpha: 0,
        duration: 0.25
      });
    }
    if (inputType === "height") {
      heightInput.classList.remove("error");
      gsap.to(heightErrorText, {
        autoAlpha: 0,
        duration: 0.25
      });
    }
  }

  function calcBMI() {

    let height = heightInput.value;
    if (height === "") return; // Don't calculate if height is empty

    let weight = weightInput.value;
    if (weight === "") return; // Don't calculate if weight is empty

    let heightError = false;
    let weightError = false;

    if (height < heightMIN || height > heightMAX) {
      if (calculated) {
        showError("height");
        if (DEBUG) console.log("Height input error:", height);
      }
      heightError = true;
    } else {
      hideError("height");
      if (DEBUG) console.log("Height input valid:", height);
      heightError = false;
    }

    if (weight < weightMIN || weight > weightMAX) {
      if (calculated) {
        showError("weight");
        if (DEBUG) console.log("Weight input error:", weight);
      }
      weightError = true;
    } else {
      hideError("weight");
      if (DEBUG) console.log("Weight input valid:", weight);
      weightError = false;
    }


    if (heightError || weightError) {
      if (calculated) {
        updateText(null, null, true, heightError && weightError ? "Visina i težina su van opsega" : heightError ? "Visina je van opsega" : "Težina je van opsega");
        if (document.body.clientWidth > 991) {
          rangeIndicator.style.left = defaultRangeIndicatorPosition;
          rangeIndicatorTextWrap.style.left = defaultRangeIndicatorPosition;
        } else {
          rangeIndicator.style.left = "0%";
          rangeIndicatorTextWrap.style.left = "0%";
        }
      }
      return;
    }

    let BMI = weight / Math.pow((height / 100), 2);
    BMI = Math.round((BMI + Number.EPSILON) * 100) / 100;

    let rangeIndicatorMulitplyer = 2;
    let rangeInicatorPosition = Math.round(((BMI * rangeIndicatorMulitplyer) + Number.EPSILON) * 100) / 100;

    if (rangeInicatorPosition < 0) rangeInicatorPosition = 0;
    if (rangeInicatorPosition > 100) rangeInicatorPosition = 100;

    rangeIndicator.style.left = rangeInicatorPosition + "%";

    if (document.body.clientWidth > 991) {
      rangeIndicatorTextWrap.style.left = rangeInicatorPosition + "%";
    } else {
      rangeIndicatorTextWrap.style.left = "0%";
    }

    updateText(BMI, rangeIndicatorMulitplyer);
    calculated = true;
  }

  // calcBMI();

  heightInput.addEventListener("input", calcBMI);
  weightInput.addEventListener("input", calcBMI);

  window.addEventListener("resize", calcBMI);

  if (DEBUG) console.log("BMI calculator initialized");

}

//TDEE calc
function initTDEECalculator(page) {

  // Webflow.push(function () { $('form').submit(function () { return false; }); });

  var counter = { var: 0 };
  let calculated = false;

  function womenBMR(weight, height, age) {
    let result = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    return result;
  }

  function menBMR(weight, height, age) {
    let result = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    return result;
  }

  function calcTDEE() {

    let weight = weightInput.value;
    let height = heightInput.value;
    let age = ageInput.value;
    let gender = String(document.querySelector('input[name="gender"]:checked').value);
    let BMR = 0;
    // let resultArray = [];
    let TDEEResult = 0;
    const activityIndexArray = [1.2, 1.375, 1.55, 1.725, 1.9];

    if (gender == "women") {
      BMR = womenBMR(weight, height, age);
      // for (let i = 0; i < activityIndexArray.length; i++) {
      //   resultArray[i] = Math.round(BMR * activityIndexArray[i]);
      // }
      TDEEResult = Math.round(BMR * activityIndexArray[parseInt(activitySelect.value) - 1]);
    } else { // men
      BMR = menBMR(weight, height, age);
      // for (let i = 0; i < activityIndexArray.length; i++) {
      //   resultArray[i] = Math.round(BMR * activityIndexArray[i]);
      // }
      TDEEResult = Math.round(BMR * activityIndexArray[parseInt(activitySelect.value) - 1]);
    }

    // resultBMR.innerHTML = Math.round(BMR);

    for (let i = 0; i < activityIndexArray.length; i++) {
      // document.getElementById(String(i + 1)).innerHTML = resultArray[i];
      document.getElementById(String(i + 1)).textContent = TDEEResult;
    }

    let selectedActivityLevel = activitySelect.value;

    for (let i = 0; i < activityLevelResultRows.length; i++) {
      let row = activityLevelResultRows[i];
      if (i == selectedActivityLevel) {
        row.classList.add("selected");
      } else {
        row.classList.remove("selected");
      }
    }

    let conuterElement = document.querySelector("[data-tdee-result-main]");

    function animateResult(result) {

      gsap.to(counter, 0.5, {
        var: parseInt(result),
        onUpdate: function () {
          let nwc = parseInt(counter.var);
          // conuterElement.innerHTML = nwc;
          conuterElement.textContent = nwc;
        },
      });

    }

    // animateResult(resultArray[selectedActivityLevel - 1]);
    animateResult(TDEEResult);
    calculated = true;

  }

  function singleInputCheck(element, min, max) {
    let value = element.value;
    if (value != "" && parseInt(value) >= parseInt(min) && parseInt(value) <= parseInt(max)) {
      element.classList.remove("error");
      errorTextWrap.style.display = "none";
      errorTextElement.innerText = "";
      resultTextWrap.style.display = "flex";
      return false;
    } else {
      if (calculated) {
        element.classList.add("error");
        errorTextWrap.style.display = "flex";
        switch (element) {
          case ageInput:
            errorTextElement.innerText = errorText.age;
            break;
          case heightInput:
            errorTextElement.innerText = errorText.height;
            break;
          case weightInput:
            errorTextElement.innerText = errorText.weight;
            break;
        }
        resultTextWrap.style.display = "none";
      }
      return true;
    }
  }

  function selectCheck() {
    let selectedActivityLevel = parseInt(activitySelect.value);
    if (selectedActivityLevel != 0) {
      activitySelect.classList.remove("error");
      errorTextWrap.style.display = "none";
      errorTextElement.innerText = "";
      resultTextWrap.style.display = "flex";
      return false;
    } else {
      activitySelect.classList.add("error");
        errorTextWrap.style.display = "flex";
        errorTextElement.innerText = errorText.select;
        resultTextWrap.style.display = "none";
      return true;
    }
  }

  function inputCheck() {

    ageError = singleInputCheck(ageInput, ageMIN, ageMAX);

    heightError = singleInputCheck(heightInput, heightMIN, heightMAX);

    weightError = singleInputCheck(weightInput, weightMIN, weightMAX);

    // selectError = false;
    selectError = selectCheck();
    // let selectedActivityLevel = parseInt(activitySelect.value);
    // if (selectedActivityLevel != 0) {
    //   activitySelect.classList.remove("error");
    //   errorTextWrap.style.display = "none";
    //   errorText.textContent = "";
    //   resultTextWrap.style.display = "flex";
    //   selectError = false;
    // } else {
    //   activitySelect.classList.add("error");
    //     errorTextWrap.style.display = "flex";
    //     errorText.textContent = errorText.select;
    //     resultTextWrap.style.display = "none";
    //   selectError = true;
    // }

    if (!ageError && !heightError && !weightError && !selectError) { calcTDEE(); }

  }

  // const calcButton = document.querySelector("[data-tdee-calc]");
  const ageInput = document.querySelector("[data-tdee-age]");
  const heightInput = document.querySelector("[data-tdee-height]");
  const weightInput = document.querySelector("[data-tdee-weight]");
  const activitySelect = document.querySelector("[data-activity-select]");
  const activityLevelResultRows = document.querySelectorAll("[data-tdee-result-row]");
  const genderInputs = document.querySelectorAll('input[name="gender"]');

  const resultTextWrap = document.querySelector("[data-tdee-result-text-wrap]");
  const errorTextWrap = document.querySelector("[data-tdee-error-text-wrap]");
  const errorTextElement = document.querySelector("[data-tdee-error-text]");
  const errorText = {
    age: "Neispravan unos za godine",
    height: "Neispravan unos za visinu",
    weight: "Neispravan unos za težinu",
    select: "Odaberite nivo aktivnosti",
  }

  if (errorTextWrap) errorTextWrap.style.display = "none";

  let ageError = true;
  let heightError = true;
  let weightError = true;
  let selectError = true;

  ageInput.addEventListener("input", () => {
    ageError = singleInputCheck(ageInput, ageMIN, ageMAX);
    if (!ageError && !heightError && !weightError && !selectError) { calcTDEE(); } 
  });
  heightInput.addEventListener("input", () => {
    heightError = singleInputCheck(heightInput, heightMIN, heightMAX);
    if (!ageError && !heightError && !weightError && !selectError) { calcTDEE(); }
  }); 
  weightInput.addEventListener("input", () => {
    weightError = singleInputCheck(weightInput, weightMIN, weightMAX);
    if (!ageError && !heightError && !weightError && !selectError) { calcTDEE(); }
  });
  activitySelect.addEventListener("change", () => {
    selectError = selectCheck();
    // selectError = false;
    // let selectedActivityLevel = parseInt(activitySelect.value);
    // if (selectedActivityLevel != 0) {
    //   activitySelect.classList.remove("error");
    //   selectError = false;
    // } else {
    //   activitySelect.classList.add("error");
    //   selectError = true;
    // }
    if (!ageError && !heightError && !weightError && !selectError) { calcTDEE(); }
  });

  genderInputs.forEach(input => {
    input.addEventListener("change", () => {
      if (!ageError && !heightError && !weightError && !selectError) { calcTDEE(); }
    });
  });

  // const resultBMR = document.querySelector("[data-tdee-bmr]");
  
  const weightMIN = 30;
  const weightMAX = 300;
  const heightMIN = 100;
  const heightMAX = 250;
  const ageMIN = 18;
  const ageMAX = 100;

  // calcButton?.addEventListener('click', inputCheck);

  if (DEBUG) console.log("TDEE calculator initialized");

}

//nav
function initNavButtonAnimation() {
  const navWrap = document.querySelector("[data-navbar-wrap]");
  if (!navWrap) return;

  const navButtons = navWrap.querySelectorAll("[data-button-hover-animation]");
  if (navButtons.length === 0) return;

  navButtons.forEach(button => {
    const animationElements = button.querySelectorAll("[data-button-arrow]");
    if (animationElements.length === 0) return;

    button.addEventListener("mouseenter", () => { animateButtonHoverON(animationElements); });
    button.addEventListener("mouseleave", () => { animateButtonHoverOFF(animationElements); });
  });

  // if (DEBUG) console.log("Nav button animation initialized");

}
function initNavLinkHoverAnimation() {
  const navMenu = document.querySelector("[data-nav-menu]");
  if (!navMenu) return;

  const navLinks = Array.from(navMenu.querySelectorAll("[data-nav-link]"));
  if (navLinks.length === 0) return;

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      gsap.to(navLinks, {
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

  navMenu.addEventListener("mouseleave", () => {
    gsap.to(navLinks, {
      autoAlpha: 1,
      duration: 0.3,
      ease: "smooth",
      overwrite: true,
    });
  });

  // if (DEBUG) console.log("Nav link hover animation initialized");

}

//element animations
function animateButtonHoverON(animationElements) {
  gsap.fromTo(animationElements, {
    x: "-50%",
  }, {
    x: "50%",
    duration: 0.3,
    ease: "smooth",
  });
}
function animateButtonHoverOFF(animationElements) {
  gsap.set(animationElements, {
    x: "-50%",
  });
}
function initButtonHoverAnimation(page) {
  const buttons = page.querySelectorAll("[data-button-hover-animation]");
  if (buttons.length === 0) return;

  buttons.forEach(button => {
    const animationElements = button.querySelectorAll("[data-button-arrow]");
    if (animationElements.length === 0) return;

    button.addEventListener("mouseenter", () => { animateButtonHoverON(animationElements); });
    button.addEventListener("mouseleave", () => { animateButtonHoverOFF(animationElements); });
  });

  // if (DEBUG) console.log("Button hover animation initialized");

}

function initSixCardAnimations(page) {
  const cards = page.querySelectorAll("[data-six-card]");
  if (cards.length === 0) return;

  cards.forEach(card => {
    gsap.fromTo(card, {
      y: "-2em",
      autoAlpha: 0,
    }, {
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
      }
    });

    let cardButton = card.querySelector("[data-button-hover-animation]");
    if (cardButton) {

      const animationElements = cardButton.querySelectorAll("[data-button-arrow]");
      if (animationElements.length === 0) return;

      card.addEventListener("mouseenter", () => { animateButtonHoverON(animationElements); });
      card.addEventListener("mouseleave", () => { animateButtonHoverOFF(animationElements); });
    }

  });

  // if (DEBUG) console.log("Six card animation initialized");
}

function initClientMarqueeAnimation(page) {
  const marqueeTracks = page.querySelectorAll("[data-marquee-track]");
  if (marqueeTracks.length === 0) {
    // if (DEBUG) console.log("No marquee tracks found, skipping marquee animation initialization");
    return;
  }

  marqueeTracks.forEach(track => {
    const marqueeItems = track.querySelectorAll("[data-marquee-item]");
    if (marqueeItems.length === 0) {
      // if (DEBUG) console.log("No marquee items found for this track, skipping...");
      return;
    }
    marqueeItems.forEach(item => {
      gsap.fromTo(item, {
        x: "0%",
      }, {
        x: "100%",
        duration: 45,
        ease: "linear",
        repeat: -1,
        scrollTrigger: {
          trigger: track,
          start: "top bottom",
          toggleActions: "play none none none",
          markers: DEBUG,
        }
      });
    });
  });

  // if (DEBUG) console.log("Marquee tracks initialized");
}

function initTestimonialMarqueeAnimation(page) {
  const testimonialMarqueeSection = page.querySelectorAll("[data-testimonial-marquee-section]");
  if (testimonialMarqueeSection.length === 0) {
    // if (DEBUG) console.log("No testimonial marquee section found, skipping testimonial marquee animation initialization");
    return;
  }
  testimonialMarqueeSection.forEach(section => {
    const marqueeItems = section.querySelectorAll("[data-testimonial-marquee-item]");
    if (marqueeItems.length === 0) {
      // if (DEBUG) console.log("No testimonial marquee items found for this section, skipping...");
      return;
    }
    marqueeItems.forEach(item => {
      gsap.fromTo(item, {
        x: "0%",
      }, {
        x: "100%",
        duration: 30,
        ease: "linear",
        repeat: -1,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          toggleActions: "play none none none",
          markers: DEBUG,
        }
      });
    });
  });

  // if (DEBUG) console.log("Testimonial marquee tracks initialized");
}

// TODO handle anchor links


// TODO init nav mobile menu animation
// TODO close mobile nav menu after naivgating to an anchor or new page.


// TODO cehck TDEE calc input flow
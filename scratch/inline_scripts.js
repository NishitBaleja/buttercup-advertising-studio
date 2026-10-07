
/* ===== script 4 (1614 chars) ===== */

/**
 * LENIS SMOOTH SCROLL INITIALIZATION
 * ---------------------------------
 * - Enables smooth scrolling using requestAnimationFrame
 * - Allows start / stop / toggle via data attributes
 * - Optimized for desktop scroll behavior
 */

let lenis = new Lenis({
  lerp: 0.1,                // Smoothness (lower = smoother, higher = snappier)
  wheelMultiplier: 0.7,     // Scroll speed for mouse wheel
  gestureOrientation: "vertical", // Vertical scrolling only
  normalizeWheel: false,   // Keep native wheel behavior
  smoothTouch: false,      // Disable smooth scrolling on touch devices
});

/* ==========================
   RAF LOOP (REQUIRED)
========================== */

/**
 * Drives Lenis using requestAnimationFrame
 * Ensures smooth and consistent scrolling
 */
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

// Start the RAF loop
requestAnimationFrame(raf);

/* ==========================
   SCROLL CONTROLS (OPTIONAL)
========================== */

/**
 * START smooth scrolling
 * Usage: add data-lenis-start to any element
 */
$("[data-lenis-start]").on("click", function () {
  lenis.start();
});

/**
 * STOP smooth scrolling
 * Usage: add data-lenis-stop to any element
 */
$("[data-lenis-stop]").on("click", function () {
  lenis.stop();
});

/**
 * TOGGLE smooth scrolling
 * Adds/removes `.stop-scroll` class on the trigger
 * Usage: add data-lenis-toggle to any element
 */
$("[data-lenis-toggle]").on("click", function () {
  $(this).toggleClass("stop-scroll");

  if ($(this).hasClass("stop-scroll")) {
    lenis.stop();
  } else {
    lenis.start();
  }
});

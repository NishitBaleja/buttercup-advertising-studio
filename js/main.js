/**
 * Buttercup Advertising Studio - Interactive Scripts
 * Handles Lenis smooth scrolling and the scroll / load GSAP animations,
 * mirroring the timelines of the original site 1-to-1 (hero, about, services,
 * selected work, archive, news, marquee) + cursor follower, tabs, video lightbox.
 */

document.addEventListener("DOMContentLoaded", () => {

  // =========================================================================
  // 1. LENIS SMOOTH SCROLL
  // =========================================================================
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    try {
      lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 0.7,
        gestureOrientation: "vertical",
        normalizeWheel: false,
        smoothTouch: false,
      });

      // If GSAP is present, it will drive Lenis via gsap.ticker below; otherwise fallback to RAF
      if (typeof gsap === "undefined") {
        function raf(time) {
          if (lenis) lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      // Data attributes for Lenis control (pure vanilla JS, no jQuery)
      document.querySelectorAll("[data-lenis-start]").forEach(el => {
        el.addEventListener("click", () => lenis && lenis.start());
      });
      document.querySelectorAll("[data-lenis-stop]").forEach(el => {
        el.addEventListener("click", () => lenis && lenis.stop());
      });
      document.querySelectorAll("[data-lenis-toggle]").forEach(el => {
        el.addEventListener("click", () => {
          el.classList.toggle("stop-scroll");
          if (el.classList.contains("stop-scroll")) {
            lenis && lenis.stop();
          } else {
            lenis && lenis.start();
          }
        });
      });
    } catch (e) {
      console.warn("Lenis initialization error:", e);
    }
  }

  // =========================================================================
  // 2. GSAP & SCROLLTRIGGER INITIALIZATION
  // =========================================================================
  if (typeof gsap !== "undefined") {
    try {
      const pluginsToRegister = [];
      if (typeof ScrollTrigger !== "undefined") pluginsToRegister.push(ScrollTrigger);
      if (typeof SplitText !== "undefined") pluginsToRegister.push(SplitText);

      if (pluginsToRegister.length > 0) {
        gsap.registerPlugin(...pluginsToRegister);
      }

      // Sync Lenis with GSAP ScrollTrigger
      if (lenis && typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      }
    } catch (e) {
      console.warn("GSAP plugin registration error:", e);
    }

    const hasST = typeof ScrollTrigger !== "undefined";
    const hasSplit = typeof SplitText !== "undefined";
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    const setupAnimations = () => {

      // -----------------------------------------------------------------
      // A. PAGE LOAD: instantaneous display (no 2-second blank void / loader delay)
      // -----------------------------------------------------------------
      const heroHeading = $(".hero-content .heading-x_large");
      const heroLogo = $(".hero-video-wrp .icon-embed-custom");
      const heroVideo = $(".hero-video");
      const navbar = $(".navbar");

      if (navbar) gsap.set(navbar, { opacity: 1, yPercent: 0 });
      if (heroHeading) gsap.set(heroHeading, { opacity: 1, y: 0 });
      if (heroLogo) gsap.set(heroLogo, { opacity: 1 });
      if (heroVideo) gsap.set(heroVideo, { opacity: 1, scale: 1, yPercent: 0 });

      if (!hasST) return;

      // -----------------------------------------------------------------
      // B. HERO: video follows the scroll and grows into the next section
      //    (everything except the tablet range, like the original)
      // -----------------------------------------------------------------
      const heroSection = $(".section.is-hero");
      if (heroSection && heroVideo) {
        const mm = gsap.matchMedia();
        mm.add("(min-width: 992px), (max-width: 767px)", () => {
          gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              start: "clamp(25% 35%)",
              end: "clamp(60% top)",
              scrub: 0.8
            }
          }).fromTo(heroVideo,
            { width: "55%", y: "0vh" },
            { width: "110%", y: "110vh", ease: "none", duration: 0.5 }, 0);
        });
      }

      // -----------------------------------------------------------------
      // C. ABOUT: first statement fades out, second one reveals word by word
      //    Triggers cleanly as soon as the first line finishes and photos 3 & 4 arrive
      // -----------------------------------------------------------------
      const aboutSection = $(".section.is-about-section");
      const aboutH1 = $(".heading-x_large.is-about");
      const aboutH2 = $(".heading-x_large.is-about-2nd");
      if (aboutSection && aboutH1 && aboutH2) {
        gsap.set(aboutH2, {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          opacity: 1
        });
        let words = [aboutH2];
        if (hasSplit) {
          const splitAbout2 = new SplitText(aboutH2, {
            type: "words",
            wordsClass: "gsap_split_word"
          });
          words = splitAbout2.words;
        }

        // Set initial hidden state of 2nd heading words
        gsap.set(words, { opacity: 0, y: "25%" });

        // Smooth triggered timeline that plays/reverses without slow scrub delay
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: aboutSection,
            start: "clamp(top -80%)",
            end: "bottom top",
            toggleActions: "play reverse play reverse"
          }
        });

        aboutTl
          .to(aboutH1, { opacity: 0, duration: 0.25, ease: "power1.out" }, 0)
          .to(words, {
            opacity: 1,
            y: "0%",
            duration: 0.35,
            stagger: { each: 0.05 },
            ease: "power2.out"
          }, 0.12);
      }

      // -----------------------------------------------------------------
      // D. SERVICES: heading line reveal (cards are pure CSS sticky stack)
      // -----------------------------------------------------------------
      const serviceHeading = $(".service-header-sticky .heading-x_large");
      if (serviceHeading) {
        let serviceTargets = [serviceHeading];
        let splitService = null;
        if (hasSplit) {
          splitService = new SplitText(serviceHeading, { type: "words", wordsClass: "gsap_split_word" });
          serviceTargets = splitService.words;
        }
        gsap.fromTo(serviceTargets,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05,
            scrollTrigger: { trigger: serviceHeading, start: "top 85%", toggleActions: "play none none none" },
            onComplete: () => { if (splitService) splitService.revert(); }
          });
      }

      // -----------------------------------------------------------------
      // E. SELECTED WORK: sticky list, every image opens (left -> right) then
      //    collapses to the right while the next one opens.
      // -----------------------------------------------------------------
      const worksWrapper = $(".works-wrapper");
      const workImgs = $$(".work-img", worksWrapper || document);
      if (worksWrapper && workImgs.length) {
        const worksTl = gsap.timeline({
          scrollTrigger: {
            trigger: worksWrapper,
            start: "clamp(top 120%)",
            end: "clamp(bottom 5%)",
            scrub: 0.8
          }
        });
        worksTl.fromTo(workImgs,
          { width: "0%" },
          { width: "100%", ease: "none", duration: 0.5, stagger: { each: 0.6 } }, 0);
        worksTl.fromTo(workImgs,
          { width: "100%", x: "0vw" },
          { width: "0%", x: "100vw", ease: "none", duration: 0.5, stagger: { each: 0.6 }, immediateRender: false }, 0.61);
        worksTl.to(worksWrapper, { y: "-3rem", ease: "none", duration: 0.25 }, 1.75);
        worksTl.to(worksWrapper, { y: "-5.3rem", ease: "none", duration: 0.25 }, 2.4);
        worksTl.to(worksWrapper, { y: "-7.7rem", ease: "none", duration: 0.25 }, 3.05);
        worksTl.to(worksWrapper, { y: "-10rem", ease: "none", duration: 0.25 }, 3.7);
      }

      // -----------------------------------------------------------------
      // F. ARCHIVE: images grow from 0 to full size, labels slide in
      // -----------------------------------------------------------------
      const archiveSection = $(".section.overflow-hidden");
      if (archiveSection) {
        const archiveTl = gsap.timeline({
          scrollTrigger: {
            trigger: archiveSection,
            start: "clamp(top 50%)",
            end: "clamp(bottom 60%)",
            scrub: 0.8
          }
        });
        archiveTl.fromTo($$(".archive-img", archiveSection),
          { width: "0%", height: "0%" },
          { width: "100%", height: "100%", ease: "none", duration: 0.5, stagger: { amount: 2 } }, 0);
        archiveTl.fromTo($$(".archive-elem-content", archiveSection),
          { opacity: 0, x: "20%" },
          { opacity: 1, x: "0%", ease: "none", duration: 0.5, stagger: { amount: 2.5 } }, 0);
      }

      // -----------------------------------------------------------------
      // G. LATEST NEWS: header + cards rise in
      // -----------------------------------------------------------------
      const blogHeader = $(".blog-header");
      const blogSection = blogHeader && blogHeader.closest(".section");
      if (blogSection) {
        const blogTl = gsap.timeline({
          scrollTrigger: {
            trigger: blogSection,
            start: "clamp(top 50%)",
            end: "clamp(bottom bottom)",
            scrub: 1
          }
        });
        blogTl.fromTo(blogHeader,
          { opacity: 0, y: "100%" },
          { opacity: 1, y: "0%", ease: "power1.out", duration: 0.5 }, 0);
        blogTl.fromTo($$(".cards", blogSection),
          { opacity: 0, y: "50%" },
          { opacity: 1, y: "0%", ease: "power1.out", duration: 0.5, stagger: { amount: 0.5, from: "start" } }, 0.06);
      }

      // -----------------------------------------------------------------
      // H. MARQUEE: endless horizontal loop
      // -----------------------------------------------------------------
      const marqueeTracks = $$(".marquee-track");
      if (marqueeTracks.length) {
        gsap.to(marqueeTracks, { x: "-100%", duration: 20, repeat: -1, ease: "none" });
      }
    };

    const start = () => {
      try {
        setupAnimations();
      } catch (e) {
        console.warn("Animation setup error:", e);
      }
      if (typeof ScrollTrigger !== "undefined") {
        // Heights change once images / fonts have loaded
        window.addEventListener("load", () => ScrollTrigger.refresh());
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => ScrollTrigger.refresh());
        }
      }
    };

    start();
  }

  // =========================================================================
  // 3. INTERACTIVE MOUSE CURSOR FOLLOWER
  // =========================================================================
  const cursorWrp = document.querySelector(".project-cursor-wrp");
  const cursorFollower = document.querySelector(".view-project-follow-cursor");

  if (cursorWrp && cursorFollower) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isTracking = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      if (isTracking) {
        currentX += (mouseX - currentX) * 0.18;
        currentY += (mouseY - currentY) * 0.18;
        cursorFollower.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(updateCursor);
    }
    requestAnimationFrame(updateCursor);

    // Show cursor when hovering over interactive project elements
    const hoverTargets = document.querySelectorAll(".works-wrapper, .project-clw_wrapper, .cards.is-projects, .work-elem");
    hoverTargets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        isTracking = true;
        cursorWrp.classList.add("is-visible");
      });
      el.addEventListener("mouseleave", () => {
        cursorWrp.classList.remove("is-visible");
      });
    });
  }

  // =========================================================================
  // 4. SELECTED WORK TABS (LIST vs GRID VIEW)
  // =========================================================================
  const tabLinks = document.querySelectorAll(".grid-list-view[data-w-tab]");
  const tabPanes = document.querySelectorAll(".w-tab-content .w-tab-pane");

  if (tabLinks.length > 0 && tabPanes.length > 0) {
    tabLinks.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const tabName = btn.getAttribute("data-w-tab");

        tabLinks.forEach(b => b.classList.remove("w--current"));
        btn.classList.add("w--current");

        tabPanes.forEach(pane => {
          if (pane.getAttribute("data-w-tab") === tabName) {
            pane.classList.add("w--tab-active");
            pane.style.display = "block";
          } else {
            pane.classList.remove("w--tab-active");
            pane.style.display = "none";
          }
        });

        if (typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      });
    });
  }

  // =========================================================================
  // 5. VIDEO LIGHTBOX MODAL
  // =========================================================================
  const playButtons = document.querySelectorAll(".play-button, [data-lightbox-url]");
  if (playButtons.length > 0) {
    let modal = document.querySelector(".custom-lightbox-modal");
    if (!modal) {
      modal = document.createElement("div");
      modal.className = "custom-lightbox-modal";
      modal.innerHTML = `
        <div class="custom-lightbox-inner">
          <button class="custom-lightbox-close" aria-label="Close video">&times;</button>
          <iframe src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector(".custom-lightbox-close");
      const iframe = modal.querySelector("iframe");

      const closeModal = () => {
        modal.classList.remove("is-open");
        iframe.src = "";
        if (lenis) lenis.start();
      };

      closeBtn.addEventListener("click", closeModal);
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
      });
    }

    playButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        let rawUrl = btn.getAttribute("data-lightbox-url") || "https://www.youtube.com/watch?v=REaC0cMpcJs";
        // Convert YouTube watch URL to embed URL
        let videoId = "";
        if (rawUrl.includes("v=")) {
          videoId = rawUrl.split("v=")[1].split("&")[0].split("?")[0];
        } else if (rawUrl.includes("youtu.be/")) {
          videoId = rawUrl.split("youtu.be/")[1].split("?")[0];
        }
        const embedUrl = videoId 
          ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
          : rawUrl;

        const iframe = modal.querySelector("iframe");
        iframe.src = embedUrl;
        modal.classList.add("is-open");
        if (lenis) lenis.stop();
      });
    });
  }

  // =========================================================================
  // 6. MOBILE NAVIGATION TOGGLE
  // =========================================================================
  const menuBtn = document.querySelector(".menu-button");
  const navMenu = document.querySelector(".nav-menu");
  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("w--open");
      menuBtn.classList.toggle("w--open", isOpen);
    });
  }

});

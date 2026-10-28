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
      window.lenis = lenis;

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
      // -----------------------------------------------------------------
      const heroSection = $(".section.is-hero");
      if (heroSection && heroVideo) {
        const mm = gsap.matchMedia();
        // Desktop (>= 992px): original video travel into next section
        mm.add("(min-width: 992px)", () => {
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

        // Tablet (768px - 991px): video moves down into the white space above 'Delivered More'
        mm.add("(min-width: 768px) and (max-width: 991px)", () => {
          gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 0.8
            }
          }).fromTo(heroVideo,
            { width: "65%", y: "0vh" },
            { width: "88%", y: "40vh", ease: "none", duration: 0.5 }, 0);
        });

        // Mobile (<= 767px): video travels smoothly from BAS down into the white blank space right above 'Delivered More'
        mm.add("(max-width: 767px)", () => {
          gsap.timeline({
            scrollTrigger: {
              trigger: heroSection,
              start: "top top",
              end: "bottom top",
              scrub: 0.8
            }
          }).fromTo(heroVideo,
            { width: "68%", y: "0vh" },
            { width: "90%", y: "34vh", ease: "none", duration: 0.5 }, 0);
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
        gsap.to(marqueeTracks, { x: "-100%", duration: 36, repeat: -1, ease: "none" });
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
  const allTabMenus = document.querySelectorAll(".tabs, .w-tabs, .grid-list-tabs");
  if (allTabMenus.length > 0) {
    allTabMenus.forEach((tabContainer) => {
      const containerLinks = tabContainer.querySelectorAll("[data-w-tab].w-tab-link, [data-w-tab].grid-list-view, [data-w-tab].project-tabs");
      const containerPanes = tabContainer.querySelectorAll(".w-tab-content .w-tab-pane");

      containerLinks.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const tabName = btn.getAttribute("data-w-tab");

          containerLinks.forEach(b => {
            b.classList.remove("w--current");
            const act = b.querySelector(".active-tab");
            if (act) act.remove();
          });
          btn.classList.add("w--current");

          // For work.html project-tabs active indicator
          if (btn.classList.contains("project-tabs")) {
            const actDiv = document.createElement("div");
            actDiv.className = "active-tab";
            btn.appendChild(actDiv);
          }

          containerPanes.forEach(pane => {
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
    });
  }

  // =========================================================================
  // 4B. PROJECT CATEGORY ROUTING FALLBACK
  // =========================================================================
  const currentPath = window.location.pathname.toLowerCase();
  if (currentPath.includes("work")) {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = (urlParams.get("category") || "").toLowerCase();
    const isInsidePagesWork = currentPath.includes("/pages/work");
    if (cat === "product") {
      window.location.replace(isInsidePagesWork ? "../industries/product-base/index.html" : "pages/industries/product-base/index.html");
    } else if (cat === "service") {
      window.location.replace(isInsidePagesWork ? "../industries/service-base/index.html" : "pages/industries/service-base/index.html");
    }
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
  // 6. MOBILE NAVIGATION PLUS (+) BUTTON & FULL-SCREEN CONTROLLER
  // =========================================================================
  function initMobileNav() {
    const menuButtons = document.querySelectorAll(".menu-button");
    const navMenuWrapper = document.querySelector(".nav-menu-wrapper, .w-nav-menu");
    if (!menuButtons.length || !navMenuWrapper) return;

    // Clean up any lingering backdrops
    document.querySelectorAll(".mobile-nav-backdrop").forEach(b => b.remove());

    function toggleMenu(forceClose = false) {
      const currentlyOpen = navMenuWrapper.classList.contains("is-mobile-open") || navMenuWrapper.classList.contains("w--open");
      const shouldOpen = forceClose ? false : !currentlyOpen;

      navMenuWrapper.classList.toggle("is-mobile-open", shouldOpen);
      navMenuWrapper.classList.toggle("w--open", shouldOpen);
      document.body.classList.toggle("mobile-menu-active", shouldOpen);

      // Lock body scroll when mobile menu is open, restore when closed
      if (shouldOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      menuButtons.forEach(btn => {
        btn.classList.toggle("w--open", shouldOpen);
      });
    }

    menuButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
      });
    });

    // Close when clicking normal page links (excluding dropdown triggers)
    navMenuWrapper.querySelectorAll("a:not(.nav-dropdown-trigger)").forEach(link => {
      link.addEventListener("click", () => {
        if (window.innerWidth <= 991) {
          toggleMenu(true);
        }
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        toggleMenu(true);
      }
    });

    // Close on window resize if larger than 991px
    window.addEventListener("resize", () => {
      if (window.innerWidth > 991) {
        toggleMenu(true);
      }
    });
  }

  initMobileNav();

  // =========================================================================
  // 7. INDUSTRY & SERVICES DROPDOWN MEGA POPUPS
  // =========================================================================
  const dropdownWrappers = document.querySelectorAll(".nav-dropdown-wrapper");
  dropdownWrappers.forEach(wrapper => {
    let timer = null;
    let subTimer = null;
    const video = wrapper.querySelector(".industry-video");
    const mainPopup = wrapper.querySelector(".industry-dropdown-popup");
    const subpopup = wrapper.querySelector(".industry-subpopup");
    const catCards = wrapper.querySelectorAll(".industry-cat-card");
    const panels = wrapper.querySelectorAll(".subpopup-panel");

    function showSubpanel(catType) {
      if (!subpopup) return;
      clearTimeout(subTimer);

      panels.forEach(p => {
        const matches = p.id === `subpopup-${catType}` || p.getAttribute("data-panel") === catType;
        p.style.display = matches ? "block" : "none";
      });

      if (mainPopup) {
        mainPopup.classList.remove("show-product-subpopup", "show-service-subpopup");
        if (catType === "product") mainPopup.classList.add("show-product-subpopup");
        if (catType === "service") mainPopup.classList.add("show-service-subpopup");
      }

      subpopup.classList.add("is-visible");
      subpopup.setAttribute("data-active-cat", catType);
    }

    function hideSubpopup() {
      if (!subpopup) return;
      subTimer = setTimeout(() => {
        subpopup.classList.remove("is-visible");
        subpopup.removeAttribute("data-active-cat");
        if (mainPopup) mainPopup.classList.remove("show-product-subpopup", "show-service-subpopup");
        catCards.forEach(c => c.classList.remove("is-active"));
      }, 240);
    }

    catCards.forEach(card => {
      const catType = card.getAttribute("data-category") ||
        (card.innerText.includes("Product") ? "product" :
         card.innerText.includes("Strategy") ? "brand-strategy" :
         card.innerText.includes("Visual") ? "visual-identity" :
         card.innerText.includes("Marketing") ? "marketing-comm" : "service");

      const handleEnter = () => {
        clearTimeout(subTimer);
        catCards.forEach(c => c.classList.remove("is-active"));
        card.classList.add("is-active");
        showSubpanel(catType);
      };

      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseover", handleEnter);

      card.addEventListener("mouseleave", (e) => {
        const toElem = e.relatedTarget;
        if (subpopup && subpopup.contains(toElem)) return;
        hideSubpopup();
      });

      // Explicit click handler ensures navigation always occurs immediately
      card.addEventListener("click", (e) => {
        const href = card.getAttribute("href");
        if (href && href !== "#") {
          e.preventDefault();
          e.stopPropagation();
          window.location.href = href;
        }
      });
    });

    if (subpopup) {
      // Also ensure subpopup links and CTA reliably navigate
      subpopup.querySelectorAll(".subpopup-link, .subpopup-cta").forEach(link => {
        link.addEventListener("click", (e) => {
          const href = link.getAttribute("href");
          if (href && href !== "#") {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = href;
          }
        });
      });

      const keepVisible = () => {
        clearTimeout(subTimer);
        subpopup.classList.add("is-visible");
        const activeCat = subpopup.getAttribute("data-active-cat");
        if (activeCat) {
          catCards.forEach(c => {
            const cat = c.getAttribute("data-category");
            c.classList.toggle("is-active", cat === activeCat);
          });
        }
      };

      subpopup.addEventListener("mouseenter", keepVisible);
      subpopup.addEventListener("mouseover", keepVisible);
      subpopup.addEventListener("mouseleave", (e) => {
        const toElem = e.relatedTarget;
        let isMovingToCard = false;
        catCards.forEach(c => {
          if (c.contains(toElem)) isMovingToCard = true;
        });
        if (!isMovingToCard) {
          hideSubpopup();
        }
      });
    }

    wrapper.addEventListener("mouseenter", () => {
      clearTimeout(timer);
      wrapper.classList.add("is-open");
      if (video && video.paused) {
        video.play().catch(() => {});
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      timer = setTimeout(() => {
        wrapper.classList.remove("is-open");
        if (subpopup) {
          subpopup.classList.remove("is-visible");
          subpopup.removeAttribute("data-active-cat");
        }
        if (mainPopup) mainPopup.classList.remove("show-product-subpopup", "show-service-subpopup");
        catCards.forEach(c => c.classList.remove("is-active"));
      }, 200);
    });

    const trigger = wrapper.querySelector(".nav-dropdown-trigger");
    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const wasOpen = wrapper.classList.contains("is-open");
        dropdownWrappers.forEach(other => {
          if (other !== wrapper) {
            other.classList.remove("is-open", "is-mobile-open");
          }
        });
        wrapper.classList.toggle("is-open", !wasOpen);
        if (window.innerWidth <= 991) {
          wrapper.classList.toggle("is-mobile-open", !wasOpen);
        }
        if (video && video.paused) {
          video.play().catch(() => {});
        }
      });
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown-wrapper")) {
      dropdownWrappers.forEach(w => w.classList.remove("is-open", "is-mobile-open"));
    }
  });

  // =========================================================================
  // NAVBAR SQUIGGLY UNDERLINE: Hidden by default, animated on hover
  // =========================================================================
  const allNavbarLinks = document.querySelectorAll(".navbar .nav-links, .nav-dropdown-wrapper");
  allNavbarLinks.forEach((linkItem) => {
    const underline = linkItem.querySelector(".underline-overflow");
    if (!underline) return;

    // Explicitly hide initially
    underline.style.setProperty("width", "0%", "important");
    underline.style.setProperty("max-width", "0%", "important");
    underline.style.setProperty("opacity", "0", "important");
    underline.style.setProperty("visibility", "hidden", "important");
    underline.style.setProperty("pointer-events", "none", "important");
    underline.style.setProperty(
      "transition",
      "width 0.35s cubic-bezier(0.25, 1, 0.5, 1), max-width 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.25s ease, visibility 0.25s ease",
      "important"
    );

    const showUnderline = () => {
      underline.style.setProperty("visibility", "visible", "important");
      underline.style.setProperty("width", "100%", "important");
      underline.style.setProperty("max-width", "100%", "important");
      underline.style.setProperty("opacity", "1", "important");
    };

    const hideUnderline = () => {
      underline.style.setProperty("width", "0%", "important");
      underline.style.setProperty("max-width", "0%", "important");
      underline.style.setProperty("opacity", "0", "important");
      setTimeout(() => {
        if (!linkItem.matches(":hover")) {
          underline.style.setProperty("visibility", "hidden", "important");
        }
      }, 350);
    };

    linkItem.addEventListener("mouseenter", showUnderline);
    linkItem.addEventListener("mouseleave", hideUnderline);
  });

  // =========================================================================
  // GLOBAL CUSTOM ROUND CURSOR ("GOL GOL CURSOR")
  // =========================================================================
  function initGlobalCustomCursor() {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.documentElement.classList.add("custom-cursor-active");

    let cursorDot = document.querySelector(".custom-cursor-dot");
    let cursorRing = document.querySelector(".custom-cursor-ring");

    if (!cursorDot) {
      cursorDot = document.createElement("div");
      cursorDot.className = "custom-cursor-dot";
      document.body.appendChild(cursorDot);
    }
    if (!cursorRing) {
      cursorRing = document.createElement("div");
      cursorRing.className = "custom-cursor-ring";
      document.body.appendChild(cursorRing);
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;
    let isHovering = false;
    let rafId = null;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        ringX = mouseX;
        ringY = mouseY;
        cursorDot.classList.add("is-active");
        cursorRing.classList.add("is-active");
      }
    }, { passive: true });

    window.addEventListener("mousedown", () => {
      cursorRing.classList.add("is-clicking");
    }, { passive: true });

    window.addEventListener("mouseup", () => {
      cursorRing.classList.remove("is-clicking");
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      isVisible = false;
      cursorDot.classList.remove("is-active");
      cursorRing.classList.remove("is-active");
    }, { passive: true });

    document.addEventListener("mouseenter", () => {
      isVisible = true;
      cursorDot.classList.add("is-active");
      cursorRing.classList.add("is-active");
    }, { passive: true });

    // Single unified 120fps hardware-accelerated RAF render loop
    function renderCursor() {
      if (isVisible) {
        // Dot follows 1:1 instantaneously with zero lag
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

        // Ring follows with responsive luxury spring lerp (0.35 = buttery smooth, no dragging)
        ringX += (mouseX - ringX) * 0.35;
        ringY += (mouseY - ringY) * 0.35;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(renderCursor);
    }
    rafId = requestAnimationFrame(renderCursor);

    // High-performance cached hover detection
    const interactiveSel = "a, button, input, textarea, select, [role='button'], .nav-links, .cards, .submit-btn, .menu-button, .custom-lightbox-close, .cs-close-btn, .cs-btn, .btr-ai-orb-button, .em-ai-chip";
    let lastTarget = null;

    document.addEventListener("mouseover", (e) => {
      if (e.target === lastTarget) return;
      lastTarget = e.target;
      const targetIsInteractive = !!(e.target && e.target.closest && e.target.closest(interactiveSel));
      if (targetIsInteractive !== isHovering) {
        isHovering = targetIsInteractive;
        cursorRing.classList.toggle("is-hovering", isHovering);
        cursorDot.classList.toggle("is-hovering", isHovering);
      }
    }, { passive: true });
  }

  initGlobalCustomCursor();

  // =========================================================================
  // 13. CONTACT FORM SUBMISSION (FormSubmit -> nishitbaleja@gmail.com)
  // =========================================================================
  function setupContactForm() {
    const form = document.getElementById("email-form");
    if (!form) return;

    const successCard = document.getElementById("contact-form-success");
    const errorCard = document.getElementById("contact-form-error");
    const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
    const nextInput = document.getElementById("_next_url");

    // Dynamic _next redirect URL for native submit fallback (works on any domain/link)
    if (nextInput) {
      try {
        const cleanUrl = window.location.origin + window.location.pathname;
        nextInput.value = cleanUrl + "?submitted=true";
      } catch (e) {}
    }

    // Check if user returned from native redirect (?submitted=true)
    if (window.location.search.includes("submitted=true")) {
      form.style.display = "none";
      if (successCard) {
        successCard.style.display = "block";
      }
      try {
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {}
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const originalBtnValue = submitBtn ? (submitBtn.value || submitBtn.textContent) : "Send Message";
      if (submitBtn) {
        submitBtn.disabled = true;
        if (submitBtn.tagName === "INPUT") {
          submitBtn.value = "Sending...";
        } else {
          submitBtn.textContent = "Sending...";
        }
      }

      if (errorCard) errorCard.style.display = "none";

      const formData = new FormData(form);
      const dataObj = {};
      formData.forEach((value, key) => {
        if (key === "_honey") return;
        dataObj[key] = value;
      });

      try {
        const response = await fetch("https://formsubmit.co/ajax/nishitbaleja@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(dataObj)
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && (result.success === "true" || result.success === true || (result.message && result.message.includes("Activation")))) {
          form.style.display = "none";
          if (successCard) {
            successCard.style.display = "block";
            successCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } else {
          throw new Error(result.message || "Failed to submit form");
        }
      } catch (err) {
        console.warn("Fetch failed, falling back to native submission:", err);
        try {
          form.submit();
        } catch (submitErr) {
          if (errorCard) {
            errorCard.style.display = "block";
            errorCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            if (submitBtn.tagName === "INPUT") {
              submitBtn.value = originalBtnValue;
            } else {
              submitBtn.textContent = originalBtnValue;
            }
          }
        }
      }
    });
  }

  setupContactForm();

  // =========================================================================
  // 10. LIVE NUMBER COUNTERS (Viewport & Scroll-Triggered Animation)
  // =========================================================================
  function initLiveCounters() {
    const counterElements = document.querySelectorAll(
      ".pillar-metric-val, .stats-number, [data-counter]"
    );
    if (!counterElements.length) return;

    function easeOutQuart(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function parseMetric(el) {
      const explicitTarget = el.getAttribute("data-target") || el.getAttribute("data-count");
      const explicitSuffix = el.getAttribute("data-suffix");
      const explicitPrefix = el.getAttribute("data-prefix");
      const explicitDecimals = el.getAttribute("data-decimals");
      const explicitPad = el.getAttribute("data-pad");

      const text = el.textContent.trim();
      // Match optional prefix, number (integer or decimal), optional suffix
      const match = text.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);

      let prefix = explicitPrefix !== null ? explicitPrefix : (match ? match[1] : "");
      let rawNum = explicitTarget !== null ? explicitTarget : (match ? match[2] : "");
      let suffix = explicitSuffix !== null ? explicitSuffix : (match ? match[3] : "");

      if (!rawNum) return null;

      const isFloat = rawNum.includes(".");
      const decimals = explicitDecimals !== null
        ? parseInt(explicitDecimals, 10)
        : (isFloat ? rawNum.split(".")[1].length : 0);
      const target = parseFloat(rawNum);
      const isZeroPadded = explicitPad !== null
        ? parseInt(explicitPad, 10)
        : (!isFloat && rawNum.length > 1 && rawNum.startsWith("0") ? rawNum.length : 0);

      return {
        prefix,
        target,
        suffix,
        decimals,
        pad: isZeroPadded,
        originalText: text
      };
    }

    function formatNumber(val, config) {
      let numStr;
      if (config.decimals > 0) {
        numStr = val.toFixed(config.decimals);
      } else {
        numStr = Math.floor(val).toString();
        if (config.pad > 0) {
          while (numStr.length < config.pad) {
            numStr = "0" + numStr;
          }
        }
      }
      return config.prefix + numStr + config.suffix;
    }

    function animateCounter(el, delay = 0) {
      if (el.dataset.counterStarted === "true") return;
      el.dataset.counterStarted = "true";

      const config = parseMetric(el);
      if (!config || isNaN(config.target)) return;

      // Start display at 0
      el.textContent = formatNumber(0, config);
      el.classList.add("is-counting");

      setTimeout(() => {
        const duration = 1800; // 1.8 seconds smooth count
        let startTime = null;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const currentVal = easeOutQuart(progress) * config.target;

          el.textContent = formatNumber(currentVal, config);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = formatNumber(config.target, config);
            el.classList.remove("is-counting");
            el.classList.add("counter-done");
          }
        }

        requestAnimationFrame(step);
      }, delay);
    }

    // Use IntersectionObserver to start counting as soon as scrolled into view
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const container = entry.target;
          const targets = container.querySelectorAll(".pillar-metric-val, .stats-number, [data-counter]");
          if (targets.length) {
            targets.forEach((el, index) => {
              animateCounter(el, index * 100);
            });
          } else {
            animateCounter(container, 0);
          }
          obs.unobserve(container);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    // Observe parent containers if they exist (for synchronized strip animations), else individual items
    const strips = document.querySelectorAll(".pillar-metrics-strip, #stats-grid");
    if (strips.length) {
      strips.forEach(strip => observer.observe(strip));
    }

    counterElements.forEach(el => {
      if (!el.closest(".pillar-metrics-strip") && !el.closest("#stats-grid")) {
        observer.observe(el);
      }
    });

    // Also trigger immediately if already visible in viewport on initial load
    setTimeout(() => {
      counterElements.forEach((el, idx) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          animateCounter(el, idx * 80);
        }
      });
    }, 250);
  }

  initLiveCounters();

  // =========================================================================
  // 11. FAQ ACCORDION INTERACTION (Click + to open/close answers)
  // =========================================================================
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-accordion-item");
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const btn = item.querySelector(".faq-question-btn");
      if (!btn) return;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = item.classList.contains("is-open");

        // Close other open FAQ items in the same container for clean UX
        const parent = item.closest(".faq-wrapper") || item.parentElement;
        if (parent) {
          parent.querySelectorAll(".faq-accordion-item.is-open").forEach(other => {
            if (other !== item) other.classList.remove("is-open");
          });
        }

        // Toggle current item
        item.classList.toggle("is-open", !isOpen);
      });
    });
  }

  initFaqAccordion();

  // =========================================================================
  // 12. CASE STUDY "COMING SOON" MODAL & CLICK INTERCEPTOR
  // =========================================================================
  function initCaseStudyComingSoon() {
    const pPath = window.location.pathname;
    let contactUrl = "pages/contact/index.html";
    if (pPath.includes("/projects/") || pPath.includes("/blogs/") || pPath.includes("/utilities/")) {
      contactUrl = "../pages/contact/index.html";
    } else if (pPath.includes("/pages/services/") || pPath.includes("/pages/industries/")) {
      contactUrl = "../../contact/index.html";
    } else if (pPath.includes("/pages/")) {
      contactUrl = "../contact/index.html";
    }

    // 1. Update project hover cursor text to 'COMING SOON'
    const projectCursorInner = document.querySelectorAll(".view-project-cursor");
    projectCursorInner.forEach((cur) => {
      cur.innerHTML = "<div>coming<br/>soon</div>";
    });

    // 2. Inject Modal Dialog into DOM if not present
    let modal = document.getElementById("csComingSoonModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "csComingSoonModal";
      modal.className = "cs-modal-backdrop";
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-hidden", "true");
      modal.innerHTML = `
        <div class="cs-modal-container">
          <div class="cs-modal-card">
            <div class="cs-glow-orb cs-glow-1"></div>
            <div class="cs-glow-orb cs-glow-2"></div>
            <button class="cs-close-btn" id="csModalCloseBtn" aria-label="Close modal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div class="cs-badge">
              <span class="cs-badge-dot"></span>
              <span class="cs-badge-text">Case Study In Progress</span>
            </div>
            <h2 class="cs-title">Coming Soon</h2>
            <div class="cs-project-heading">
              <span class="cs-project-name" id="csProjectName">Brand Showcase</span>
              <span class="cs-project-tag" id="csProjectCategory">Case Study</span>
            </div>
            <p class="cs-desc" id="csProjectDesc">
              We are currently curating the complete strategic breakdown, packaging architecture, visual identity deliverables, and commercial ROI metrics for this brand. The comprehensive case study will be published shortly.
            </p>
            <div class="cs-status-box">
              <div class="cs-status-header">
                <span class="cs-status-label">Editorial &amp; Creative Archival</span>
                <span class="cs-status-pct">Final Polish · 92%</span>
              </div>
              <div class="cs-status-track">
                <div class="cs-status-fill"></div>
              </div>
            </div>
            <div class="cs-actions">
              <button class="cs-btn cs-btn-secondary" id="csModalSecondaryBtn">
                Explore Other Work
              </button>
              <a href="${contactUrl}" class="cs-btn cs-btn-primary" id="csModalPrimaryBtn">
                <span>Discuss Your Project</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const projectNameEl = modal.querySelector("#csProjectName");
    const projectCatEl = modal.querySelector("#csProjectCategory");
    const projectDescEl = modal.querySelector("#csProjectDesc");
    const closeBtn = modal.querySelector("#csModalCloseBtn");
    const secondaryBtn = modal.querySelector("#csModalSecondaryBtn");
    const modalContainer = modal.querySelector(".cs-modal-card");

    function openModal(projectName, category) {
      if (projectNameEl) projectNameEl.textContent = projectName || "Brand Showcase";
      if (projectCatEl) {
        if (category) {
          projectCatEl.textContent = category;
          projectCatEl.style.display = "inline-block";
        } else {
          projectCatEl.style.display = "none";
        }
      }
      if (projectDescEl) {
        projectDescEl.textContent = `We are currently curating the complete strategic breakdown, visual identity deliverables, packaging architecture, and ROI results for ${projectName || "this project"}. Check back soon for the full showcase.`;
      }

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("cs-modal-active");
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("cs-modal-active");
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }

    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (secondaryBtn) {
      secondaryBtn.addEventListener("click", () => {
        if (window.location.pathname.includes("/projects/")) {
          window.location.href = "../pages/case-studies/index.html";
        } else {
          closeModal();
        }
      });
    }

    // Close on backdrop click outside the card
    modal.addEventListener("click", (e) => {
      if (!modalContainer.contains(e.target)) {
        closeModal();
      }
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    // 3. Helper to detect and extract project info from a clicked element
    function getProjectInfo(target) {
      const link = target.closest('a[href*="projects/"], a.cards.is-projects, a.cards, a.work-elem, .project-grid a, .project-clw_wrapper a, [data-case-study], .fw-card, .grid-card-item');
      if (!link) return null;

      let title = "";
      let category = "";

      // Try finding title in standard typography classes
      const titleEl = link.querySelector(
        ".text-3x_base, .text-2x_base, .works-elements .text-x_base.is-snug:first-child, .project-name_wrapper > div:first-child, .project-title, h1, h2, h3, h4"
      );
      if (titleEl && titleEl.textContent.trim()) {
        title = titleEl.textContent.trim();
      } else {
        const img = link.querySelector("img[alt]");
        if (img && img.alt && !img.alt.includes("Project images") && !img.alt.includes("Project Cms Image") && !img.alt.includes("thumbnail")) {
          title = img.alt.trim();
        }
      }

      // Try finding industry/category
      const catEl = link.querySelector(".project-industry_text, .works-elements .text-x_base:nth-child(4), .text-x_base.is-snug:nth-child(4)");
      if (catEl && catEl.textContent.trim()) {
        category = catEl.textContent.trim();
      }

      // Fallback title from href if not found
      if (!title) {
        const href = link.getAttribute("href") || "";
        const match = href.match(/projects\/([^.]+)\.html/);
        if (match) {
          title = match[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        }
      }

      return {
        link,
        title: title || "Case Study",
        category: category || "",
      };
    }

    // 4. Delegated Click Interceptor across the whole document
    document.addEventListener("click", (e) => {
      const info = getProjectInfo(e.target);
      if (info) {
        e.preventDefault();
        e.stopPropagation();
        openModal(info.title, info.category);
      }
    }, true);

    // 5. If user directly visits a /projects/*.html page, inject a top banner and trigger modal
    const isInsideProjectsFolder = window.location.pathname.includes('/projects/');
    if (isInsideProjectsFolder) {
      const existingBanner = document.querySelector(".project-cs-status-banner");
      if (!existingBanner) {
        const banner = document.createElement("div");
        banner.className = "project-cs-status-banner";
        const pageHeading = (document.querySelector("h1")?.textContent || "This Case Study").trim();
        const pageCat = (document.querySelector(".project-header p, .project-detail-row p")?.textContent || "Case Study").trim();
        banner.innerHTML = `
          <span class="cs-banner-badge">Coming Soon</span>
          <span>We are actively curating and mastering the strategic assets for <strong>${pageHeading}</strong>. Full case study will be published soon.</span>
          <a href="../pages/case-studies/index.html">← Explore All Work</a>
        `;
        document.body.prepend(banner);
      }
    }
  }

  initCaseStudyComingSoon();

  // =========================================================================
  // BUTTERCUP PAGE LOADER BOOTSTRAP (Blogs, About Us, Services, Industry)
  // =========================================================================
  if (!window.__btrLoaderInitialized) {
    const scripts = document.querySelectorAll('script[src*="main.js"]');
    const mainSrc = scripts.length > 0 ? scripts[scripts.length - 1].getAttribute('src') : 'js/main.js';
    const loaderSrc = mainSrc.replace(/main\.js(\?.*)?$/, 'loader.js');
    const s = document.createElement('script');
    s.src = loaderSrc;
    s.async = false;
    document.body.appendChild(s);
  }

});

function locoplusscrolltrigger() {
  gsap.registerPlugin(ScrollTrigger);

  // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
  });
  // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
  locoScroll.on("scroll", ScrollTrigger.update);

  // tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector("#main").style.transform
      ? "transform"
      : "fixed",
  });

  // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll.
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

  // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
  ScrollTrigger.refresh();
}

locoplusscrolltrigger();

function gsapanimations() {
  const tl = gsap.timeline();

  tl.from("#sitelogo,#sitename,#navlinks>a,#navbuttons>div", {
    y: -100,
    duration: 0.5,
    opacity: 0,
    stagger: 0.1,
  });

  tl.from("#page1button,#page1overlay>h1", {
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2,
  });
  gsap.from("#page2images", {
    y: 100,
    duration: 0.5,
    stagger: 0.5,
    scrollTrigger: {
      trigger: "#page2images > .page2imageclass",
      scroller: "#main",
      start: "top 90%",
      end: "top 0%",
      scrub: 3,
      // markers: true,
    },
  });
  gsap.from("#page3images > .page3imageclass", {
    y: 100,
    opacity: 0,
    duration: 0.5,
    stagger: 0.5,
    scrollTrigger: {
      trigger: "#page3",
      scroller: "#main",
      start: "top 80%",
      end: "top 60%",
      scrub: 3,
      // markers: true,
    },
  });
}
gsapanimations();

function cursorBallAnimation() {
  const cursorball = document.querySelector("#cursorball");

  window.addEventListener("mousemove", function (event) {
    cursorball.style.left = `${event.clientX}px`;
    cursorball.style.top = `${event.clientY}px`;
    console.log(event);
  });
}

cursorBallAnimation();

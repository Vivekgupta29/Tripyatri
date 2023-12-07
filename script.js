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
    stagger: {
      each: 0.5,
      from: "end",
    },
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
  const page3images = document.querySelector("#page3images");
  const page3imageskaplace = page3images.getBoundingClientRect();
  console.log(page3imageskaplace.top);
  console.log(page3imageskaplace.left);

  window.addEventListener("mousemove", function (event) {
    cursorball.style.transform = `translate3d(
        calc(${event.clientX}px - 50%),
        calc(${event.clientY}px - 50%), 0px)`;
  });
}

cursorBallAnimation();

function imageHoverer() {
  const cursorball = document.querySelector("#cursorball");
  const page3images = document.querySelectorAll(".page3imageclass");

  page3images.forEach(function (image, index) {
    const img = image.querySelector("img");

    const tl = gsap.timeline({
      paused: true,
      onComplete: function () {
        cursorball.style.transform = "scale(2)";
      },
      onReverseComplete: function () {
        cursorball.style.transform = "scale(1)";
      },
    });

    tl.to(img, { scale: 1.2, duration: 0.3 })
      .to(
        page3images[index - 1]?.querySelector("img"),
        { scale: 0.6, duration: 0.3 },
        "<"
      )
      .to(
        page3images[index + 1]?.querySelector("img"),
        { scale: 0.6, duration: 0.3 },
        "<"
      );

    image.addEventListener("mouseenter", function () {
      tl.play();
    });

    image.addEventListener("mouseleave", function () {
      tl.reverse();
    });
  });
}

imageHoverer();

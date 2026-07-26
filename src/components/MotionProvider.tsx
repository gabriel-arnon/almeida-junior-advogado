"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function MotionProvider() {
  useGSAP(() => {
    const root = document.documentElement;
    const media = gsap.matchMedia();
    const revealElements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const groupElements = gsap.utils.toArray<HTMLElement>("[data-reveal-group]");
    const allAnimatedElements = [
      ...revealElements,
      ...groupElements.flatMap((group) =>
        gsap.utils.toArray<HTMLElement>("[data-reveal-item]", group)
      ),
      ...gsap.utils.toArray<HTMLElement>("[data-hero-item], [data-motion-portrait]")
    ];

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(allAnimatedElements, { clearProps: "all", autoAlpha: 1 });
      gsap.set("[data-process-progress]", { scaleX: 1 });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      root.classList.add("gsap-ready");

      const heroItems = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
      const portrait = document.querySelector<HTMLElement>("[data-motion-portrait]");

      const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTimeline
        .fromTo(
          heroItems,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09, clearProps: "transform" }
        )
        .fromTo(
          portrait,
          { autoAlpha: 0, x: 36, rotate: 1.5 },
          { autoAlpha: 1, x: 0, rotate: 0, duration: 0.9, clearProps: "transform" },
          0.18
        );

      gsap.set(revealElements, { autoAlpha: 0, y: 24 });
      ScrollTrigger.batch(revealElements, {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: true,
            clearProps: "transform"
          })
      });

      groupElements.forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal-item]", group);
        gsap.set(items, { autoAlpha: 0, y: 22 });

        gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: group,
            start: "top 86%",
            once: true
          }
        });
      });

      const processProgress = document.querySelector<HTMLElement>("[data-process-progress]");
      const processSection = document.querySelector<HTMLElement>("[data-process-section]");

      if (processProgress && processSection) {
        gsap.fromTo(
          processProgress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: processSection,
              start: "top 80%",
              end: "bottom 55%",
              scrub: 0.6
            }
          }
        );
      }
    });

    media.add(
      "(prefers-reduced-motion: no-preference) and (min-width: 768px)",
      () => {
        const hero = document.querySelector<HTMLElement>("[data-motion-hero]");
        const portraitImage = document.querySelector<HTMLElement>(
          "[data-motion-portrait-image]"
        );

        if (!hero || !portraitImage) {
          return;
        }

        gsap.to(portraitImage, {
          yPercent: 5,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.8
          }
        });
      }
    );

    return () => {
      media.revert();
      root.classList.remove("gsap-ready");
    };
  }, []);

  return null;
}

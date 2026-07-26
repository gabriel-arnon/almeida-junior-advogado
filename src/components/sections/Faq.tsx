"use client";

import { useState } from "react";
import { faqItems } from "@/content/faq";

export function Faq() {
  const [openQuestions, setOpenQuestions] = useState<Set<number>>(new Set());

  function toggleQuestion(index: number) {
    setOpenQuestions((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section className="section-y bg-white">
      <div id="faq" className="section-shell max-w-4xl">
        <p className="section-kicker text-gold" data-reveal>
          Perguntas frequentes
        </p>
        <h2 className="mt-3 text-4xl font-semibold leading-tight text-navy md:text-5xl" data-reveal>
          Respostas objetivas para o primeiro contato
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl border border-light-gray bg-white shadow-[0_18px_50px_rgba(1,39,61,0.06)]">
          {faqItems.map((item, index) => {
            const isOpen = openQuestions.has(index);
            const answerId = `faq-answer-${index}`;

            return (
              <div key={item.question} className="border-b border-light-gray last:border-b-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleQuestion(index)}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 px-5 py-5 text-left text-lg font-semibold text-navy transition duration-300 hover:bg-light-gray/25 focus-visible:bg-light-gray/35 md:px-6"
                >
                  <span>{item.question}</span>
                  <span
                    data-state={isOpen ? "open" : "closed"}
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/45 text-gold transition duration-300 ${
                      isOpen ? "rotate-180 bg-gold/10" : ""
                    }`}
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 20 20" className="h-5 w-5">
                      <path
                        d="m5 7.5 5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                </button>
                <div
                  id={answerId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 pt-1 text-base leading-7 text-graphite-soft md:px-6">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

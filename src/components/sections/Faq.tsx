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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
          Perguntas frequentes
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
          Respostas objetivas para o primeiro contato
        </h2>
        <div className="mt-8 divide-y divide-light-gray border-y border-light-gray">
          {faqItems.map((item, index) => {
            const isOpen = openQuestions.has(index);
            const answerId = `faq-answer-${index}`;

            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggleQuestion(index)}
                  className="flex min-h-16 w-full cursor-pointer items-center justify-between gap-4 rounded-sm px-3 py-5 text-left text-lg font-semibold text-navy transition hover:bg-light-gray/25 focus-visible:bg-light-gray/35"
                >
                  <span>{item.question}</span>
                  <span
                    data-state={isOpen ? "open" : "closed"}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/45 text-gold transition duration-150 ${
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
                    <p className="pb-5 pt-1 text-base leading-7 text-graphite-soft">
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

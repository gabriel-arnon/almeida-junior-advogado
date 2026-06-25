"use client";

import { useState } from "react";
import { VisualContactForm } from "@/components/VisualContactForm";
import { commonSituationCards } from "@/content/services";

const initiallyVisibleMobileCards = 6;
const primaryMobileSituationCards = commonSituationCards.slice(0, initiallyVisibleMobileCards);
const additionalMobileSituationCards = commonSituationCards.slice(initiallyVisibleMobileCards);

function SituationIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" aria-hidden="true">
      <path
        d="M5 7.5h14M7 7.5V19m10-11.5V19M4.5 19h15M8 11h2m4 0h2m-8 4h2m4 0h2M12 4l7 3.5H5L12 4Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SituationCard({ item, isFocusable = true }: { item: string; isFocusable?: boolean }) {
  return (
    <li
      tabIndex={isFocusable ? 0 : -1}
      data-situation-card
      className="flex gap-2.5 border border-light-gray bg-white p-3 text-sm font-semibold leading-5 text-graphite transition duration-150 hover:border-gold/70 hover:bg-gold/5 hover:shadow-[0_8px_22px_rgba(1,39,61,0.06)] focus-visible:border-gold focus-visible:bg-gold/5 sm:min-h-20 sm:gap-3 sm:p-3.5 sm:leading-6"
    >
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold/10">
        <SituationIcon />
      </span>
      <span>{item}</span>
    </li>
  );
}

export function CommonSituations() {
  const [showAllMobileCards, setShowAllMobileCards] = useState(false);

  return (
    <section className="section-y bg-white">
      <div className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(25rem,0.78fr)] lg:items-start xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div>
          <div id="situacoes" className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">
              Situações comuns
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-navy md:text-4xl">
              Conflitos bancários que exigem análise individual
            </h2>
          </div>
          <div className="mt-7 sm:hidden">
            <ul className="grid items-stretch gap-2.5" data-situation-list="mobile-primary">
              {primaryMobileSituationCards.map((item) => (
                <SituationCard key={item} item={item} />
              ))}
            </ul>
            <div
              id="outras-situacoes"
              aria-hidden={!showAllMobileCards}
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ${
                showAllMobileCards ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="min-h-0 overflow-hidden">
                <ul className="mt-2.5 grid items-stretch gap-2.5" data-situation-list="mobile-additional">
                  {additionalMobileSituationCards.map((item) => (
                    <SituationCard
                      key={item}
                      item={item}
                      isFocusable={showAllMobileCards}
                    />
                  ))}
                </ul>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-gold px-4 text-sm font-semibold text-navy transition duration-150 hover:bg-gold/10 focus-visible:bg-navy focus-visible:text-white"
              aria-expanded={showAllMobileCards}
              aria-controls="outras-situacoes"
              onClick={() => setShowAllMobileCards((current) => !current)}
            >
              {showAllMobileCards ? "Ocultar outras situações" : "Ver outras situações"}
            </button>
          </div>
          <ul
            className="mt-8 hidden items-stretch gap-3 sm:grid sm:grid-cols-2 lg:gap-4"
            data-situation-list="desktop"
          >
            {commonSituationCards.map((item) => (
              <SituationCard key={item} item={item} />
            ))}
          </ul>
        </div>
        <div className="lg:sticky lg:top-[9.5rem]">
          <span id="formulario-contato" className="anchor-marker" aria-hidden="true" />
          <VisualContactForm />
        </div>
      </div>
    </section>
  );
}

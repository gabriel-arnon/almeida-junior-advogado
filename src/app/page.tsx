import { CommonSituations } from "@/components/sections/CommonSituations";
import { DocumentsSteps } from "@/components/sections/DocumentsSteps";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { RegionsOffices } from "@/components/sections/RegionsOffices";
import { ServiceProcess } from "@/components/sections/ServiceProcess";
import { faqStructuredData, legalServiceStructuredData } from "@/lib/structured-data";

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceStructuredData()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData()) }}
      />
      <Hero />
      <CommonSituations />
      <ServiceProcess />
      <DocumentsSteps />
      <RegionsOffices />
      <Faq />
      <FinalCta />
    </main>
  );
}

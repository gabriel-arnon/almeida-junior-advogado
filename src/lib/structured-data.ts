import { faqItems } from "@/content/faq";
import { offices } from "@/content/offices";
import { siteConfig } from "@/content/site";
import { absoluteUrl } from "@/lib/utils";

export function legalServiceStructuredData() {
  const url = absoluteUrl("/");

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: siteConfig.name,
    ...(url ? { url } : {}),
    email: siteConfig.email,
    telephone: siteConfig.phoneDisplay,
    areaServed: [
      "Santos",
      "Bertioga",
      "Baixada Santista",
      "Litoral Sul",
      "Grande São Paulo"
    ],
    address: offices.map((office) => ({
      "@type": "PostalAddress",
      streetAddress: office.lines.slice(0, -1).join(", "),
      addressLocality: office.city,
      addressRegion: "SP",
      addressCountry: "BR"
    }))
  };
}

export function faqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function breadcrumbStructuredData(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path)
    }))
  };
}

import { DICT, type Locale } from "@/lib/i18n";
import { BUSINESS, CONTACT_EMAIL, SITE_URL } from "@/lib/site";

/**
 * Données structurées schema.org.
 *
 * Pour une entreprise dont le positionnement repose sur la proximité, c'est
 * ce qui permet à un moteur de comprendre où elle se trouve et ce qu'elle
 * fait — donc de la proposer à quelqu'un qui cherche « site web Châteauguay ».
 *
 * Rien n'est déclaré ici qui ne soit vrai ailleurs sur la page : pas de note
 * moyenne, pas d'avis, pas d'horaires inventés. Une donnée structurée fausse
 * est une donnée qu'un moteur peut sanctionner.
 */
export function LocalBusinessJsonLd({ locale }: { locale: Locale }) {
  const d = DICT[locale];

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: BUSINESS.name,
    description: d.meta.description,
    url: `${SITE_URL}/${locale}`,
    email: CONTACT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: BUSINESS.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    availableLanguage: BUSINESS.languages,
    knowsLanguage: BUSINESS.languages,
    serviceType: d.services.items.map((item) => item.titre),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: d.prix.titre,
      itemListElement: d.prix.forfaits.map((f) => ({
        "@type": "Offer",
        name: f.nom,
        description: f.detail,
        priceCurrency: "CAD",
        // Le montant reste tel qu'affiché sur la page : un prix structuré qui
        // diverge du prix visible est une incohérence, pas une optimisation.
        price: f.prix.replace(/[^\d]/g, "") || undefined,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Contenu statique issu du dictionnaire, jamais d'une saisie externe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

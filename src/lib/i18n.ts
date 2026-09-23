export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Le français est la langue de référence, pas une traduction parmi d'autres.
 * Au Québec, les communications commerciales sont encadrées par la Charte de
 * la langue française : le site est conçu en français, puis traduit. L'anglais
 * existe parce que le Grand Montréal le parle, pas par symétrie.
 */
export const DICT = {
  fr: {
    meta: {
      title: "Studio Sentis — sites web, applications et identité visuelle à Châteauguay",
      description:
        "Le prix et la date dès le premier échange. Un seul interlocuteur, du logo à l'application. Châteauguay, Montérégie et Grand Montréal.",
    },
    nav: {
      offre: "Ce que je fais",
      prix: "Prix",
      methode: "Comment ça se passe",
      contact: "Parler du projet",
      langue: "English",
      autre: "en",
    },
    hero: {
      lieu: "Châteauguay · Montérégie · Grand Montréal",
      titre: "Le prix et la date, dès le premier échange.",
      chapo:
        "Un site, une application ou une identité visuelle, menés par une seule personne — celle à qui vous parlez. Vous savez ce que ça coûte et quand c'est livré avant de vous engager.",
      cta: "Parler de votre projet",
      ctaSecondaire: "Voir les prix",
    },
    probleme: {
      titre: "Trois raisons de repousser un projet web",
      intro:
        "Ce sont celles qu'on entend le plus souvent, et elles sont légitimes.",
      items: [
        {
          titre: "« Je ne sais pas combien ça va coûter »",
          corps:
            "Le secteur répond « devis sur demande ». Vous devez appeler, expliquer, attendre, et recommencer ailleurs pour comparer.",
        },
        {
          titre: "« Je ne sais pas à qui je parle »",
          corps:
            "Un commercial vend, un chef de projet transmet, quelqu'un d'autre exécute. Votre demande se perd entre les trois.",
        },
        {
          titre: "« Je ne sais pas quand ce sera fini »",
          corps:
            "Le délai est vague au départ, puis il glisse. Vous n'avez aucun moyen de planifier autour.",
        },
      ],
    },
    reponse: {
      titre: "Ce que je change",
      items: [
        {
          titre: "Le prix est affiché",
          corps:
            "Les forfaits sont sur cette page, montants en dollars canadiens. Pas de « devis sur demande » pour un site vitrine.",
        },
        {
          titre: "Vous parlez à la personne qui travaille",
          corps:
            "Du premier message à la livraison. Pas d'intermédiaire, pas de transmission, pas de version déformée de votre demande.",
        },
        {
          titre: "La date est au devis",
          corps:
            "Un délai daté, pas une fourchette. Il est tenable parce que je travaille sur une base que j'ai construite et que je réutilise.",
        },
      ],
    },
    services: {
      titre: "Ce que je fais",
      items: [
        {
          titre: "Sites web",
          corps:
            "Du site une page au site vitrine complet : présenter votre activité, être trouvé, être joint. Bilingue français-anglais.",
        },
        {
          titre: "Applications web et mobile",
          corps:
            "Un outil sur mesure quand un logiciel existant ne correspond pas à votre façon de travailler.",
        },
        {
          titre: "Identité visuelle",
          corps:
            "Logo, couleurs, typographie et déclinaisons : carte d'affaires, enseigne, réseaux sociaux.",
        },
      ],
      autres:
        "Aussi : dépannage informatique, maintenance et accompagnement marketing. Demandez.",
    },
    prix: {
      titre: "Prix",
      intro:
        "Montants en dollars canadiens, taxes en sus. Un forfait couvre le travail annoncé : si le projet change en cours de route, on en reparle avant, pas sur la facture.",
      forfaits: [
        { nom: "Présence essentielle", detail: "Site une page, bilingue, mobile, fiche Google", prix: "1 800 $", delai: "10 jours ouvrables" },
        { nom: "Vitrine complète", detail: "5 pages, bilingue, vous modifiez le contenu vous-même", prix: "3 900 $", delai: "3 semaines" },
        { nom: "Identité visuelle", detail: "Logo, palette, typographie, déclinaisons, guide d'usage", prix: "2 400 $", delai: "2 semaines" },
        { nom: "Identité + vitrine", detail: "Les deux menés d'un seul tenant", prix: "5 700 $", delai: "4 semaines" },
        { nom: "Cadrage d'application", detail: "Périmètre écrit, maquette cliquable, devis ferme — déduit si le projet se fait", prix: "1 200 $", delai: "1 semaine" },
        { nom: "Suivi mensuel", detail: "Hébergement, mises à jour, sauvegardes, petites modifications", prix: "85 $ / mois", delai: "sans engagement" },
      ],
      note: "Une application sur mesure ne reçoit pas de forfait : personne ne peut chiffrer honnêtement ce qui n'est pas encore défini. Le cadrage, lui, a un prix fixe — et vous repartez avec un document utilisable même si vous ne poursuivez pas avec moi.",
    },
    versus: {
      titre: "Et pourquoi pas un outil en ligne ?",
      intro:
        "C'est une vraie question, et pour certains projets la réponse est : allez-y. Voici ce qui change quand vous passez par quelqu'un.",
      items: [
        { titre: "Le site vous appartient", corps: "Le code et le nom de domaine sont à vous. Vous n'êtes locataire d'aucune plateforme." },
        { titre: "Le coût n'augmente pas tout seul", corps: "Un abonnement grimpe avec le temps et les options. Votre site, non." },
        { titre: "Les obligations linguistiques sont respectées", corps: "Au Québec, un site commercial doit être en français. C'est intégré dès la conception, pas rajouté après coup." },
        { titre: "Vous avez quelqu'un à appeler", corps: "Dans votre région, qui connaît votre projet, et qui répond." },
      ],
    },
    methode: {
      titre: "Comment ça se passe",
      etapes: [
        { n: "01", titre: "On se parle", corps: "30 minutes, sur place ou en visio. Vous décrivez votre activité et ce dont vous avez besoin. Aucun engagement." },
        { n: "02", titre: "Vous recevez un prix et une date", corps: "Par écrit, sous 48 heures. Le montant est ferme, la date aussi." },
        { n: "03", titre: "Je construis, vous voyez avancer", corps: "Un lien de suivi dès le premier jour. Vous commentez au fur et à mesure, pas à la fin." },
        { n: "04", titre: "Je livre, et vous prenez la main", corps: "Le site est à vous. Une heure de prise en main pour que vous puissiez le modifier seul." },
      ],
    },
    preuve: {
      titre: "Ce que je peux montrer aujourd'hui",
      corps:
        "Studio Sentis démarre : je n'ai pas encore de projets clients à présenter, et je préfère l'écrire plutôt que d'afficher des logos empruntés ou des témoignages inventés. Ce que je peux montrer, c'est la base technique sur laquelle je construis — un système de design complet, sa bibliothèque de composants et d'animations, vérifié automatiquement sur neuf largeurs d'écran et sur les contrastes avant chaque livraison.",
      lien: "Voir NEXUS UI, la base",
    },
    contact: {
      titre: "Parlons de votre projet",
      corps:
        "Décrivez en deux lignes ce que vous voulez faire. Je réponds sous 48 heures avec un prix et une date, ou avec les questions qui me manquent pour les donner.",
      courriel: "Écrire un courriel",
      note: "Châteauguay, Québec · Français et anglais",
    },
    pied: {
      droits: "Studio Sentis — Châteauguay, Québec",
      mention: "Site construit sur NEXUS UI.",
    },
  },

  en: {
    meta: {
      title: "Studio Sentis — websites, apps and visual identity in Châteauguay",
      description:
        "A price and a date from the first conversation. One person, from logo to application. Châteauguay, Montérégie and Greater Montreal.",
    },
    nav: {
      offre: "What I do",
      prix: "Pricing",
      methode: "How it works",
      contact: "Discuss your project",
      langue: "Français",
      autre: "fr",
    },
    hero: {
      lieu: "Châteauguay · Montérégie · Greater Montreal",
      titre: "A price and a date, from the first conversation.",
      chapo:
        "A website, an application or a visual identity, handled by one person — the one you talk to. You know the cost and the delivery date before you commit.",
      cta: "Discuss your project",
      ctaSecondaire: "See pricing",
    },
    probleme: {
      titre: "Three reasons projects get postponed",
      intro: "These are the ones we hear most, and they are fair.",
      items: [
        { titre: "“I don't know what it will cost”", corps: "The industry answers “quote on request”. You have to call, explain, wait, then start over elsewhere to compare." },
        { titre: "“I don't know who I'm talking to”", corps: "A salesperson sells, a project manager relays, someone else builds. Your request gets lost between the three." },
        { titre: "“I don't know when it will be done”", corps: "The timeline starts vague, then slips. You have no way to plan around it." },
      ],
    },
    reponse: {
      titre: "What I change",
      items: [
        { titre: "The price is published", corps: "Packages are on this page, in Canadian dollars. No “quote on request” for a brochure site." },
        { titre: "You talk to the person doing the work", corps: "From first message to delivery. No middle layer, no relay, no distorted version of your request." },
        { titre: "The date is in the quote", corps: "A dated deadline, not a range. It holds because I work from a base I built and reuse." },
      ],
    },
    services: {
      titre: "What I do",
      items: [
        { titre: "Websites", corps: "From a one-page site to a full brochure site: present your business, get found, get reached. Bilingual French and English." },
        { titre: "Web and mobile applications", corps: "A custom tool for when existing software doesn't match how you actually work." },
        { titre: "Visual identity", corps: "Logo, colours, typography and applications: business card, signage, social media." },
      ],
      autres: "Also: IT support, maintenance and marketing help. Just ask.",
    },
    prix: {
      titre: "Pricing",
      intro:
        "Canadian dollars, taxes extra. A package covers the stated work: if the project changes along the way, we talk about it first, not on the invoice.",
      forfaits: [
        { nom: "Essential presence", detail: "One-page site, bilingual, mobile, Google Business listing", prix: "$1,800", delai: "10 business days" },
        { nom: "Full brochure site", detail: "5 pages, bilingual, you edit the content yourself", prix: "$3,900", delai: "3 weeks" },
        { nom: "Visual identity", detail: "Logo, palette, typography, applications, usage guide", prix: "$2,400", delai: "2 weeks" },
        { nom: "Identity + site", detail: "Both, run as one project", prix: "$5,700", delai: "4 weeks" },
        { nom: "Application scoping", detail: "Written scope, clickable mockup, firm quote — deducted if the project goes ahead", prix: "$1,200", delai: "1 week" },
        { nom: "Monthly care", detail: "Hosting, updates, backups, small changes", prix: "$85 / month", delai: "no commitment" },
      ],
      note: "A custom application gets no fixed package: nobody can honestly price what isn't defined yet. The scoping does have a fixed price — and you leave with a document you can use even if you don't continue with me.",
    },
    versus: {
      titre: "So why not an online builder?",
      intro: "It's a fair question, and for some projects the answer is: go ahead. Here's what changes when you work with someone.",
      items: [
        { titre: "The site is yours", corps: "The code and the domain name belong to you. You're not renting from a platform." },
        { titre: "The cost doesn't climb on its own", corps: "A subscription grows with time and add-ons. Your site doesn't." },
        { titre: "Language requirements are met", corps: "In Quebec a commercial site must be available in French. That's built in from the start, not bolted on later." },
        { titre: "You have someone to call", corps: "In your region, who knows your project, and who answers." },
      ],
    },
    methode: {
      titre: "How it works",
      etapes: [
        { n: "01", titre: "We talk", corps: "30 minutes, in person or by video. You describe your business and what you need. No commitment." },
        { n: "02", titre: "You get a price and a date", corps: "In writing, within 48 hours. The amount is firm, and so is the date." },
        { n: "03", titre: "I build, you watch it happen", corps: "A preview link from day one. You comment as it goes, not at the end." },
        { n: "04", titre: "I hand it over", corps: "The site is yours. One hour of training so you can edit it on your own." },
      ],
    },
    preuve: {
      titre: "What I can show today",
      corps:
        "Studio Sentis is starting out: I have no client projects to show yet, and I'd rather write that than display borrowed logos or invented testimonials. What I can show is the technical base I build on — a complete design system with its component and animation libraries, checked automatically across nine screen widths and for colour contrast before every delivery.",
      lien: "See NEXUS UI, the base",
    },
    contact: {
      titre: "Let's talk about your project",
      corps:
        "Describe in two lines what you want to build. I reply within 48 hours with a price and a date, or with the questions I need answered to give them.",
      courriel: "Send an email",
      note: "Châteauguay, Quebec · French and English",
    },
    pied: {
      droits: "Studio Sentis — Châteauguay, Quebec",
      mention: "Built on NEXUS UI.",
    },
  },
} as const;

export type Dict = (typeof DICT)[Locale];

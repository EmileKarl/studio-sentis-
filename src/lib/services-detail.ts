import type { Locale } from "@/lib/i18n";

/**
 * Les quatre pages de service, une par métier.
 *
 * **Pourquoi elles existent.** La page `/services` présente les quatre métiers
 * ensemble, et c'est bien pour quelqu'un qui arrive sur le site sans savoir ce
 * qu'il veut. Mais un moteur de recherche classe des **pages**, pas des sites :
 * une page qui parle un peu de logo, un peu de charte, un peu de site et un
 * peu d'application n'est la meilleure réponse à aucune des quatre
 * recherches. Il fallait une page dont le sujet soit la création de logo, une
 * autre dont le sujet soit la charte graphique, et ainsi de suite.
 *
 * **Les adresses diffèrent d'une langue à l'autre** — `/fr/services/creation-de-logo`
 * et `/en/services/logo-design` — contrairement au reste du site, où les deux
 * langues partagent leurs segments. C'est voulu : ces pages-ci n'existent que
 * pour être trouvées, et une personne qui cherche en anglais tape
 * « logo design ». Le `hreflang` croisé est construit à partir de `slug`.
 *
 * **Les prix et les délais sont recopiés de `i18n.ts`**, où vit la grille
 * officielle. Ils sont répétés ici pour que la page se lise seule ; s'ils
 * divergeaient, c'est la grille qui a raison. `npm run verify:seo` ne couvre
 * pas cette cohérence — à vérifier à l'œil quand un prix change.
 */

export const CLES_SERVICE = ["logo", "charte", "site", "application"] as const;
export type CleService = (typeof CLES_SERVICE)[number];

export type Question = { q: string; r: string };

export type ServiceDetail = {
  cle: CleService;
  /** Le segment d'URL, par langue. */
  slug: Record<Locale, string>;
  titre: string;
  description: string;
  h1: string;
  chapo: string;
  /** Repris de la grille de prix. */
  prix: string;
  montant: number;
  delai: string;
  /** Le libellé du forfait correspondant, tel qu'il figure sur la page Prix. */
  forfait: string;
  inclusTitre: string;
  inclus: string[];
  etapesTitre: string;
  etapes: { titre: string; corps: string }[];
  corps: { titre: string; texte: string }[];
  limiteTitre: string;
  limite: string;
  faqTitre: string;
  faq: Question[];
  /** Les trois autres métiers, en texte de lien. */
  voisinsTitre: string;
  /** Le titre du dernier bloc. Il reprenait le `h1`, ce qui ne disait rien de
      plus au lecteur arrivé en bas de page : il sait déjà sur quelle page il
      est. Une phrase qui engage vaut mieux qu'un rappel. */
  ctaTitre: string;
  cta: string;
};

const FR: Record<CleService, ServiceDetail> = {
  logo: {
    cle: "logo",
    slug: { fr: "creation-de-logo", en: "logo-design" },
    titre: "Création de logo à Châteauguay — prix et délai affichés",
    description:
      "Création de logo pour entreprise à Châteauguay et en Montérégie. 2 200 $, livré en 9 jours ouvrables, fichiers sources et droits cédés. Le prix et la date dès le premier échange.",
    h1: "Création de logo",
    chapo:
      "Un logo dessiné pour votre commerce, pas choisi dans un catalogue. Le prix et la date sont écrits plus bas : vous savez ce que ça coûte avant de m'écrire.",
    prix: "2 200 $",
    montant: 2200,
    delai: "9 jours ouvrables",
    forfait: "Identité visuelle",
    inclusTitre: "Ce que vous recevez",
    inclus: [
      "Trois pistes de départ, puis une seule menée à terme",
      "Le logo horizontal, empilé et le symbole seul",
      "Les versions couleur, noir et blanc",
      "Les fichiers vectoriels (SVG, PDF) et les images (PNG)",
      "L'icône de site et la photo de profil, aux bonnes tailles",
      "Un guide d'usage : zone de protection, tailles minimales, interdits",
      "La cession des droits, par écrit",
    ],
    etapesTitre: "Comment ça se passe",
    etapes: [
      {
        titre: "On parle",
        corps:
          "Trente minutes, en personne à Châteauguay ou en visio. Ce que vous vendez, à qui, et ce que vous ne voulez surtout pas.",
      },
      {
        titre: "Trois pistes",
        corps:
          "Trois directions différentes, pas trois variantes de la même. Vous en choisissez une.",
      },
      {
        titre: "Une seule, menée à terme",
        corps:
          "La piste retenue est dessinée, ajustée avec vous, puis déclinée dans tous ses formats.",
      },
      {
        titre: "Livraison",
        corps:
          "Tous les fichiers, le guide d'usage, et les droits cédés par écrit. Vous n'avez plus besoin de moi pour vous en servir.",
      },
    ],
    corps: [
      {
        titre: "Pourquoi trois pistes et pas douze",
        texte:
          "Douze propositions, c'est une façon de vous faire trancher à ma place. Trois directions franchement différentes vous font un vrai choix, et le temps économisé passe dans le dessin de celle que vous gardez. C'est aussi pour cette raison que le prix tient : il paie du dessin, pas de la production en série.",
      },
      {
        titre: "Un logo doit tenir à seize pixels",
        texte:
          "Un logo se juge sur l'enseigne et dans l'onglet du navigateur. Un trait trop fin disparaît à petite taille, une couleur trop pâle devient invisible sur fond blanc. Chaque logo livré est contrôlé aux deux extrêmes, et le contraste est mesuré, pas estimé.",
      },
      {
        titre: "Les droits sont à vous, écrits noir sur blanc",
        texte:
          "À la livraison, vous recevez une cession de droits signée. Vous pouvez l'imprimer, le broder, le peindre sur un camion, le modifier, le revendre avec l'entreprise. Ce n'est pas le cas des plateformes de logos en ligne, où vous achetez souvent une licence d'usage sur un dessin vendu ailleurs.",
      },
      {
        titre: "Et si vous avez déjà un logo",
        texte:
          "Une refonte coûte le même prix qu'une création : le travail est le même, et il faut en plus comprendre ce qui doit être gardé. Si votre logo actuel tient la route, je vous le dirai — c'est moins cher pour vous et plus honnête pour moi.",
      },
    ],
    limiteTitre: "Ce que ce forfait ne couvre pas",
    limite:
      "La recherche d'antériorité et le dépôt de marque de commerce. Ce sont des démarches juridiques, elles se font auprès de l'Office de la propriété intellectuelle du Canada ou d'un agent de marques. Je vous dis à quoi faire attention ; je ne suis pas qualifié pour les faire à votre place.",
    faqTitre: "Les questions qu'on me pose",
    faq: [
      {
        q: "Combien coûte un logo professionnel au Québec ?",
        r: "Chez moi, 2 200 $ pour une identité visuelle complète, prix affiché et fixe. Ailleurs, la fourchette va d'une cinquantaine de dollars sur une plateforme en ligne à plusieurs milliers chez une agence. L'écart ne porte pas sur le dessin mais sur ce qu'on vous livre : les droits, les fichiers sources, les déclinaisons et le guide d'usage.",
      },
      {
        q: "Combien de temps pour créer un logo ?",
        r: "Neuf jours ouvrables à partir du moment où on s'est parlé et où l'acompte est reçu. La date de livraison est écrite dans la soumission, et c'est elle qui engage.",
      },
      {
        q: "Quelle différence entre un logo et une identité visuelle ?",
        r: "Le logo est un dessin. L'identité visuelle est tout ce qui va avec : les couleurs, la typographie, la façon de les assembler. Un logo seul sans règles d'usage se déforme en six mois, parce que chaque personne qui s'en sert l'arrange à sa manière.",
      },
      {
        q: "Quels fichiers vais-je recevoir ?",
        r: "Du vectoriel (SVG et PDF) pour l'impression et le grand format, et des images (PNG à fond transparent) pour l'écran. Plus l'icône de site et la photo de profil déjà aux bonnes dimensions. C'est le vectoriel qu'attend un imprimeur ou un enseigniste.",
      },
      {
        q: "Est-ce que je peux utiliser un logo fait par une intelligence artificielle ?",
        r: "Techniquement oui. Deux problèmes : au Canada, une œuvre produite sans intervention humaine substantielle a un statut de droit d'auteur incertain, ce qui complique un dépôt de marque ; et le même outil sort des dessins très proches à votre concurrent. Pour un logo qui doit durer, c'est un risque mal placé.",
      },
      {
        q: "Travaillez-vous ailleurs qu'à Châteauguay ?",
        r: "Oui. Châteauguay, Mercier, Léry, Beauharnois et la Montérégie en personne ; le Grand Montréal et le reste du Québec à distance. Le travail est le même, seule la rencontre de départ change de forme.",
      },
    ],
    voisinsTitre: "La suite logique",
    ctaTitre: "Votre logo, 2 200 $, livré en neuf jours.",
    cta: "Demander une soumission",
  },

  charte: {
    cle: "charte",
    slug: { fr: "charte-graphique", en: "brand-guidelines" },
    titre: "Charte graphique et identité visuelle — Châteauguay, Montérégie",
    description:
      "Charte graphique pour PME : couleurs, typographie, règles d'usage et déclinaisons. 2 200 $ avec le logo, livré en 9 jours ouvrables. Châteauguay et Montérégie.",
    h1: "Charte graphique et identité visuelle",
    chapo:
      "Les règles qui font qu'une affiche, une facture et une publication se reconnaissent comme la même entreprise. C'est ce qui manque le plus souvent quand une marque « fait amateur » sans qu'on sache dire pourquoi.",
    prix: "2 200 $",
    montant: 2200,
    delai: "9 jours ouvrables",
    forfait: "Identité visuelle",
    inclusTitre: "Ce que contient la charte",
    inclus: [
      "Le logo et ses verrouillages, avec leurs zones de protection",
      "La palette : chaque couleur en HEX, RVB, TSL et CMJN",
      "Les contrastes mesurés, pour que les textes restent lisibles",
      "La typographie : la famille, les graisses, les tailles",
      "Les règles de mise en page : marges, rayons, ombres",
      "Ce qu'on ne fait pas : les déformations et les recolorations interdites",
      "Les gabarits : carte d'affaires, en-tête de lettre, signature de courriel",
      "Les formats de réseaux sociaux, déjà aux bonnes dimensions",
    ],
    etapesTitre: "Comment ça se passe",
    etapes: [
      { titre: "Le logo d'abord", corps: "La charte se construit autour de lui. Si vous en avez déjà un, on part de là." },
      { titre: "Les couleurs", corps: "Choisies pour fonctionner ensemble, et vérifiées au contraste : une couleur illisible n'est pas une couleur de marque." },
      { titre: "La typographie et les règles", corps: "Une famille, quelques graisses, et les tailles qui vont avec. Moins il y a de règles, plus elles sont suivies." },
      { titre: "Le document", corps: "Une charte en PDF que vous envoyez à un imprimeur ou à toute personne qui travaille pour vous." },
    ],
    corps: [
      {
        titre: "À quoi ça sert, concrètement",
        texte:
          "Le jour où vous demandez une affiche à quelqu'un, vous lui envoyez un fichier au lieu d'expliquer au téléphone. Le jour où vous changez de graphiste, il reprend sans tout redessiner. Et entre les deux, vos clients vous reconnaissent sans lire votre nom — c'est tout ce qu'on demande à une marque.",
      },
      {
        titre: "Les couleurs sont vérifiées, pas choisies à l'œil",
        texte:
          "Chaque couple texte sur fond est mesuré au contraste. Une couleur qui descend sous le plancher de lisibilité est écartée ou assombrie jusqu'à ce qu'elle passe. Ce n'est pas une coquetterie : c'est ce qui fait qu'un texte reste lisible au soleil, sur un téléphone, ou pour quelqu'un qui distingue mal les couleurs.",
      },
      {
        titre: "Une charte courte vaut mieux qu'un manuel",
        texte:
          "Une charte de quarante pages ne se lit pas, donc elle ne s'applique pas. Celle que je livre tient en une quinzaine de pages : ce qu'il faut pour décider, rien pour impressionner.",
      },
    ],
    limiteTitre: "Ce que ce forfait ne couvre pas",
    limite:
      "La production des supports eux-mêmes — l'impression des cartes, la pose de l'enseigne, la gestion de vos réseaux sociaux. La charte donne les gabarits et les règles ; l'imprimeur et l'enseigniste font le reste, et ils travaillent mieux avec elle en main.",
    faqTitre: "Les questions qu'on me pose",
    faq: [
      {
        q: "Quelle différence entre une charte graphique et une identité visuelle ?",
        r: "L'identité visuelle, c'est l'ensemble de ce qui se voit : le logo, les couleurs, la typographie. La charte graphique est le document qui dit comment s'en servir. On livre les deux ensemble — l'un sans l'autre ne sert à rien.",
      },
      {
        q: "Que contient une charte graphique ?",
        r: "Au minimum : le logo et ses variantes, les zones de protection, les tailles minimales, la palette avec ses valeurs exactes, la typographie, et la liste de ce qu'on ne fait pas. La mienne ajoute les gabarits de papeterie et les formats de réseaux sociaux, parce que c'est ce qui sert toutes les semaines.",
      },
      {
        q: "Est-ce qu'une charte graphique est utile pour une petite entreprise ?",
        r: "Surtout pour une petite entreprise. Une grande a une équipe marketing qui tient la cohérence. Un commerce de quatre personnes où chacun fait une affiche quand il en a besoin n'a que ça pour éviter que la marque parte dans six directions.",
      },
      {
        q: "Combien coûte une charte graphique ?",
        r: "2 200 $, avec le logo, livrée en 9 jours ouvrables. Si votre logo existe déjà et qu'il tient la route, on part de lui, et le prix est le même : le travail se déplace du dessin vers les règles et les déclinaisons.",
      },
      {
        q: "Et les valeurs CMJN pour l'imprimeur ?",
        r: "Elles sont dans la charte, avec un avertissement : ce sont des conversions arithmétiques, à valider sur épreuve. Une couleur vive se déplace en quadrichromie, et un numéro Pantone inventé par quelqu'un qui n'a pas d'épreuve sous les yeux devient la marque à la place de la vraie couleur.",
      },
    ],
    voisinsTitre: "La suite logique",
    ctaTitre: "Une marque qui se tient, de la carte d'affaires à l'enseigne.",
    cta: "Demander une soumission",
  },

  site: {
    cle: "site",
    slug: { fr: "creation-de-site-web", en: "web-design" },
    titre: "Création de site web à Châteauguay — prix affichés, 18 jours",
    description:
      "Création de site web pour PME à Châteauguay et en Montérégie. Site une page 2 200 $, site vitrine 5 pages 4 200 $. Bilingue, le code et le domaine vous appartiennent.",
    h1: "Création de site web",
    chapo:
      "Un site qui vous appartient, qui s'affiche vite sur un téléphone, et dont vous modifiez le contenu vous-même. Le prix et la date sont affichés : vous n'avez pas à appeler pour les connaître.",
    prix: "2 200 $ – 4 200 $",
    montant: 4200,
    delai: "10 à 18 jours ouvrables",
    forfait: "Site une page / Site vitrine, 5 pages",
    inclusTitre: "Ce qui est compris",
    inclus: [
      "Les deux versions, française et anglaise, conçues ensemble",
      "Un site qui s'adapte au téléphone, à la tablette et à l'ordinateur",
      "Le contenu que vous modifiez vous-même",
      "Un formulaire de contact qui arrive dans votre boîte",
      "Les contrôles avant livraison : contraste, lisibilité, poids des pages",
      "Le code et le nom de domaine transférés à votre nom",
      "La mise en ligne, et la formation pour vous en servir",
    ],
    etapesTitre: "Comment ça se passe",
    etapes: [
      { titre: "Le cadrage", corps: "Ce que le site doit faire, pour qui, et combien de pages. On écrit le périmètre avant de commencer." },
      { titre: "La maquette", corps: "Vous voyez les pages avant qu'elles soient construites. Les changements coûtent cent fois moins cher à ce moment-là." },
      { titre: "La construction", corps: "Le site est fabriqué, en français et en anglais, puis contrôlé sur téléphone comme sur ordinateur." },
      { titre: "La mise en ligne", corps: "Nom de domaine, hébergement, transfert à votre nom. Et deux heures pour vous montrer comment le faire vivre." },
    ],
    corps: [
      {
        titre: "Site une page ou site vitrine ?",
        texte:
          "Une page suffit à un commerce qui veut exister en ligne : ce que vous faites, où vous êtes, comment vous joindre. 2 200 $, dix jours. Cinq pages servent quand il y a plusieurs services à expliquer et des réalisations à montrer : 4 200 $, dix-huit jours. Dans le doute, on commence petit — ajouter deux pages plus tard coûte 850 $, refaire un site de cinq pages coûte un site.",
      },
      {
        titre: "Le site vous appartient, et c'est rare",
        texte:
          "Le code et le nom de domaine sont transférés à votre nom à la livraison. Si vous arrêtez de me payer, le site continue de fonctionner. Avec un abonnement mensuel chez une plateforme, le jour où vous arrêtez de payer, le site s'éteint — et au bout de trois ans à 60 $ par mois, vous avez versé 2 160 $ sans rien posséder.",
      },
      {
        titre: "Le français n'est pas une option au Québec",
        texte:
          "La Charte de la langue française oblige un commerce qui s'adresse au public québécois à offrir ses communications en français. Les deux versions sont conçues ensemble dès le départ, pas traduites à la fin — une page traduite après coup s'entend, et la version française finit par être la moins soignée.",
      },
      {
        titre: "La vitesse n'est pas un détail de technicien",
        texte:
          "Un visiteur sur un téléphone en 4G abandonne un site qui met plus de trois secondes. Chaque page livrée passe un contrôle de poids avant la mise en ligne, et le résultat est mesuré, pas promis.",
      },
    ],
    limiteTitre: "Ce que ce forfait ne couvre pas",
    limite:
      "La boutique en ligne et le paiement. Un site transactionnel demande un inventaire, des taxes, des frais de livraison et un service après-vente : ce n'est pas une page de plus, c'est un autre métier. On en parle, et si ce n'est pas pour moi, je vous le dis.",
    faqTitre: "Les questions qu'on me pose",
    faq: [
      {
        q: "Combien coûte un site web pour une PME au Québec ?",
        r: "Ici : 2 200 $ pour une page, 4 200 $ pour cinq. Les prix sont affichés et fixes. Ailleurs, « devis sur demande » cache une fourchette de 1 500 $ à 25 000 $ selon ce qu'on y met — c'est pourquoi ce site affiche ses montants.",
      },
      {
        q: "Combien de temps pour faire un site web ?",
        r: "Dix jours ouvrables pour une page, dix-huit pour cinq, à partir de la réception de vos textes et de vos images. La date est écrite dans la soumission.",
      },
      {
        q: "Est-ce que je pourrai modifier le site moi-même ?",
        r: "Oui, et c'est compris. Vous changez les textes, les photos et les prix sans m'appeler. La formation de deux heures est là pour ça.",
      },
      {
        q: "WordPress, Wix ou un site sur mesure ?",
        r: "Wix et Squarespace sont bons pour tester une idée à petit budget, tant que vous acceptez de louer. WordPress est puissant et demande un entretien régulier, sinon il devient une porte d'entrée. Sur mesure coûte plus cher au départ, ne coûte rien par mois, et vous appartient. Je vous dirai honnêtement si votre projet n'a pas besoin de moi.",
      },
      {
        q: "Qui paie l'hébergement et le nom de domaine ?",
        r: "Vous, directement chez le fournisseur, à votre nom — comptez de 20 $ à 200 $ par année selon le site. Ou par le suivi mensuel à 125 $, qui comprend l'hébergement, le domaine, les sauvegardes, la surveillance et quarante-cinq minutes de modifications par mois.",
      },
      {
        q: "Faites-vous la refonte d'un site existant ?",
        r: "Oui, au même prix qu'une création, pour la même raison que pour un logo : le travail est le même, et il faut en plus comprendre ce qui doit être conservé — les adresses des pages, le référencement acquis, les contenus qui fonctionnent.",
      },
    ],
    voisinsTitre: "La suite logique",
    ctaTitre: "Un site qui vous appartient, et dont vous connaissez le prix.",
    cta: "Demander une soumission",
  },

  application: {
    cle: "application",
    slug: { fr: "application-mobile", en: "mobile-apps" },
    titre: "Application mobile et web sur mesure — Châteauguay, Montérégie",
    description:
      "Développement d'application mobile et web sur mesure pour PME. Cadrage à 1 500 $ : périmètre écrit, maquette cliquable et soumission ferme, déduit du projet.",
    h1: "Application mobile et web",
    chapo:
      "Un outil fait pour votre façon de travailler, quand les logiciels existants ne la suivent plus. Ça commence toujours par un cadrage payé 1 500 $ — et déduit si le projet se fait.",
    prix: "1 500 $ pour le cadrage",
    montant: 1500,
    delai: "5 jours ouvrables",
    forfait: "Cadrage d'application",
    inclusTitre: "Ce que contient le cadrage",
    inclus: [
      "Le périmètre écrit : ce que l'application fait, et ce qu'elle ne fait pas",
      "Une maquette cliquable, qu'on manipule avant d'écrire une ligne de code",
      "Les choix techniques, expliqués en français",
      "Une soumission ferme pour la réalisation, avec un prix et une date",
      "Le document vous reste, même si vous faites réaliser le projet ailleurs",
    ],
    etapesTitre: "Comment ça se passe",
    etapes: [
      { titre: "On regarde votre façon de faire", corps: "Ce que vous notez sur papier, ce que vous recopiez deux fois, ce qui se perd. C'est là que sont les heures à récupérer." },
      { titre: "On écrit le périmètre", corps: "Noir sur blanc, y compris ce qui est exclu. C'est la partie qui évite les mauvaises surprises des deux côtés." },
      { titre: "On maquette", corps: "Une maquette cliquable : vous l'utilisez, vous dites ce qui cloche, on corrige. Avant le code." },
      { titre: "On chiffre", corps: "Une soumission ferme. Vous décidez ensuite, sans obligation." },
    ],
    corps: [
      {
        titre: "Pourquoi le cadrage se paie",
        texte:
          "Parce que c'est du travail, et parce qu'un cadrage gratuit est un cadrage bâclé. Cinq jours à comprendre votre métier, écrire le périmètre et maquetter l'outil : c'est ce qui permet de donner un prix ferme ensuite au lieu d'une fourchette qui double en cours de route. Il est déduit du projet s'il se fait — et s'il ne se fait pas, vous gardez un document qui vaut par lui-même.",
      },
      {
        titre: "Application mobile ou application web ?",
        texte:
          "Une application web s'ouvre dans un navigateur, fonctionne partout, se met à jour toute seule et ne passe par aucun magasin. Une application mobile native s'installe sur le téléphone et accède à l'appareil photo, aux notifications et au mode hors-ligne — mais elle demande une publication sur l'App Store et Google Play, et une mise à jour à chaque correction. La majorité des besoins de PME se règlent en web, et c'est beaucoup moins cher. Je vous le dirai si c'est votre cas.",
      },
      {
        titre: "Les cas où je vous dis non",
        texte:
          "Si un logiciel existant fait déjà 90 % du travail pour 50 $ par mois, le construire sur mesure serait un mauvais service à vous rendre. Un outil sur mesure se justifie quand votre façon de travailler est votre avantage, ou quand aucun logiciel ne suit votre métier. Sinon, je vous nomme les outils et vous ne me devez rien.",
      },
    ],
    limiteTitre: "Ce que ce forfait ne couvre pas",
    limite:
      "La réalisation elle-même, qui est chiffrée à la fin du cadrage parce qu'elle dépend entièrement de ce qu'on y aura décidé. Annoncer un prix d'application avant de savoir ce qu'elle fait serait une fourchette, pas un prix.",
    faqTitre: "Les questions qu'on me pose",
    faq: [
      {
        q: "Combien coûte une application mobile ?",
        r: "Le cadrage coûte 1 500 $ et donne un prix ferme pour la suite. Sans cadrage, personne ne peut répondre honnêtement : une application de prise de rendez-vous et une application de gestion d'inventaire n'ont pas le même ordre de grandeur, et l'écart se compte en dizaines de milliers de dollars.",
      },
      {
        q: "Quelle différence entre une application web et une application mobile ?",
        r: "La web s'ouvre dans un navigateur et se met à jour toute seule. La mobile s'installe, accède à l'appareil photo et aux notifications, et doit passer par l'App Store et Google Play. La web suffit dans la plupart des cas, et coûte nettement moins cher.",
      },
      {
        q: "Combien de temps pour développer une application ?",
        r: "Le cadrage prend cinq jours ouvrables. La réalisation dépend du périmètre, et sa durée est écrite dans la soumission qui conclut le cadrage — avec une date, pas une estimation.",
      },
      {
        q: "Et les frais des magasins d'applications ?",
        r: "Apple facture un compte développeur annuel, Google un frais d'inscription unique. Ces montants changent : ils sont vérifiés et inscrits dans la soumission au moment du cadrage, pas recopiés de mémoire.",
      },
      {
        q: "Qui est propriétaire du code ?",
        r: "Vous. Le code vous est transféré, comme pour un site. Vous pouvez le faire reprendre par quelqu'un d'autre sans me demander la permission.",
      },
    ],
    voisinsTitre: "La suite logique",
    ctaTitre: "Cinq jours pour savoir ce que ça coûte vraiment.",
    cta: "Demander une soumission",
  },
};

const EN: Record<CleService, ServiceDetail> = {
  logo: {
    cle: "logo",
    slug: { fr: "creation-de-logo", en: "logo-design" },
    titre: "Logo design in Châteauguay — price and date published",
    description:
      "Logo design for businesses in Châteauguay and the Montérégie. $2,200, delivered in 9 business days, source files and rights included. A price and a date from the first conversation.",
    h1: "Logo design",
    chapo:
      "A logo drawn for your business, not picked from a catalogue. The price and the date are written below, so you know what it costs before you write to me.",
    prix: "$2,200",
    montant: 2200,
    delai: "9 business days",
    forfait: "Visual identity",
    inclusTitre: "What you get",
    inclus: [
      "Three starting directions, then one taken all the way",
      "The logo horizontal, stacked, and the symbol on its own",
      "Colour, black and white versions",
      "Vector files (SVG, PDF) and images (PNG)",
      "The site icon and the profile picture, already sized",
      "A usage guide: clear space, minimum sizes, what not to do",
      "The transfer of rights, in writing",
    ],
    etapesTitre: "How it goes",
    etapes: [
      { titre: "We talk", corps: "Thirty minutes, in person in Châteauguay or over video. What you sell, to whom, and what you definitely do not want." },
      { titre: "Three directions", corps: "Three genuinely different ideas, not three versions of one. You pick one." },
      { titre: "One, taken all the way", corps: "The chosen direction is drawn, adjusted with you, then built out in every format." },
      { titre: "Delivery", corps: "Every file, the usage guide, and the rights signed over. You no longer need me to use it." },
    ],
    corps: [
      {
        titre: "Why three directions and not twelve",
        texte:
          "Twelve options is a way of making you do the deciding. Three genuinely different directions give you a real choice, and the time saved goes into drawing the one you keep. It is also why the price holds: it pays for drawing, not for volume.",
      },
      {
        titre: "A logo has to work at sixteen pixels",
        texte:
          "A logo is judged on a storefront sign and in a browser tab. A line that is too fine disappears when small; a colour that is too pale vanishes on white. Every logo is checked at both extremes, and the contrast is measured, not guessed.",
      },
      {
        titre: "The rights are yours, in writing",
        texte:
          "On delivery you receive a signed transfer of rights. You can print it, embroider it, paint it on a truck, change it, or sell it with the business. That is often not the case with online logo platforms, where you buy a licence on a drawing that may be sold elsewhere too.",
      },
      {
        titre: "If you already have a logo",
        texte:
          "A redesign costs the same as a new logo: the work is the same, and on top of it I have to understand what must be kept. If your current logo holds up, I will tell you — that is cheaper for you and more honest from me.",
      },
    ],
    limiteTitre: "What this does not cover",
    limite:
      "Trademark searches and registration. Those are legal steps, handled through the Canadian Intellectual Property Office or a trademark agent. I will tell you what to watch for; I am not qualified to do them for you.",
    faqTitre: "Questions I get",
    faq: [
      { q: "How much does a professional logo cost in Quebec?", r: "Here, $2,200 for a complete visual identity, published and fixed. Elsewhere the range runs from fifty dollars on an online platform to several thousand at an agency. The gap is not about the drawing — it is about what you are given: the rights, the source files, the variants and the usage guide." },
      { q: "How long does a logo take?", r: "Nine business days from the moment we have spoken and the deposit is in. The delivery date is written in the quote, and the quote is what binds." },
      { q: "What is the difference between a logo and a visual identity?", r: "The logo is a drawing. The visual identity is everything around it: the colours, the typeface, how they go together. A logo with no usage rules drifts within six months, because everyone who uses it arranges it their own way." },
      { q: "Which files will I receive?", r: "Vector (SVG and PDF) for print and large format, and images (transparent PNG) for screens. Plus the site icon and profile picture already at the right sizes. Vector is what a printer or a sign maker will ask for." },
      { q: "Can I use a logo made by an AI?", r: "Technically yes. Two problems: in Canada, a work produced without substantial human involvement has an uncertain copyright status, which complicates a trademark filing; and the same tool gives your competitor something very close. For a logo meant to last, that is a badly placed risk." },
      { q: "Do you work outside Châteauguay?", r: "Yes. Châteauguay, Mercier, Léry, Beauharnois and the Montérégie in person; Greater Montreal and the rest of Quebec remotely. The work is the same — only the first meeting changes shape." },
    ],
    voisinsTitre: "What usually follows",
    ctaTitre: "Your logo, $2,200, delivered in nine days.",
    cta: "Request a quote",
  },

  charte: {
    cle: "charte",
    slug: { fr: "charte-graphique", en: "brand-guidelines" },
    titre: "Brand guidelines and visual identity — Châteauguay, Quebec",
    description:
      "Brand guidelines for small businesses: colours, typography, usage rules and templates. $2,200 with the logo, delivered in 9 business days. Châteauguay and the Montérégie.",
    h1: "Brand guidelines and visual identity",
    chapo:
      "The rules that make a poster, an invoice and a social post read as the same company. It is what is usually missing when a brand looks amateur and nobody can say why.",
    prix: "$2,200",
    montant: 2200,
    delai: "9 business days",
    forfait: "Visual identity",
    inclusTitre: "What the guidelines contain",
    inclus: [
      "The logo and its lockups, with their clear space",
      "The palette: every colour in HEX, RGB, HSL and CMYK",
      "Measured contrast, so text stays readable",
      "Typography: the family, the weights, the sizes",
      "Layout rules: spacing, radii, shadows",
      "What not to do: the stretches and recolourings that are off limits",
      "Templates: business card, letterhead, email signature",
      "Social media formats, already at the right dimensions",
    ],
    etapesTitre: "How it goes",
    etapes: [
      { titre: "The logo first", corps: "The guidelines are built around it. If you already have one, we start from there." },
      { titre: "The colours", corps: "Chosen to work together, and checked for contrast: a colour nobody can read is not a brand colour." },
      { titre: "Type and rules", corps: "One family, a few weights, and the sizes that go with them. The fewer the rules, the more they are followed." },
      { titre: "The document", corps: "A PDF you can send to a printer or to anyone doing work for you." },
    ],
    corps: [
      { titre: "What it actually does for you", texte: "The day you ask someone for a poster, you send them a file instead of explaining over the phone. The day you change designers, the next one picks up without redrawing everything. And in between, your customers recognise you without reading your name — which is all anyone asks of a brand." },
      { titre: "The colours are verified, not eyeballed", texte: "Every text-on-background pair is measured for contrast. A colour that falls below the readability floor is dropped or darkened until it passes. That is not fussiness: it is what keeps text readable in sunlight, on a phone, and for someone who sees colour differently." },
      { titre: "Short guidelines beat a manual", texte: "A forty-page document does not get read, so it does not get followed. The one I deliver runs about fifteen pages: enough to decide with, nothing to impress with." },
    ],
    limiteTitre: "What this does not cover",
    limite:
      "Producing the materials themselves — printing the cards, installing the sign, running your social accounts. The guidelines give the templates and the rules; the printer and the sign maker do the rest, and they do it better with the document in hand.",
    faqTitre: "Questions I get",
    faq: [
      { q: "What is the difference between brand guidelines and a visual identity?", r: "The visual identity is everything you see: the logo, the colours, the typography. The guidelines are the document that says how to use them. They are delivered together — one without the other is of little use." },
      { q: "What do brand guidelines contain?", r: "At minimum: the logo and its variants, clear space, minimum sizes, the palette with exact values, the typography, and the list of things not to do. Mine add stationery templates and social formats, because those are what get used every week." },
      { q: "Are brand guidelines worth it for a small business?", r: "Especially for a small business. A large one has a marketing team holding the line. A four-person shop where everyone makes a poster when they need one has nothing else keeping the brand from drifting in six directions." },
      { q: "How much do brand guidelines cost?", r: "$2,200 with the logo, delivered in 9 business days. If your logo already exists and holds up, we start from it, and the price is the same: the work moves from drawing to rules and variants." },
      { q: "What about CMYK values for the printer?", r: "They are in the document, with a warning: they are arithmetic conversions, to be checked on a proof. A saturated colour shifts in four-colour printing, and a Pantone number invented by someone without a proof in front of them becomes the brand instead of the real colour." },
    ],
    voisinsTitre: "What usually follows",
    ctaTitre: "A brand that holds, from the business card to the sign.",
    cta: "Request a quote",
  },

  site: {
    cle: "site",
    slug: { fr: "creation-de-site-web", en: "web-design" },
    titre: "Web design in Châteauguay — published prices, 18 days",
    description:
      "Website design for small businesses in Châteauguay and the Montérégie. One-page site $2,200, five-page site $4,200. Bilingual, and the code and domain are yours.",
    h1: "Website design",
    chapo:
      "A site that belongs to you, loads fast on a phone, and whose content you edit yourself. The price and the date are published: you do not have to call to find out.",
    prix: "$2,200 – $4,200",
    montant: 4200,
    delai: "10 to 18 business days",
    forfait: "One-page site / Five-page site",
    inclusTitre: "What is included",
    inclus: [
      "Both versions, French and English, designed together",
      "A site that fits a phone, a tablet and a desktop",
      "Content you edit yourself",
      "A contact form that lands in your inbox",
      "Pre-delivery checks: contrast, readability, page weight",
      "The code and domain transferred into your name",
      "Going live, and the training to run it",
    ],
    etapesTitre: "How it goes",
    etapes: [
      { titre: "Scoping", corps: "What the site has to do, for whom, and how many pages. The scope is written before anything starts." },
      { titre: "The mockup", corps: "You see the pages before they are built. Changes cost a hundred times less at this stage." },
      { titre: "The build", corps: "The site is made, in French and English, then checked on phone and desktop." },
      { titre: "Going live", corps: "Domain, hosting, transfer into your name. Plus two hours to show you how to keep it alive." },
    ],
    corps: [
      { titre: "One page or five?", texte: "One page is enough for a business that wants to exist online: what you do, where you are, how to reach you. $2,200, ten days. Five pages make sense when there are several services to explain and work to show: $4,200, eighteen days. When in doubt, start small — adding two pages later costs $850; redoing a five-page site costs a site." },
      { titre: "The site is yours, and that is rare", texte: "The code and the domain are transferred into your name on delivery. If you stop paying me, the site keeps working. With a monthly platform subscription, the day you stop paying, the site goes dark — and after three years at $60 a month you have paid $2,160 and own nothing." },
      { titre: "French is not optional in Quebec", texte: "The Charter of the French Language requires a business serving the Quebec public to offer its communications in French. Both versions are designed together from the start, not translated at the end — a page translated afterwards can be heard, and it is usually the French one that suffers." },
      { titre: "Speed is not a technician's detail", texte: "A visitor on a phone over 4G gives up on a site that takes more than three seconds. Every page is weighed before going live, and the result is measured, not promised." },
    ],
    limiteTitre: "What this does not cover",
    limite:
      "Online stores and payment. A transactional site needs inventory, taxes, shipping and after-sales support: that is not one more page, it is another trade. We can talk about it, and if it is not for me, I will say so.",
    faqTitre: "Questions I get",
    faq: [
      { q: "How much does a small-business website cost in Quebec?", r: "Here: $2,200 for one page, $4,200 for five. Published and fixed. Elsewhere, \u201cquote on request\u201d hides a range from $1,500 to $25,000 depending on what goes in — which is exactly why this site publishes its numbers." },
      { q: "How long does a website take?", r: "Ten business days for one page, eighteen for five, starting from when your text and images arrive. The date is written in the quote." },
      { q: "Will I be able to edit the site myself?", r: "Yes, and it is included. You change text, photos and prices without calling me. The two-hour training is there for that." },
      { q: "WordPress, Wix, or custom?", r: "Wix and Squarespace are good for testing an idea on a small budget, as long as you accept renting. WordPress is powerful and needs regular maintenance, or it becomes a way in for attackers. Custom costs more up front, nothing per month, and belongs to you. I will tell you honestly if your project does not need me." },
      { q: "Who pays for hosting and the domain?", r: "You do, directly with the provider, in your name — between $20 and $200 a year depending on the site. Or through monthly care at $125, which covers hosting, domain, backups, monitoring and forty-five minutes of changes a month." },
      { q: "Do you redesign existing sites?", r: "Yes, at the same price as a new one, for the same reason as a logo: the work is the same, plus understanding what has to be kept — the page addresses, the search ranking already earned, the content that works." },
    ],
    voisinsTitre: "What usually follows",
    ctaTitre: "A site that belongs to you, at a price you already know.",
    cta: "Request a quote",
  },

  application: {
    cle: "application",
    slug: { fr: "application-mobile", en: "mobile-apps" },
    titre: "Mobile and web apps, custom built — Châteauguay, Quebec",
    description:
      "Custom mobile and web application development for small businesses. Scoping at $1,500: written scope, clickable mockup and a firm quote, deducted from the project.",
    h1: "Mobile and web applications",
    chapo:
      "A tool built around the way you work, for when off-the-shelf software no longer follows. It always starts with a $1,500 scoping — deducted if the project goes ahead.",
    prix: "$1,500 for scoping",
    montant: 1500,
    delai: "5 business days",
    forfait: "Application scoping",
    inclusTitre: "What scoping produces",
    inclus: [
      "The written scope: what the app does, and what it does not",
      "A clickable mockup, handled before a line of code is written",
      "The technical choices, explained in plain language",
      "A firm quote for the build, with a price and a date",
      "The document is yours, even if you have someone else build it",
    ],
    etapesTitre: "How it goes",
    etapes: [
      { titre: "We look at how you work", corps: "What you write on paper, what you type twice, what gets lost. That is where the hours are." },
      { titre: "We write the scope", corps: "In black and white, including what is excluded. This is the part that prevents bad surprises on both sides." },
      { titre: "We mock it up", corps: "A clickable mockup: you use it, you say what is wrong, we fix it. Before the code." },
      { titre: "We price it", corps: "A firm quote. You decide after that, with no obligation." },
    ],
    corps: [
      { titre: "Why scoping is paid work", texte: "Because it is work, and because free scoping is rushed scoping. Five days understanding your trade, writing the scope and mocking up the tool is what makes a firm price possible afterwards instead of a range that doubles along the way. It is deducted from the project if it goes ahead — and if it does not, you keep a document that stands on its own." },
      { titre: "Mobile app or web app?", texte: "A web app opens in a browser, works everywhere, updates itself and goes through no store. A native mobile app installs on the phone and reaches the camera, notifications and offline mode — but it needs publishing on the App Store and Google Play, and an update for every fix. Most small-business needs are met on the web, at far lower cost. I will tell you if that is your case." },
      { titre: "When I say no", texte: "If existing software already does 90% of the job for $50 a month, building it custom would be a disservice. A custom tool is justified when the way you work is your advantage, or when no software follows your trade. Otherwise I name the tools and you owe me nothing." },
    ],
    limiteTitre: "What this does not cover",
    limite:
      "The build itself, which is priced at the end of scoping because it depends entirely on what was decided there. Announcing an app price before knowing what the app does would be a range, not a price.",
    faqTitre: "Questions I get",
    faq: [
      { q: "How much does a mobile app cost?", r: "Scoping costs $1,500 and produces a firm price for the rest. Without scoping nobody can answer honestly: a booking app and an inventory app are not the same order of magnitude, and the gap runs into tens of thousands." },
      { q: "What is the difference between a web app and a mobile app?", r: "The web one opens in a browser and updates itself. The mobile one installs, reaches the camera and notifications, and has to go through the App Store and Google Play. The web one is enough in most cases, and costs considerably less." },
      { q: "How long does an app take to build?", r: "Scoping takes five business days. The build depends on the scope, and its duration is written into the quote that closes the scoping — with a date, not an estimate." },
      { q: "What about app store fees?", r: "Apple charges an annual developer account, Google a one-time registration fee. These amounts change: they are checked and written into the quote at scoping time, not quoted from memory." },
      { q: "Who owns the code?", r: "You do. The code is transferred to you, as with a website. You can have someone else take it over without asking me." },
    ],
    voisinsTitre: "What usually follows",
    ctaTitre: "Five days to find out what it really costs.",
    cta: "Request a quote",
  },
};

export const SERVICES_DETAIL: Record<Locale, Record<CleService, ServiceDetail>> = {
  fr: FR,
  // L'anglais est écrit à part, pas traduit mot à mot : une phrase pensée en
  // français puis traduite s'entend, et c'est la version anglaise qui en
  // souffre.
  en: EN,
};

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
      accueil: "Accueil",
      services: "Services",
      realisations: "Réalisations",
      apropos: "À propos",
      contactCourt: "Contact",
      soumission: "Demander une soumission",
      offre: "Ce que je fais",
      prix: "Prix",
      methode: "Comment ça se passe",
      contact: "Parler du projet",
      langue: "English",
      autre: "en",
      menu: "Menu",
      fermer: "Fermer",
    },
    pages: {
      accueil: {
        manifeste: [
          {
            titre: "Le prix. La date. Dès le premier échange.",
            corps: "Pas de « soumission sur demande » pour un site vitrine. Les montants sont affichés, et la date est au contrat.",
          },
          {
            titre: "Une seule personne, du logo à l'application.",
            corps: "Celle à qui vous parlez dirige le travail, même quand une équipe s'y ajoute. Pas de vendeur, pas d'intermédiaire, pas de version déformée de votre demande.",
          },
          {
            titre: "Le site vous appartient.",
            corps: "Le code et le nom de domaine sont à vous. Vous n'êtes locataire d'aucune plateforme dont l'abonnement grimpe.",
          },
          {
            titre: "Châteauguay. On peut se rencontrer.",
            corps: "Montérégie et Grand Montréal. Quelqu'un à appeler, qui connaît votre projet, et qui répond.",
          },
        ],
        etapesTitre: "Quatre étapes, et vous savez où vous allez",
        // Les objets posés sur les photos du manifeste : chacun montre la
        // promesse de son panneau au lieu de la répéter.
        objets: {
          devis: {
            titre: "Si l'on commençait aujourd'hui",
            livre: "Livré le",
            choix: "Choisir un forfait",
          },
          fil: {
            etapes: ["Logo", "Site", "Application", "Suivi"],
            legende: "Un seul interlocuteur, du premier au dernier",
          },
          titre: {
            label: "Le nom de votre commerce",
            exemple: "Boulangerie du Coin",
            domaine: "Nom de domaine",
            proprietaire: "Propriétaire",
            vous: "Vous",
            code: "Code source",
            aVous: "À vous",
            note: "Exemple. Un nom de domaine se vérifie et se réserve avant d'être promis.",
          },
          horloge: {
            heure: "à Châteauguay",
            lieux: "Montérégie · Grand Montréal",
            rencontre: "Sur place ou en visio",
          },
        },
      },
      services: {
        titre: "Services",
        chapo: "Quatre métiers et un seul interlocuteur, du logo d'un commerce à la plateforme d'une PME. Chaque service se commande seul ou avec les autres.",
        envergure: {
          titre: "Projets d'envergure",
          corps: "Une application lourde, une plateforme, plusieurs métiers à la fois : je monte l'équipe qu'il faut et je la pilote. Vous gardez un seul interlocuteur, un seul contrat et une seule date.",
          points: [
            "Un cadrage payant à prix fixe, déduit du projet s'il se fait",
            "Une équipe choisie pour votre projet, pas un catalogue",
            "Le prix et la date écrits avant le premier jour de travail",
            "Un seul interlocuteur, du cadrage à la livraison",
          ],
          cta: "Parler d'un projet d'envergure",
        },
        sommaire: {
          titre: "Les quatre métiers, en un coup d'œil",
          chapo: "Chacun se commande seul. Choisissez par où vous commencez ; le reste peut venir plus tard, ou jamais.",
        },
        voirDetail: "Le détail",
        deplier: "Comment ça se passe",
        limitesTitre: "Ce que je ne fais pas",
        limitesChapo: "Dit ici plutôt que découvert en cours de route.",
        items: [
          {
            nom: "Sites web",
            resume: "Du site une page au site vitrine complet.",
            detail: "Présenter votre activité, être trouvé par les gens qui vous cherchent, être joint sans friction. Bilingue français-anglais dès la conception, parce qu'au Québec ce n'est pas une option.",
            livrables: ["Conception et intégration", "Bilingue FR/EN", "Fiche Google Business", "Vous modifiez le contenu vous-même", "Hébergement et suivi"],

            horsPerimetre: "Ne couvre pas la rédaction de vos textes ni la photographie. Je vous oriente, mais le contenu reste le vôtre — et c'est lui qui vous distingue.",          },
          {
            nom: "Applications web et mobile",
            resume: "Un outil sur mesure quand l'existant ne suit pas.",
            detail: "Quand un logiciel du commerce ne correspond pas à votre façon de travailler et qu'il vous impose la sienne. On commence par un cadrage payant à prix fixe : périmètre écrit, maquette cliquable, soumission ferme.",
            livrables: ["Cadrage et maquette cliquable", "Développement web ou mobile", "Reprise de vos données", "Formation à l'usage", "Évolutions au fil de l'eau"],

            horsPerimetre: "Ne couvre pas la reprise d'un code existant que je n'ai pas écrit, ni les données réglementées — santé, paiement — sans un cadrage séparé.",          },
          {
            nom: "Identité visuelle",
            resume: "Logo, couleurs, typographie et déclinaisons.",
            detail: "Une identité qui tient aussi bien sur une enseigne d'atelier que sur une facture, un camion ou un fil Instagram. Livrée avec son guide d'usage, pour que vous puissiez la confier à quelqu'un d'autre sans qu'elle se déforme.",
            livrables: ["Logo et monogramme", "Palette et typographie", "Carte, enseigne, réseaux sociaux", "Guide d'usage", "Fichiers sources"],

            horsPerimetre: "Ne couvre ni le dépôt de marque, ni l'impression. Je livre les fichiers sources ; vous choisissez votre imprimeur et votre agent de marques.",          },
          {
            nom: "Informatique et marketing",
            resume: "Dépannage, maintenance, accompagnement.",
            detail: "Le reste : un poste qui ne démarre plus, une boîte courriel à configurer, une campagne à lancer, un référencement local à redresser. Facturé à l'heure ou au forfait mensuel, jamais à l'aveugle.",
            livrables: ["Dépannage sur place ou à distance", "Configuration courriel et postes", "Référencement local", "Campagnes et publications", "Suivi mensuel"],

            horsPerimetre: "Ne couvre pas la gestion de vos réseaux sociaux au quotidien, ni l'achat de publicité en votre nom.",          },
        ],
        ctaTitre: "Une idée du budget avant d'appeler ?",
        ctaCorps: "Les forfaits sont affichés, en dollars canadiens. Vous saurez à quoi vous attendre avant même de m'écrire.",
        ctaLien: "Voir les prix",
      },
      realisations: {
        titre: "Réalisations",
        chapo: "Aucune pour l'instant. Les dix premiers projets rempliront cette page, à\u00a0−25\u00a0%.",
        // Le témoin de l'en-tête : un ticket de file d'attente. Les places
        // partent dans l'ordre d'arrivée, et c'est exactement ce que dit un
        // distributeur de numéros. Le numéro affiché est calculé sur
        // `PLACES_PRISES` (src/lib/site.ts), jamais écrit à la main.
        ticket: {
          libelle: "Votre numéro",
          sur: "sur",
          rabais: "sur le prix affiché",
          ordre: "Servi dans l'ordre d'arrivée",
          complet: "Les dix places sont prises.",
        },
        vide: {
          titre: "Une page vide, et c'est voulu",
          // Découpé en lignes à la main, pas par une expression régulière : « Marie
          // L. » et « : » piègent tout découpage automatique, et c'est surtout le
          // rythme de lecture qui décide d'une coupe, pas la ponctuation. Chaque
          // ligne s'allume seule au défilement — voir `TexteProgressif`.
          corps: [
            [
              "J'aurais pu inventer trois maquettes",
              "et deux témoignages signés « Marie L. ».",
            ],
            [
              "Vous l'auriez vu. Tout le monde le voit.",
            ],
            [
              "Alors autant le dire : je commence,",
              "et cette page attend son premier vrai nom.",
            ],
          ],
        },
        cadres: {
          cta: "Prendre le numéro",
        },
        offre: {
          titre: "L'échange, dans les deux sens",
          corps: "Un rabais de 25\u00a0% se paie en quelque chose. Voici exactement en quoi, et ce que je ne demande pas.",
          jeDonne: {
            titre: "Ce que je donne",
            items: [
              "25 % de moins sur le prix affiché, appliqué à la soumission écrite",
              "Le même travail, le même délai daté, le même contrat",
              "Le code et le nom de domaine à vous, comme pour tout le monde",
              "Un interlocuteur unique, du premier message à la livraison",
            ],
          },
          jeDemande: {
            titre: "Ce que je demande",
            items: [
              "Le droit de montrer votre projet sur cette page",
              "Deux ou trois phrases sur la façon dont ça s'est passé, si vous êtes satisfait. Rien si vous ne l'êtes pas.",
              "Rien d'autre : ni exclusivité, ni engagement de durée, ni droit sur votre marque",
            ],
          },
          conditions: {
            titre: "Les conditions, en entier",
            items: [
              { cle: "Dix projets", texte: "Une seule place par entreprise." },
              { cle: "Forfaits affichés", texte: "Hors suivi mensuel." },
              { cle: "Sur la soumission", texte: "Sans signature, aucun engagement, ni du studio ni de vous." },
              { cle: "Retirable", texte: "L'autorisation de publier se retire par courriel, sans que le prix change." },
              { cle: "Pas un concours", texte: "Ni tirage, ni hasard. Un rabais, dans l'ordre d'arrivée." },
            ],
          },
          compteARebours: {
            titre: "L'offre se termine dans",
            jours: "jours",
            heures: "heures",
            minutes: "minutes",
            secondes: "secondes",
            terminee: "L'offre de lancement est terminée. Les prix affichés sur la page Prix restent valables.",
            sansDate: "La date de fin sera annoncée ici dès qu'elle sera arrêtée.",
          },
          finTitre: "Prenez votre numéro.",
          ctaNote: "Décrivez votre projet en deux lignes. Réponse sous 48 heures, avec un prix et une date.",
        },
      },
      apropos: {
        titre: "À propos",
        chapo: "L'histoire du studio commence aujourd'hui, à Châteauguay. La suite s'écrira avec ses premiers clients.",
        // Le témoin de l'en-tête : une page de Cahier Canada datée du jour. La
        // date est calculée chez le visiteur, à l'heure de Châteauguay ; rien
        // n'est écrit en dur, donc rien ne vieillit.
        cahier: {
          lieu: "Châteauguay, le",
          page: "Page 1",
        },
        carnet: {
          titre: "Le carnet de bord",
          ecrit: {
            titre: "Déjà écrit",
            entrees: [
              { titre: "Aujourd'hui, le studio ouvre à Châteauguay.", corps: "Une personne, quatre métiers, aucun client à citer pour l'instant. C'est une première ligne, pas un manque." },
              { titre: "Les prix sont publiés.", corps: "Pas de soumission sur demande : les forfaits sont affichés, en dollars canadiens.", lien: "Voir les prix" },
              { titre: "La base technique est construite.", corps: "Je ne repars pas de zéro à chaque projet. C'est elle qui rend un prix ferme et une date tenables." },
              { titre: "Ce site passe ses propres contrôles.", corps: "Neuf largeurs d'écran, deux thèmes, et des contrastes mesurés plutôt qu'estimés à l'œil." },
            ],
          },
          // Les refus, barrés : ce sont des lignes que le carnet ne portera
          // jamais. Le titre du groupe dit en mots ce que le trait dit à l'œil,
          // pour qu'un lecteur d'écran, qui n'annonce pas le barré, ait la
          // même information.
          jamais: {
            titre: "Ne s'écrira jamais",
            entrees: [
              { titre: "Un mandat que je ne peux pas tenir.", corps: "Si votre projet demande une équipe, je la monte et je la pilote. S'il dépasse ce que je peux garantir, je le dis au premier échange." },
              { titre: "Une facture à l'heure.", corps: "Le prix est fixé avant, sur un périmètre écrit." },
              { titre: "Vos accès gardés en otage.", corps: "Code, domaine et hébergement sont à votre nom dès la livraison." },
              { titre: "La première place sur Google.", corps: "Personne ne peut la promettre. Je vous montre ce qui se mesure." },
            ],
          },
          avenir: {
            titre: "S'écrira avec vous",
            numero: "n°",
            invite: "Votre projet\u00a0?",
            note: "Les dix premiers projets sont à\u00a0−25\u00a0%, dans l'ordre d'arrivée.",
            lien: "Voir les dix places",
          },
        },
        regles: {
          titre: "Les règles du carnet",
          items: [
            { titre: "Rien d'inventé.", corps: "Aucun faux témoignage, aucun logo emprunté, aucun compteur décoratif. Ce qui est écrit ici est vrai, ou n'est pas écrit." },
            { titre: "Vous restez autonome.", corps: "Le site livré se modifie sans moi, et je vous montre comment." },
            { titre: "Vérifié, pas supposé.", corps: "Contrastes, lisibilité, téléphone et grand écran : contrôlés avant chaque livraison." },
          ],
        },
        fin: {
          titre: "Écrivez la première ligne.",
          corps: "Décrivez votre projet en deux lignes. Je réponds sous 48 heures avec un prix et une date.",
          lienPlaces: "Voir les dix places",
        },
      },
      contact: {
        titre: "Demander une soumission",
        chapo: "Décrivez votre projet en quelques lignes. Je réponds sous 48 heures avec un prix et une date, ou avec les questions qui me manquent pour les donner.",
        champs: {
          nom: "Votre nom",
          entreprise: "Entreprise",
          courriel: "Courriel",
          telephone: "Téléphone",
          service: "Ce qui vous intéresse",
          budget: "Budget envisagé",
          message: "Votre projet en quelques lignes",
          optionnel: "facultatif",
        },
        services: ["Site web", "Application web ou mobile", "Identité visuelle", "Informatique ou marketing", "Je ne sais pas encore"],
        budgets: ["Moins de 2 000 $", "2 000 $ à 5 000 $", "5 000 $ à 15 000 $", "Plus de 15 000 $", "À déterminer"],
        envoyer: "Envoyer la demande",
        erreurs: {
          nom: "Indiquez votre nom.",
          courriel: "Indiquez une adresse courriel valide.",
          message: "Décrivez votre projet, même brièvement.",
        },
        ouverture: "Votre logiciel de courriel va s'ouvrir avec le message pré-rempli. Vérifiez-le, puis envoyez.",
        viePrivee: "Ce formulaire n'envoie rien à ce site : il prépare un courriel dans votre logiciel, et rien ne me parvient tant que vous ne l'avez pas envoyé vous-même.",
        viePriveeLien: "Ce que je fais des renseignements reçus",
        direct: "Ou écrivez directement à",
        infosTitre: "Coordonnées",
        infos: [
          ["Courriel", "Emiletchesseu@gmail.com"],
          ["Secteur", "Châteauguay, Montérégie, Grand Montréal"],
          ["Langues", "Français et anglais"],
          ["Réponse", "Sous 48 heures, jours ouvrables"],
        ],
        // La liste des villes est du texte, pas un dessin : sur un globe, la
        // Montérégie entière tient dans deux pixels. Le globe montre d'où l'on
        // travaille et jusqu'où ça porte ; ces lignes disent qui est couvert.
        couvertureTitre: "Sur place",
        couvertureVilles:
          "Châteauguay, Mercier, Léry, Sainte-Catherine, Saint-Constant, Candiac, La Prairie, Delson, Kahnawà:ke, Beauharnois, Salaberry-de-Valleyfield — et l'île de Montréal, Longueuil, Brossard.",
        couvertureEnLigneTitre: "Ailleurs",
        couvertureEnLigne:
          "En ligne, partout. Un site ou une application se conçoit et se livre à distance ; seules les rencontres demandent d'être du coin.",
        couvertureLegende: "Châteauguay",
      },
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
          titre: "Vous parlez à la personne qui dirige le travail",
          corps:
            "Du premier message à la livraison, même quand une équipe s'y ajoute. Pas d'intermédiaire, pas de version déformée de votre demande.",
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
      intro: "Assemblez votre projet : le prix et la date se calculent pendant que vous choisissez. C'est la promesse du studio, appliquée à la page.",
      config: {
        etape1: "Votre point de départ",
        etape2: "À ajouter, si besoin",
        etape3: "Après la livraison",
        total: "Votre projet",
        unique: "une seule fois, taxes en sus",
        parMois: "par mois, sans engagement",
        livraison: "Livré le",
        jours: "jours ouvrables",
        rien: "Choisissez un point de départ pour voir le prix et la date.",
        economie: "au lieu de",
        cta: "Demander cette soumission",
        ctaNote: "Le détail de votre sélection part avec le message. Réponse sous 48 heures, avec une soumission écrite — c'est elle qui engage, pas cette page.",
        formulaire: "Ou passer par le formulaire",
      },
      // « Ce que ces montants couvrent » : un reçu et un comparatif plutôt
      // qu'un paragraphe et une liste. Voir `couverture-prix.tsx`.
      composition: {
        titre: "Ce que ces montants couvrent",
        chapo: "Le temps réel de chaque projet, à un taux qui couvre les charges d'un studio : outils, hébergement, assurance responsabilité professionnelle, comptabilité, matériel.",
        recuTitre: "Inclus dans chaque forfait",
        items: [
          { titre: "Conception et réalisation", detail: "Révisions comprises" },
          { titre: "Le français et l'anglais", detail: "Les deux versions, conçues ensemble" },
          { titre: "Les contrôles avant livraison", detail: "Contraste, lisibilité, poids des pages" },
          { titre: "La mise en ligne", detail: "Code et nom de domaine transférés à votre nom" },
        ],
        fraisLibelle: "Frais découverts en cours de route",
        fraisMontant: "0\u00a0$",
        comparaisonTitre: "Au bout de trois ans",
        colonnes: ["Abonnement en ligne à 60\u00a0$ par mois", "Site livré par le studio"],
        lignes: [
          { cle: "Ce que vous avez payé", abonnement: "2\u00a0160\u00a0$", studio: "Le prix du forfait, une fois" },
          { cle: "Ce que vous possédez", abonnement: "Rien", studio: "Le code, le nom de domaine, les fichiers" },
          { cle: "Si vous arrêtez de payer", abonnement: "Le site s'arrête", studio: "Le code et le domaine restent à vous" },
        ],
        hebergement: "L'hébergement d'un site livré se paie à part : chez l'hébergeur de votre choix, ou avec le suivi mensuel.",
      },
      note: "Ces montants valent pour un projet aux caractéristiques courantes. Ce qui sort du cadre est chiffré avant d'être commencé, jamais après. Seule une soumission écrite engage le studio.",
      forfaits: [
        { cle: "une-page", type: "base", nom: "Site une page", detail: "Tout ce qu'il faut pour exister en ligne : votre activité, vos coordonnées, un formulaire. Bilingue, mobile, fiche Google incluse.", prix: "2 200 $", montant: 2200, jours: 10, delai: "10 jours ouvrables" },
        { cle: "vitrine", type: "base", nom: "Site vitrine, 5 pages", detail: "Accueil, services, réalisations, à propos, contact. Bilingue, et vous modifiez le contenu vous-même.", prix: "4 200 $", montant: 4200, jours: 18, delai: "18 jours ouvrables" },
        { cle: "identite", type: "base", nom: "Identité visuelle", detail: "Logo, palette, typographie, déclinaisons et guide d'usage. Fichiers sources livrés.", prix: "2 200 $", montant: 2200, jours: 9, delai: "9 jours ouvrables" },
        { cle: "identite-vitrine", type: "base", nom: "Identité + site vitrine", detail: "Les deux menés d'un seul tenant, ce qui supprime une bonne part des allers-retours. C'est ce qui finance l'économie.", prix: "5 600 $", montant: 5600, avant: 6400, jours: 24, delai: "24 jours ouvrables" },
        { cle: "cadrage", type: "base", nom: "Cadrage d'application", detail: "Périmètre écrit, maquette cliquable, soumission ferme. Déduit du projet s'il se fait.", prix: "1 500 $", montant: 1500, jours: 5, delai: "5 jours ouvrables" },
        { cle: "redaction", type: "option", nom: "Rédaction de vos textes", detail: "Vous me dites ce que vous faites, j'écris les pages.", prix: "600 $", montant: 600, jours: 3, delai: "+3 jours" },
        { cle: "pages", type: "option", nom: "Deux pages de plus", detail: "Une page de service détaillée, une page d'équipe, ce que vous voulez.", prix: "850 $", montant: 850, jours: 4, delai: "+4 jours" },
        { cle: "google", type: "option", nom: "Fiche Google Business", detail: "Créée, remplie et optimisée pour la recherche locale.", prix: "250 $", montant: 250, jours: 1, delai: "+1 jour" },
        { cle: "formation", type: "option", nom: "Formation, deux heures", detail: "En personne à Châteauguay ou à distance, pour que le site vive sans moi.", prix: "200 $", montant: 200, jours: 1, delai: "+1 jour" },
        { cle: "suivi", type: "suivi", nom: "Suivi mensuel", detail: "Hébergement, nom de domaine, sauvegardes, surveillance, et quarante-cinq minutes de modifications par mois.", prix: "125 $ / mois", montant: 125, jours: 0, delai: "sans engagement" },
      ],
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
        { n: "01", quand: "Aujourd'hui", titre: "On se parle", corps: "30 minutes, sur place ou en visio. Vous décrivez votre activité et ce dont vous avez besoin. Aucun engagement." },
        { n: "02", quand: "Sous 48 heures", titre: "Vous recevez un prix et une date", corps: "Par écrit, sous 48 heures. Le montant est ferme, la date aussi." },
        { n: "03", quand: "Dès le premier jour", titre: "Je construis, vous voyez avancer", corps: "Un lien de suivi dès le premier jour. Vous commentez au fur et à mesure, pas à la fin." },
        { n: "04", quand: "À la date du devis", titre: "Je livre, et vous prenez la main", corps: "Le site est à vous. Une heure de prise en main pour que vous puissiez le modifier seul." },
      ],
    },
    contact: {
      titre: "Parlons de votre projet",
      corps:
        "Décrivez en deux lignes ce que vous voulez faire. Je réponds sous 48 heures avec un prix et une date, ou avec les questions qui me manquent pour les donner.",
      courriel: "Écrire un courriel",
      note: "Châteauguay, Québec · Français et anglais",
    },
    /**
     * Titres et descriptions destinés aux moteurs, par chemin.
     *
     * Ils sont séparés des titres affichés pour une raison mesurée : le h1 de
     * la page Services dit « Services », ce qui est juste à l'écran, où le
     * menu et le logo disent déjà le reste — et absurde dans une page de
     * résultats, où il apparaissait seul, sans marque, sans métier et sans
     * ville. Les quatre pages intérieures avaient ce défaut.
     *
     * Règles : 50 à 60 caractères pour le titre, 150 à 160 pour la
     * description, et la ville sur les pages commerciales. `npm run verify:seo`
     * échoue au-delà.
     */
    seo: {
      "": {
        titre: "Studio Sentis — sites web et identité visuelle à Châteauguay",
        description:
          "Sites web, applications et identité visuelle à Châteauguay. Le prix et la date dès le premier échange, un seul interlocuteur du logo à la livraison.",
      },
      "/services": {
        titre: "Site web, application, identité — Studio Sentis",
        description:
          "Quatre métiers, un interlocuteur : sites web bilingues, applications sur mesure, identité visuelle, suivi mensuel. Prix affichés. Châteauguay et Montérégie.",
      },
      "/realisations": {
        titre: "Offre de lancement : 10 places — Studio Sentis",
        description:
          "Aucune réalisation à montrer, et le studio préfère le dire. Les dix premiers projets sont à −25 %, en échange du droit de les publier. Conditions en entier.",
      },
      "/a-propos": {
        titre: "À propos du studio, à Châteauguay — Studio Sentis",
        description:
          "Un studio de Châteauguay qui commence et qui préfère le dire : pourquoi il existe, comment il travaille, et ce qu'il refuse de promettre avant de l'avoir fait.",
      },
      "/contact": {
        titre: "Demander une soumission — Studio Sentis",
        description:
          "Décrivez votre projet en quelques lignes. Réponse sous 48 heures avec un prix et une date. Châteauguay, Montérégie, Grand Montréal et à distance.",
      },
      "/mentions-legales": {
        titre: "Mentions légales — Studio Sentis",
        description:
          "Qui édite ce site, ce que présentent les réalisations, ce que les prix affichés engagent, et le droit applicable au Québec.",
      },
      "/confidentialite": {
        titre: "Politique de confidentialité — Studio Sentis",
        description:
          "Ce site ne mesure rien, ne suit personne et ne reçoit aucune donnée. Comment le vérifier, et ce qu'il advient des renseignements envoyés par courriel.",
      },
    },
    /**
     * L'outil « Testez votre site », sur l'accueil. Il remplace la section des
     * démonstrations : le client doutait de son utilité, et un outil qui
     * mesure le site du visiteur lui-même le retient mieux qu'une maquette de
     * boulangerie fictive. La mesure est faite par Google PageSpeed Insights,
     * appelé depuis le navigateur du visiteur ; la politique de
     * confidentialité le dit.
     */
    testSite: {
      titre: "Votre site actuel tient-il la route ?",
      chapo: "Entrez son adresse. Google le charge comme le ferait un téléphone et mesure sa vitesse, son accessibilité et ce qu'en voient les moteurs de recherche. Comptez une trentaine de secondes.",
      label: "L'adresse de votre site",
      placeholder: "votre-commerce.ca",
      bouton: "Tester mon site",
      enCours: "Analyse en cours… Google charge votre site comme un téléphone le ferait.",
      vide: "Les notes s'afficheront ici, de 0 à 100, avec ce qu'elles veulent dire.",
      categories: {
        performance: "Vitesse",
        accessibility: "Accessibilité",
        "best-practices": "Bonnes pratiques",
        seo: "Référencement",
      },
      mesures: {
        lcp: "Affichage du contenu principal",
        cls: "Stabilité de la mise en page",
        https: "Connexion sécurisée (HTTPS)",
      },
      oui: "Oui",
      non: "Non",
      verdicts: { bon: "Bon", moyen: "À améliorer", faible: "Faible" },
      erreurs: {
        adresse: "Cette adresse n'a pas l'air valide. Essayez par exemple : votre-commerce.ca",
        service: "Google n'a pas pu mesurer ce site pour l'instant : trop de demandes, ou site inaccessible. Réessayez dans une minute.",
      },
      resultatPour: "Résultat pour",
      lienGoogle: "Faire le test sur le site de Google",
      variation: "Les notes varient un peu d'une mesure à l'autre.",
      conclusionBon: "Votre site s'en sort bien. S'il doit évoluer, parlons-en.",
      conclusionMoyen: "Ces notes se corrigent, et ce sont souvent elles qui coûtent des visiteurs sur téléphone.",
      cta: "Demander une soumission",
      viePrivee: "L'adresse que vous entrez est envoyée à Google PageSpeed Insights, qui fait la mesure. Rien n'est envoyé à ce site.",
      source: "Mesure : Google PageSpeed Insights, sur téléphone.",
    },
    /**
     * Les témoins des en-têtes de page.
     *
     * Ils remplacent les volumes 3D qui tournaient à côté des titres : un nuage
     * de points ne disait rien de la page qu'il ornait. Chaque témoin montre
     * plutôt une promesse du studio **en train d'être tenue**, calculée chez le
     * visiteur au moment où il lit : la date de livraison si l'on commençait
     * aujourd'hui, l'heure limite de réponse s'il écrit maintenant.
     */
    temoins: {
      livraison: {
        titre: "Si l'on commençait aujourd'hui",
        colonnes: ["Forfait", "Prix", "Livré le"],
        note: "En jours ouvrables. La date ferme est celle de la soumission écrite.",
      },
      reponse: {
        titre: "Si vous écrivez maintenant",
        heure: "à Châteauguay",
        avant: "Réponse au plus tard le",
        note: "Sous 48 heures, jours ouvrables.",
      },
    },
    pied: {
      droits: "Studio Sentis — Châteauguay, Québec",
      legal: "Informations légales",
      mentions: "Mentions légales",
      confidentialite: "Politique de confidentialité",
    },
  },

  en: {
    meta: {
      title: "Studio Sentis — websites, apps and visual identity in Châteauguay",
      description:
        "A price and a date from the first conversation. One person, from logo to application. Châteauguay, Montérégie and Greater Montreal.",
    },
    nav: {
      accueil: "Home",
      services: "Services",
      realisations: "Work",
      apropos: "About",
      contactCourt: "Contact",
      soumission: "Request a quote",
      offre: "What I do",
      prix: "Pricing",
      methode: "How it works",
      contact: "Discuss your project",
      langue: "Français",
      autre: "fr",
      menu: "Menu",
      fermer: "Close",
    },
    pages: {
      accueil: {
        manifeste: [
          {
            titre: "The price. The date. From the first conversation.",
            corps: "No \"quote on request\" for a brochure site. The amounts are published, and the date is in the contract.",
          },
          {
            titre: "One person, from logo to application.",
            corps: "The person you talk to leads the work, even when a team joins in. No salesperson, no middle layer, no distorted version of your request.",
          },
          {
            titre: "The site belongs to you.",
            corps: "The code and the domain name are yours. You are not renting from a platform whose subscription keeps climbing.",
          },
          {
            titre: "Châteauguay. We can meet.",
            corps: "Montérégie and Greater Montreal. Someone to call, who knows your project, and who answers.",
          },
        ],
        etapesTitre: "Four steps, and you know where you stand",
        objets: {
          devis: {
            titre: "If we started today",
            livre: "Delivered",
            choix: "Pick a package",
          },
          fil: {
            etapes: ["Logo", "Website", "App", "Care"],
            legende: "One person to talk to, first to last",
          },
          titre: {
            label: "Your business name",
            exemple: "Corner Bakery",
            domaine: "Domain name",
            proprietaire: "Owner",
            vous: "You",
            code: "Source code",
            aVous: "Yours",
            note: "Example. A domain name is checked and registered before anyone promises it.",
          },
          horloge: {
            heure: "in Châteauguay",
            lieux: "Montérégie · Greater Montreal",
            rencontre: "In person or by video",
          },
        },
      },
      services: {
        titre: "Services",
        chapo: "Four crafts and one point of contact, from a shop's logo to a company's platform. Each service stands alone or combines with the others.",
        envergure: {
          titre: "Larger projects",
          corps: "A heavy application, a platform, several crafts at once: I put together the team it needs and lead it. You keep one point of contact, one contract and one date.",
          points: [
            "A paid fixed-price scoping, deducted from the project if it goes ahead",
            "A team chosen for your project, not a catalogue",
            "The price and the date in writing before the first day of work",
            "One point of contact, from scoping to delivery",
          ],
          cta: "Discuss a larger project",
        },
        sommaire: {
          titre: "The four crafts, at a glance",
          chapo: "Each one stands alone. Pick where you start; the rest can come later, or never.",
        },
        voirDetail: "Details",
        deplier: "How it works",
        limitesTitre: "What I don't do",
        limitesChapo: "Said here rather than discovered along the way.",
        items: [
          {
            nom: "Websites",
            resume: "From a one-page site to a full brochure site.",
            detail: "Present your business, get found by the people looking for you, get reached without friction. Bilingual French and English from the design stage, because in Quebec that is not optional.",
            livrables: ["Design and build", "Bilingual FR/EN", "Google Business listing", "You edit the content yourself", "Hosting and care"],

            horsPerimetre: "Does not cover writing your copy or photography. I can point you in the right direction, but the content stays yours — and it is what sets you apart.",          },
          {
            nom: "Web and mobile applications",
            resume: "A custom tool when off-the-shelf software doesn't fit.",
            detail: "For when commercial software doesn't match how you work and imposes its own way instead. We start with a paid fixed-price scoping: written scope, clickable mockup, firm quote.",
            livrables: ["Scoping and clickable mockup", "Web or mobile build", "Data migration", "Training", "Ongoing changes"],

            horsPerimetre: "Does not cover taking over existing code I did not write, nor regulated data — health, payments — without separate scoping.",          },
          {
            nom: "Visual identity",
            resume: "Logo, colours, typography and applications.",
            detail: "An identity that holds up on a workshop sign as well as on an invoice, a van or an Instagram feed. Delivered with its usage guide, so you can hand it to someone else without it falling apart.",
            livrables: ["Logo and monogram", "Palette and typography", "Card, signage, social media", "Usage guide", "Source files"],

            horsPerimetre: "Covers neither trademark filing nor printing. I deliver the source files; you choose your printer and your trademark agent.",          },
          {
            nom: "IT and marketing",
            resume: "Support, maintenance, day-to-day help.",
            detail: "The rest: a machine that won't boot, an email account to set up, a campaign to launch, local search to straighten out. Billed hourly or on a monthly package, never blind.",
            livrables: ["On-site or remote support", "Email and workstation setup", "Local search", "Campaigns and posts", "Monthly care"],

            horsPerimetre: "Does not cover running your social media day to day, nor buying advertising on your behalf.",          },
        ],
        ctaTitre: "Want a sense of the budget first?",
        ctaCorps: "The packages are published, in Canadian dollars. You will know what to expect before you even write to me.",
        ctaLien: "See pricing",
      },
      realisations: {
        titre: "Work",
        chapo: "None yet. The first ten projects will fill this page, at 25%\u00a0off.",
        ticket: {
          libelle: "Your number",
          sur: "of",
          rabais: "off the published price",
          ordre: "Served in order of arrival",
          complet: "All ten places are taken.",
        },
        vide: {
          titre: "An empty page, on purpose",
          corps: [
            [
              "I could have invented three mockups",
              "and two testimonials signed “Marie L.”.",
            ],
            [
              "You would have seen it. Everyone does.",
            ],
            [
              "So I will say it plainly: I am starting out,",
              "and this page is waiting for its first real name.",
            ],
          ],
        },
        cadres: {
          cta: "Take number",
        },
        offre: {
          titre: "The trade, both ways",
          corps: "A 25% discount is paid for in something. Here is exactly what, and what I am not asking for.",
          jeDonne: {
            titre: "What I give",
            items: [
              "25% off the published price, applied to the written quote",
              "The same work, the same dated deadline, the same contract",
              "The code and the domain name yours, as for everyone else",
              "One person to talk to, from the first message to delivery",
            ],
          },
          jeDemande: {
            titre: "What I ask",
            items: [
              "Permission to show your project on this page",
              "Two or three sentences on how it went, if you are satisfied. Nothing if you are not.",
              "Nothing else: no exclusivity, no minimum term, no rights over your brand",
            ],
          },
          conditions: {
            titre: "The conditions, in full",
            items: [
              { cle: "Ten projects", texte: "One place per business." },
              { cle: "Published packages", texte: "Monthly care excluded." },
              { cle: "On the quote", texte: "Without a signature, no commitment, from the studio or from you." },
              { cle: "Withdrawable", texte: "Permission to publish ends by email, with no change to the price." },
              { cle: "Not a contest", texte: "No draw, no chance. A discount, in order of arrival." },
            ],
          },
          compteARebours: {
            titre: "The offer ends in",
            jours: "days",
            heures: "hours",
            minutes: "minutes",
            secondes: "seconds",
            terminee: "The launch offer has ended. The prices published on the Pricing page still stand.",
            sansDate: "The closing date will be announced here as soon as it is set.",
          },
          finTitre: "Take your number.",
          ctaNote: "Describe your project in two lines. A reply within 48 hours, with a price and a date.",
        },
      },
      apropos: {
        titre: "About",
        chapo: "The studio's story starts today, in Châteauguay. The rest will be written with its first clients.",
        cahier: {
          lieu: "Châteauguay,",
          page: "Page 1",
        },
        carnet: {
          titre: "The logbook",
          ecrit: {
            titre: "Already written",
            entrees: [
              { titre: "Today, the studio opens in Châteauguay.", corps: "One person, four crafts, no clients to name yet. It is a first line, not a gap." },
              { titre: "Prices are published.", corps: "No quote on request: the packages are listed, in Canadian dollars.", lien: "See pricing" },
              { titre: "The technical base is built.", corps: "I don't start from scratch on each project. That is what makes a firm price and a date hold." },
              { titre: "This site passes its own checks.", corps: "Nine screen widths, two themes, and contrast measured rather than eyeballed." },
            ],
          },
          jamais: {
            titre: "Will never be written",
            entrees: [
              { titre: "A job I can't deliver.", corps: "If your project needs a team, I put one together and lead it. If it goes beyond what I can guarantee, I say so in the first conversation." },
              { titre: "An hourly bill.", corps: "The price is set beforehand, against a written scope." },
              { titre: "Your accounts held hostage.", corps: "Code, domain and hosting are in your name from delivery." },
              { titre: "First place on Google.", corps: "Nobody can promise that. I show you what can be measured." },
            ],
          },
          avenir: {
            titre: "Will be written with you",
            numero: "No.",
            invite: "Your project?",
            note: "The first ten projects are 25% off, in order of arrival.",
            lien: "See the ten places",
          },
        },
        regles: {
          titre: "The logbook's rules",
          items: [
            { titre: "Nothing invented.", corps: "No fake testimonials, no borrowed logos, no decorative counters. What is written here is true, or it isn't written." },
            { titre: "You stay independent.", corps: "The site you receive can be edited without me, and I show you how." },
            { titre: "Checked, not assumed.", corps: "Contrast, legibility, phone and wide screen: checked before every delivery." },
          ],
        },
        fin: {
          titre: "Write the first line.",
          corps: "Describe your project in two lines. I reply within 48 hours with a price and a date.",
          lienPlaces: "See the ten places",
        },
      },
      contact: {
        titre: "Request a quote",
        chapo: "Describe your project in a few lines. I reply within 48 hours with a price and a date, or with the questions I need answered to give them.",
        champs: {
          nom: "Your name",
          entreprise: "Company",
          courriel: "Email",
          telephone: "Phone",
          service: "What you're interested in",
          budget: "Budget in mind",
          message: "Your project in a few lines",
          optionnel: "optional",
        },
        services: ["Website", "Web or mobile app", "Visual identity", "IT or marketing", "Not sure yet"],
        budgets: ["Under $2,000", "$2,000 to $5,000", "$5,000 to $15,000", "Over $15,000", "To be determined"],
        envoyer: "Send the request",
        erreurs: {
          nom: "Please enter your name.",
          courriel: "Please enter a valid email address.",
          message: "Describe your project, even briefly.",
        },
        ouverture: "Your email program will open with the message pre-filled. Check it, then send.",
        viePrivee: "This form sends nothing to this site: it prepares an email in your own software, and nothing reaches me until you send it yourself.",
        viePriveeLien: "What I do with the information I receive",
        direct: "Or write directly to",
        infosTitre: "Details",
        infos: [
          ["Email", "Emiletchesseu@gmail.com"],
          ["Area", "Châteauguay, Montérégie, Greater Montreal"],
          ["Languages", "French and English"],
          ["Response", "Within 48 hours, business days"],
        ],
        couvertureTitre: "On site",
        couvertureVilles:
          "Châteauguay, Mercier, Léry, Sainte-Catherine, Saint-Constant, Candiac, La Prairie, Delson, Kahnawà:ke, Beauharnois, Salaberry-de-Valleyfield — plus the island of Montréal, Longueuil and Brossard.",
        couvertureEnLigneTitre: "Everywhere else",
        couvertureEnLigne:
          "Online. A website or an application is designed and delivered remotely; only meeting in person needs someone nearby.",
        couvertureLegende: "Châteauguay",
      },
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
        { titre: "You talk to the person leading the work", corps: "From first message to delivery, even when a team joins in. No middle layer, no distorted version of your request." },
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
      intro: "Assemble your project: the price and the date work themselves out as you choose. It is the studio's promise, applied to the page.",
      config: {
        etape1: "Your starting point",
        etape2: "Add, if you need it",
        etape3: "After delivery",
        total: "Your project",
        unique: "once, taxes extra",
        parMois: "per month, no commitment",
        livraison: "Delivered on",
        jours: "business days",
        rien: "Pick a starting point to see the price and the date.",
        economie: "instead of",
        cta: "Request this quote",
        ctaNote: "Your selection travels with the message. A reply within 48 hours, with a written quote — that is what commits anyone, not this page.",
        formulaire: "Or use the form instead",
      },
      composition: {
        titre: "What these amounts cover",
        chapo: "The real time each project takes, at a rate that covers a studio's costs: tools, hosting, professional liability insurance, accounting, equipment.",
        recuTitre: "Included in every package",
        items: [
          { titre: "Design and build", detail: "Revisions included" },
          { titre: "French and English", detail: "Both versions, designed together" },
          { titre: "Checks before delivery", detail: "Contrast, legibility, page weight" },
          { titre: "Going live", detail: "Code and domain name transferred into your name" },
        ],
        fraisLibelle: "Fees discovered along the way",
        fraisMontant: "$0",
        comparaisonTitre: "Three years later",
        colonnes: ["Online builder at $60 a month", "Site delivered by the studio"],
        lignes: [
          { cle: "What you have paid", abonnement: "$2,160", studio: "The package price, once" },
          { cle: "What you own", abonnement: "Nothing", studio: "The code, the domain name, the files" },
          { cle: "If you stop paying", abonnement: "The site stops", studio: "The code and the domain stay yours" },
        ],
        hebergement: "Hosting for a delivered site is paid separately: with the host of your choice, or through monthly care.",
      },
      note: "These amounts hold for a project with ordinary characteristics. Anything outside that is priced before it is started, never after. Only a written quote commits the studio.",
      forfaits: [
        { cle: "une-page", type: "base", nom: "One-page site", detail: "Everything you need to exist online: what you do, how to reach you, a form. Bilingual, mobile, Google listing included.", prix: "$2,200", montant: 2200, jours: 10, delai: "10 business days" },
        { cle: "vitrine", type: "base", nom: "Brochure site, 5 pages", detail: "Home, services, work, about, contact. Bilingual, and you edit the content yourself.", prix: "$4,200", montant: 4200, jours: 18, delai: "18 business days" },
        { cle: "identite", type: "base", nom: "Visual identity", detail: "Logo, palette, typography, applications and usage guide. Source files delivered.", prix: "$2,200", montant: 2200, jours: 9, delai: "9 business days" },
        { cle: "identite-vitrine", type: "base", nom: "Identity + brochure site", detail: "Both run as one project, which removes a good share of the back-and-forth. That is what funds the saving.", prix: "$5,600", montant: 5600, avant: 6400, jours: 24, delai: "24 business days" },
        { cle: "cadrage", type: "base", nom: "Application scoping", detail: "Written scope, clickable mockup, firm quote. Deducted from the project if it goes ahead.", prix: "$1,500", montant: 1500, jours: 5, delai: "5 business days" },
        { cle: "redaction", type: "option", nom: "Writing your copy", detail: "You tell me what you do, I write the pages.", prix: "$600", montant: 600, jours: 3, delai: "+3 days" },
        { cle: "pages", type: "option", nom: "Two more pages", detail: "A detailed service page, a team page, whatever you need.", prix: "$850", montant: 850, jours: 4, delai: "+4 days" },
        { cle: "google", type: "option", nom: "Google Business listing", detail: "Created, filled in and tuned for local search.", prix: "$250", montant: 250, jours: 1, delai: "+1 day" },
        { cle: "formation", type: "option", nom: "Training, two hours", detail: "In person in Châteauguay or remote, so the site lives without me.", prix: "$200", montant: 200, jours: 1, delai: "+1 day" },
        { cle: "suivi", type: "suivi", nom: "Monthly care", detail: "Hosting, domain, backups, monitoring, and forty-five minutes of changes a month.", prix: "$125 / month", montant: 125, jours: 0, delai: "no commitment" },
      ],
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
        { n: "01", quand: "Today", titre: "We talk", corps: "30 minutes, in person or by video. You describe your business and what you need. No commitment." },
        { n: "02", quand: "Within 48 hours", titre: "You get a price and a date", corps: "In writing, within 48 hours. The amount is firm, and so is the date." },
        { n: "03", quand: "From day one", titre: "I build, you watch it happen", corps: "A preview link from day one. You comment as it goes, not at the end." },
        { n: "04", quand: "On the date in the quote", titre: "I hand it over", corps: "The site is yours. One hour of training so you can edit it on your own." },
      ],
    },
    contact: {
      titre: "Let's talk about your project",
      corps:
        "Describe in two lines what you want to build. I reply within 48 hours with a price and a date, or with the questions I need answered to give them.",
      courriel: "Send an email",
      note: "Châteauguay, Quebec · French and English",
    },
    seo: {
      "": {
        titre: "Studio Sentis — websites and branding in Châteauguay",
        description:
          "Websites, applications and visual identity in Châteauguay. A price and a date from the first conversation, one person from logo to delivery.",
      },
      "/services": {
        titre: "Websites, apps and branding — Studio Sentis",
        description:
          "Four crafts, one person: bilingual websites, custom applications, visual identity and monthly care. Prices published. Châteauguay and Montérégie, Quebec.",
      },
      "/realisations": {
        titre: "Launch offer: ten places — Studio Sentis",
        description:
          "No work to show, and the studio would rather say so. The first ten projects are 25% off, in exchange for the right to publish them. Full conditions.",
      },
      "/a-propos": {
        titre: "About the studio, in Châteauguay — Studio Sentis",
        description:
          "A Châteauguay studio that is starting out and would rather say so: why it exists, how it works, and what it refuses to promise before having done it.",
      },
      "/contact": {
        titre: "Request a quote — Studio Sentis",
        description:
          "Describe your project in a few lines. A reply within 48 hours with a price and a date. Châteauguay, Montérégie, Greater Montreal and remote.",
      },
      "/mentions-legales": {
        titre: "Legal notice — Studio Sentis",
        description:
          "Who publishes this site, what the work section shows, what the published prices commit anyone to, and the law that applies in Quebec.",
      },
      "/confidentialite": {
        titre: "Privacy policy — Studio Sentis",
        description:
          "This site measures nothing, tracks no one and receives no data. How to check that, and what happens to information sent by email.",
      },
    },
    testSite: {
      titre: "Does your current site hold up?",
      chapo: "Enter its address. Google loads it the way a phone would and measures its speed, its accessibility and what search engines see. Allow about thirty seconds.",
      label: "Your site's address",
      placeholder: "your-business.ca",
      bouton: "Test my site",
      enCours: "Testing… Google is loading your site the way a phone would.",
      vide: "The scores will appear here, from 0 to 100, with what they mean.",
      categories: {
        performance: "Speed",
        accessibility: "Accessibility",
        "best-practices": "Best practices",
        seo: "Search",
      },
      mesures: {
        lcp: "Main content displayed",
        cls: "Layout stability",
        https: "Secure connection (HTTPS)",
      },
      oui: "Yes",
      non: "No",
      verdicts: { bon: "Good", moyen: "Needs work", faible: "Poor" },
      erreurs: {
        adresse: "That address does not look valid. Try, for example: your-business.ca",
        service: "Google could not test this site right now: too many requests, or the site is unreachable. Try again in a minute.",
      },
      resultatPour: "Result for",
      lienGoogle: "Run the test on Google's site",
      variation: "Scores vary a little from one test to the next.",
      conclusionBon: "Your site holds up well. If it needs to grow, let's talk.",
      conclusionMoyen: "These scores can be fixed, and they are often what costs you visitors on phones.",
      cta: "Request a quote",
      viePrivee: "The address you enter is sent to Google PageSpeed Insights, which runs the test. Nothing is sent to this site.",
      source: "Test: Google PageSpeed Insights, on mobile.",
    },
    temoins: {
      livraison: {
        titre: "If we started today",
        colonnes: ["Package", "Price", "Delivered"],
        note: "In business days. The firm date is the one on the written quote.",
      },
      reponse: {
        titre: "If you write now",
        heure: "in Châteauguay",
        avant: "Reply by",
        note: "Within 48 hours, business days.",
      },
    },
    pied: {
      droits: "Studio Sentis — Châteauguay, Quebec",
      legal: "Legal",
      mentions: "Legal notice",
      confidentialite: "Privacy policy",
    },
  },
} as const;

export type Dict = (typeof DICT)[Locale];

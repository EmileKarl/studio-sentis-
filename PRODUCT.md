# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + Tailwind CSS, choisi par le client. Raison retenue : le serveur MCP
Magic UI déjà installé sur ce dépôt sert des composants React + Tailwind +
shadcn/ui, donc cette stack rend l'outillage en place immédiatement utilisable.
Cible de déploiement non décidée.

## Users

Trois profils, sur un seul site :

- **Particuliers** — besoin ponctuel et concret (dépannage informatique, site
  vitrine simple, travail graphique). Rarement à l'aise avec le vocabulaire
  technique.
- **Commerçants** — activité indépendante, temps limité, décision rapide et
  souvent seule.
- **TPE/PME** — structure constituée, décision parfois à plusieurs, attentes de
  sérieux et de continuité.

Le point commun confirmé est l'absence de culture technique dominante : aucun de
ces profils n'a été décrit comme acheteur technique.

## Product Purpose

Agence de services numériques que le client veut lancer. Activités annoncées :
développement mobile, développement web, design graphique, informatique
générale, marketing.

L'entreprise n'est pas encore ouverte. Le site est l'acte de lancement, pas la
vitrine d'une activité déjà en cours.

## Positioning

**Proposé, en attente de validation du client.** Recommandé par l'assistant ;
rien n'est encore confirmé par le client. À valider avant toute rédaction
définitive.

> Le prix et la date, dès le premier échange. Un seul interlocuteur, du logo à
> l'application.

**Mécanisme.** Les trois engagements retenus par le client — prix annoncé
d'avance, interlocuteur unique, délai court et daté — forment une seule
promesse : la suppression de l'incertitude. Le secteur répond « devis sur
demande » ; l'inverse est une position tenable.

Elle n'est crédible que parce qu'une base réutilisable existe déjà (NEXUS UI) :
un prix ferme et un délai court reposent sur elle. C'est ce qu'un concurrent ne
peut pas revendiquer sans l'avoir construite.

**La largeur de l'offre devient l'argument.** « Un seul interlocuteur pour
l'identité, le site et l'application » est précisément ce qu'une agence
spécialisée ne peut pas promettre.

**Concurrent de référence : les constructeurs en ligne** (Wix, Shopify,
générateurs IA), très répandus chez les petites entreprises québécoises. C'est l'alternative que les clients visés envisagent
réellement, et la seule face à laquelle ces trois engagements gagnent au lieu
d'égaliser. Le site doit répondre explicitement à : pourquoi payer quelqu'un
plutôt qu'utiliser un outil à 15 €/mois.

## Offre

Trois missions retenues comme prioritaires par le client, sans hiérarchie entre
elles :

1. Sites vitrines pour commerces et petites structures.
2. Applications web et mobile sur mesure.
3. Identité visuelle et design graphique.

L'informatique générale et le marketing restent dans le périmètre (voir
« Product Purpose ») mais ne portent pas la communication.

## Tarifs

Une grille de forfaits est **proposée** dans [`docs/offre.md`](docs/offre.md),
en dollars canadiens. Elle n'est ni validée par le client ni vérifiée contre le
marché local, et ce document dit ce qu'il faut faire avant de l'afficher.

Deux points de fond y sont tranchés : le sur-mesure passe par un **cadrage
payant à prix fixe** plutôt que par un forfait impossible à tenir, et
l'autonomie du client est **incluse** — décision encore à confirmer.

## Engagements

Confirmés par le client, donc affichables :

- **Prix annoncé d'avance**, pas de « devis sur demande ».
- **Un seul interlocuteur**, du premier contact à la livraison.
- **Délai court et daté** dès le devis.

Recommandés en complément, non encore confirmés :

- **Autonomie du client** — site modifiable seul, avec prise en main. C'est la
  réponse directe à la principale objection des constructeurs en ligne ; sans
  elle, ils gagnent sur cet axe.
- **Propriété du travail** — le client possède son code et son nom de domaine,
  il n'est pas locataire d'une plateforme à abonnement croissant.
- **Vérification systématique avant livraison** — contrastes, lisibilité, neuf
  largeurs d'écran. Le pipeline existe déjà dans ce dépôt
  (`npm run verify`), donc l'affirmation est démontrable et non déclarative.

## Operating Context

**Implantation : Châteauguay, Québec** (Montérégie, Rive-Sud de Montréal).
Confirmé par le client.

**Marché visé — proposé, à valider.** Châteauguay et la Montérégie en priorité
affichée, le Grand Montréal comme marché réel, le reste du Québec à distance.
La proximité reste le contre-argument le plus fort face aux constructeurs en
ligne.

**Devise : dollar canadien (CAD).** Tout prix affiché doit l'être en CAD, taxes
mentionnées selon l'usage québécois.

**Contexte linguistique — spécifique au Québec, et déterminant.** Les
communications commerciales, sites web compris, sont encadrées par la Charte de
la langue française (renforcée par la Loi 96). Le français n'est donc pas une
préférence éditoriale mais une obligation, et l'anglais représente une audience
réelle dans le Grand Montréal, pas une hypothèse.

Conséquences :

1. Le site Sentis doit être bilingue dès la v1, français prioritaire.
2. Tout site livré à un client québécois hérite de la même contrainte : c'est
   un paramètre de conception, pas une option de fin de projet.
3. **Cela constitue un avantage à part entière** (à valider) : un constructeur
   en ligne ou une agence hors Québec ne connaît pas ces règles et n'aide pas
   le client à s'y conformer. Les seuils exacts sont à vérifier auprès de
   l'OQLF avant toute affirmation publique — ne rien écrire de juridique sans
   cette vérification.

**Contact : Emiletchesseu@gmail.com**, confirmé par le client. Le site propose
aujourd'hui un lien courriel et non un formulaire ; un formulaire capterait les
personnes qui n'ont pas de client de messagerie configuré, mais il exige un
service d'envoi qui n'est pas encore choisi.

**Nom de domaine : non choisi.** Il n'est écrit nulle part dans le code ; le
site reste non indexable tant qu'il n'est pas fourni (voir README).

Modalités de devis et canaux d'acquisition restent à définir.

## Capabilities and Constraints

- Cinq domaines de service sous une seule marque, à présenter sans que l'offre
  devienne illisible.
- **Bilingue français + anglais dès le départ.** Contrainte structurelle : la
  mise en page doit absorber les écarts de longueur entre les deux langues, et
  l'internationalisation ne peut pas être ajoutée après coup.
  *État : non tenue sur NEXUS UI*, qui est en français seul sans infrastructure
  i18n — dette consignée dans `docs/audit.md`.
  *Pour le site Sentis : bilingue dès la v1, français prioritaire.* Une
  recommandation antérieure proposait de publier en français seul et de
  différer l'anglais ; elle reposait sur un marché français supposé et tombe
  avec l'implantation québécoise. Voir « Operating Context ».
- Entreprise non encore ouverte : ni forme juridique, ni tarifs, ni délais, ni
  zone d'intervention confirmés.
- Périmètre exact de chaque service non décidé.

## Brand Commitments

- Nom **Sentis** acquis. La forme exacte retenue publiquement (« Sentis » ou
  « Studio Sentis ») reste à confirmer ; `studio-sentis-` n'est qu'un nom de
  dépôt.
- Logo, palette et typographie **non définis**, explicitement reportés par le
  client. Aucune identité visuelle ne doit être figée comme acquise avant cette
  décision.
- Voix de marque non établie.

## Premier projet — NEXUS UI

Le cahier des charges `NEXUS_UI_Cahier_des_Charges.txt` (v1.0) définit le
premier projet de l'agence : un *digital starter kit*, à la fois infrastructure
technique des projets suivants et pièce de portfolio.

Ce dépôt **est** NEXUS UI. Le site de l'agence Studio Sentis n'est pas encore
construit ; il se bâtira sur cette base.

Ce choix répond directement à l'absence de preuve ci-dessous : une agence sans
portfolio construit d'abord la démonstration de son propre savoir-faire.

Niveau 1 (Foundation) livré et vérifié. Voir `docs/audit.md`.

## Evidence on Hand

**Aucune preuve client.** Confirmé explicitement :

- aucun projet client livré ;
- aucun témoignage, aucune étude de cas, aucune référence nommable ;
- aucun chiffre, aucune ancienneté, aucune récompense ;
- aucun logo client à afficher.

La seule pièce montrable est NEXUS UI lui-même, et elle vaut ce que vaut son
exécution.

Tout travail futur doit traiter cette absence comme un fait durable jusqu'à
information contraire. Ne pas fabriquer de témoignages, de logos clients, de
compteurs (« +50 projets »), de notes d'avis ni de références de substitution.

## Product Principles

1. **Le site est la seule preuve disponible.** Sans portfolio ni témoignage, sa
   propre exécution est l'argument commercial. Ce qui serait ailleurs un détail
   de finition est ici la démonstration.
2. **Une offre large se vend par la lisibilité, pas par l'accumulation.** Cinq
   domaines sous une marque : le risque dominant est le flou, jamais le manque.
3. **Ne jamais combler l'absence de preuve par de la preuve inventée.** Le
   recours réflexe du site d'agence débutante — faux logos clients, témoignages
   génériques, compteurs — est interdit ici.
4. **Trois audiences, un seul registre.** Particuliers, commerçants et TPE/PME
   n'achètent pas de la même façon, mais aucun n'est un acheteur technique : le
   langage reste concret et non jargonnant pour tous.
5. **Le bilinguisme est une contrainte de conception, pas une option.** Toute
   décision de mise en page doit tenir en français et en anglais.

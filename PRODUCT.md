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

**Non décidé.** Aucun mécanisme ou revendication distinctive n'a été établi à ce
stade. Le périmètre de services seul ne constitue pas un positionnement — il est
partagé par la plupart des agences généralistes.

À trancher avant tout travail de rédaction ou de mise en avant. Ne rien inventer
ici en attendant.

## Operating Context

Non établi. Zone géographique, mode de prise de contact, modalités de devis et
canaux d'acquisition restent à définir.

## Capabilities and Constraints

- Cinq domaines de service sous une seule marque, à présenter sans que l'offre
  devienne illisible.
- **Bilingue français + anglais dès le départ.** Contrainte structurelle : la
  mise en page doit absorber les écarts de longueur entre les deux langues, et
  l'internationalisation ne peut pas être ajoutée après coup.
  *État : non tenue.* NEXUS UI est en français uniquement et aucune
  infrastructure i18n n'est posée — dette connue, consignée dans
  `docs/audit.md`.
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

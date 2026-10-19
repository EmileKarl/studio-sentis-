# -*- coding: utf-8 -*-
"""
Fabrique le corpus d'expressions de recherche de Studio Sentis.

    python3 scripts/seo/termes.py

Il ecrit `docs/seo/termes.csv` : une ligne par expression, avec sa famille,
son intention et sa portee geographique.

**Ce que ce fichier est, et ce qu'il n'est pas.** C'est une grammaire
combinatoire : un verbe, un objet, une precision, un lieu, un secteur. Elle
produit mecaniquement des dizaines de milliers d'expressions. Une partie
seulement correspond a des recherches reelles — personne ne tape la plupart
de ces chaines. Le volume ne se devine pas : il se releve dans le Planificateur
de mots-cles de Google Ads (gratuit avec un compte) ou dans Search Console une
fois le site verifie. Tant que ce relevement n'est pas fait, aucune de ces
lignes ne doit etre presentee comme « un mot-cle a fort volume ».

Son usage : le coller dans un outil de volumes, garder ce qui remonte, et
donner a chaque groupe survivant **une page qui parle de ca**. Pas en saupoudrer
les textes existants : Google classe des pages, pas des listes de mots.
"""
import csv, gzip, os

RACINE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SORTIE = os.path.join(RACINE, "docs", "seo", "termes.csv")

# --- Les lieux ------------------------------------------------------------
# Du plus proche au plus large. Les premiers sont peu cherches mais faciles a
# gagner ; les derniers sont l'inverse. Un studio qui commence vise les
# premiers.
VILLES = [
    "Châteauguay", "Mercier", "Léry", "Beauharnois", "Sainte-Martine",
    "Saint-Isidore", "Saint-Urbain-Premier", "Howick", "Ormstown",
    "Saint-Constant", "Delson", "Candiac", "La Prairie", "Sainte-Catherine",
    "Saint-Philippe", "Kahnawake", "Salaberry-de-Valleyfield", "Vaudreuil-Dorion",
    "Brossard", "Longueuil", "Saint-Jean-sur-Richelieu", "Saint-Rémi",
]
REGIONS = [
    "Montérégie", "Rive-Sud", "Rive-Sud de Montréal", "Grand Montréal",
    "Montréal", "Vallée-du-Haut-Saint-Laurent", "Roussillon", "Québec",
]
LIEUX = [("ville", v) for v in VILLES] + [("région", r) for r in REGIONS]

# --- Les secteurs ---------------------------------------------------------
# Ce sont les clients plausibles d'un studio de Châteauguay : des commerces et
# des metiers de service, pas des start-up.
SECTEURS = [
    "restaurant", "café", "boulangerie", "traiteur", "microbrasserie",
    "salon de coiffure", "barbier", "institut de beauté", "spa",
    "clinique dentaire", "clinique de physiothérapie", "massothérapeute",
    "chiropraticien", "optométriste", "vétérinaire", "clinique médicale",
    "garage automobile", "carrosserie", "concessionnaire",
    "entrepreneur en construction", "entrepreneur général", "couvreur",
    "plombier", "électricien", "paysagiste", "déneigement", "excavation",
    "rénovation", "ébéniste", "designer d'intérieur",
    "avocat", "notaire", "comptable", "courtier immobilier", "courtier hypothécaire",
    "assurances", "agence de voyage", "école de musique", "garderie", "CPE",
    "gym", "studio de yoga", "entraîneur privé", "photographe", "vidéaste",
    "fleuriste", "boutique", "quincaillerie", "épicerie fine", "camionnage",
    "transport", "déménagement", "OBNL", "organisme communautaire",
    "travailleur autonome", "PME", "commerce de détail", "artisan",
]

# --- Les quatre familles --------------------------------------------------
# `base` : le coeur de l'expression. `intention` : ce que la personne veut.
#   decouverte  — elle s'informe, elle n'achete pas encore
#   comparaison — elle compare des options, des prix, des prestataires
#   action      — elle est prete a demander une soumission
FAMILLES = {
    "logo": {
        "decouverte": [
            "c'est quoi un logo vectoriel", "différence logo et identité visuelle",
            "combien de temps pour créer un logo", "qu'est-ce qu'un logo mémorable",
            "logo noir et blanc pourquoi", "fichiers à demander pour un logo",
            "qui est propriétaire du logo", "droits d'auteur logo Québec",
            "logo fait par intelligence artificielle", "éviter un logo générique",
            "combien de propositions de logo", "logo et marque de commerce",
        ],
        "comparaison": [
            "prix création de logo", "tarif logo entreprise", "combien coûte un logo",
            "coût logo professionnel", "logo pas cher ou professionnel",
            "graphiste ou plateforme en ligne pour un logo",
            "logo 99designs vs graphiste local", "forfait logo entreprise",
            "logo inclus avec site web", "refaire son logo ou le garder",
        ],
        "action": [
            "création de logo", "créer un logo d'entreprise", "faire faire un logo",
            "concepteur de logo", "designer de logo", "graphiste pour logo",
            "logo professionnel sur mesure", "refonte de logo",
            "redesign de logo", "logo pour nouvelle entreprise",
            "logo et carte d'affaires", "logo vectoriel professionnel",
        ],
    },
    "charte-graphique": {
        "decouverte": [
            "qu'est-ce qu'une charte graphique", "à quoi sert une charte graphique",
            "différence charte graphique et identité visuelle",
            "que contient une charte graphique", "normes graphiques définition",
            "pourquoi une charte graphique pour une PME",
            "couleurs de marque comment choisir", "police de caractère pour une marque",
            "charte graphique et accessibilité des couleurs",
            "guide de marque exemple", "zone de protection d'un logo",
        ],
        "comparaison": [
            "prix charte graphique", "coût d'une identité visuelle complète",
            "charte graphique simple ou complète", "identité visuelle forfait PME",
            "charte graphique incluse dans un site web",
        ],
        "action": [
            "charte graphique", "créer une charte graphique",
            "faire une charte graphique", "identité visuelle",
            "création d'identité visuelle", "image de marque entreprise",
            "branding PME", "guide de normes graphiques",
            "refonte d'image de marque", "papeterie d'entreprise",
            "gabarits de réseaux sociaux pour entreprise",
        ],
    },
    "site-web": {
        "decouverte": [
            "combien de pages pour un site vitrine", "site web ou page Facebook",
            "à quoi sert un site web pour un commerce",
            "qu'est-ce qu'un site vitrine", "nom de domaine comment choisir",
            "hébergement de site web c'est quoi", "site web rapide pourquoi",
            "site web adapté aux téléphones", "site web bilingue au Québec",
            "loi 25 et site web", "accessibilité d'un site web",
            "combien de temps pour faire un site web", "qui est propriétaire de mon site",
            "site web sans abonnement mensuel",
        ],
        "comparaison": [
            "prix création site web", "combien coûte un site web",
            "tarif site web PME Québec", "site web Wix ou sur mesure",
            "WordPress ou site sur mesure", "Squarespace ou agence",
            "agence web ou travailleur autonome", "soumission site web",
            "refonte de site web prix", "site web avec ou sans entretien",
            "coût entretien site web par mois",
        ],
        "action": [
            "création de site web", "conception de site web", "faire un site web",
            "site web pour entreprise", "site vitrine", "site web PME",
            "refonte de site web", "site web bilingue",
            "boutique en ligne", "site transactionnel", "site e-commerce",
            "développeur web", "concepteur de site web", "agence web",
            "page d'atterrissage", "site web une page",
            "site web clé en main", "site web sur mesure",
        ],
    },
    "application": {
        "decouverte": [
            "différence application web et application mobile",
            "application native ou web", "combien de temps pour faire une application",
            "publier une application sur l'App Store", "coût de publication Google Play",
            "application mobile pour une PME ça sert à quoi",
            "application interne pour employés", "progressive web app c'est quoi",
        ],
        "comparaison": [
            "prix application mobile", "combien coûte une application",
            "application sur mesure ou logiciel existant",
            "développeur d'applications indépendant ou agence",
            "coût entretien application mobile",
        ],
        "action": [
            "application mobile", "développement d'application mobile",
            "créer une application mobile", "application iOS et Android",
            "application web sur mesure", "développeur d'applications",
            "application de prise de rendez-vous", "application de gestion interne",
            "outil web sur mesure", "logiciel sur mesure PME",
            "automatisation de tâches pour PME", "tableau de bord sur mesure",
        ],
    },
}

# --- Les precisions -------------------------------------------------------
# Elles s'ajoutent a une expression d'action et portent une vraie intention.
PRECISIONS = [
    "", "prix", "tarif", "soumission", "pas cher", "professionnel",
    "sur mesure", "rapide", "bilingue", "français", "clé en main",
    "pour PME", "pour petite entreprise", "pour travailleur autonome",
    "pour commerce local", "pour OBNL", "sans abonnement",
    "avec prix affiché", "livré en 3 semaines",
]

def lignes():
    vues = set()
    for famille, intentions in FAMILLES.items():
        for intention, bases in intentions.items():
            for base in bases:
                # 1. l'expression nue
                yield from unique(vues, famille, intention, "aucune", base)
                # 2. l'expression + un lieu — mais seulement quand le lieu a du
                #    sens. Personne ne tape « qu'est-ce qu'une charte graphique
                #    Beauharnois » : une question de decouverte n'a pas de
                #    ville. Les croiser gonflait le corpus de dizaines de
                #    milliers de chaines que personne n'ecrira jamais.
                if intention in ("action", "comparaison"):
                    for portee, lieu in LIEUX:
                        yield from unique(vues, famille, intention, portee, f"{base} {lieu}")
                if intention != "action":
                    continue
                # 3. action + precision, puis + lieu
                for p in PRECISIONS:
                    # Une precision deja contenue dans la base donnerait
                    # « logiciel sur mesure PME sur mesure ».
                    if not p or p in base:
                        continue
                    exp = f"{base} {p}"
                    yield from unique(vues, famille, intention, "aucune", exp)
                    for portee, lieu in LIEUX:
                        yield from unique(vues, famille, intention, portee, f"{exp} {lieu}")
                # 4. action + secteur, puis + lieu. Une base qui contient
                #    deja « pour » est ecartee : « gabarits pour entreprise
                #    pour café » n'est pas une expression, c'est un defaut de
                #    fabrication.
                if " pour " in base:
                    continue
                for s in SECTEURS:
                    exp = f"{base} pour {s}"
                    yield from unique(vues, famille, intention, "aucune", exp)
                    for portee, lieu in LIEUX:
                        yield from unique(vues, famille, intention, portee, f"{exp} {lieu}")

def unique(vues, famille, intention, portee, expression):
    e = " ".join(expression.split())
    if e in vues:
        return
    vues.add(e)
    yield {"expression": e, "famille": famille, "intention": intention,
           "portée": portee, "mots": len(e.split())}

# Le corpus entier fait une dizaine de megaoctets : il part compresse, pour ne
# pas alourdir chaque clone du depot. `gunzip` le rouvre, ou ce script le
# refabrique.
SORTIE_GZ = SORTIE + ".gz"
PRIORITAIRE = os.path.join(os.path.dirname(SORTIE), "termes-prioritaires.csv")

# L'extrait prioritaire : ce sur quoi un studio qui commence peut reellement
# gagner. On garde les expressions nues, celles des quatre villes les plus
# proches, et les deux regions utiles — pas les 22 villes, qui ne feraient que
# gonfler le fichier sans rien apporter a la decision.
LIEUX_UTILES = {"Châteauguay", "Mercier", "Léry", "Beauharnois",
                "Montérégie", "Rive-Sud", "Grand Montréal"}

def prioritaire(l):
    """Ce qu'un humain peut reellement trancher en une seance.

    On ecarte les croisements par secteur — « création de logo pour
    restaurant » — non parce qu'ils sont mauvais, au contraire : c'est de la
    longue traine qui convertit bien. Mais ils se decident **apres**, une fois
    qu'une page de service existe et qu'on sait quel secteur appelle. Les
    garder ici noierait les 150 expressions qui decident de l'architecture du
    site."""
    e = l["expression"]
    if " pour " in e:
        return False
    if l["portée"] == "aucune":
        return True
    return any(e.endswith(v) for v in LIEUX_UTILES)

os.makedirs(os.path.dirname(SORTIE), exist_ok=True)
champs = ["expression", "famille", "intention", "portée", "mots"]
n = mots = 0
par_famille = {}
nP = 0
with gzip.open(SORTIE_GZ, "wt", encoding="utf-8", newline="") as fz, \
     open(PRIORITAIRE, "w", encoding="utf-8", newline="") as fp:
    wz = csv.DictWriter(fz, fieldnames=champs); wz.writeheader()
    wp = csv.DictWriter(fp, fieldnames=champs); wp.writeheader()
    for l in lignes():
        wz.writerow(l)
        n += 1
        mots += l["mots"]
        par_famille[l["famille"]] = par_famille.get(l["famille"], 0) + 1
        if prioritaire(l):
            wp.writerow(l)
            nP += 1

print(f"{n} expressions · {mots} mots · {SORTIE_GZ}")
print(f"{nP} expressions prioritaires · {PRIORITAIRE}")
for k, v in sorted(par_famille.items(), key=lambda x: -x[1]):
    print(f"  {k:<18} {v}")

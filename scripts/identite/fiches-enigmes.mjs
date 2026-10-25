/**
 * La seconde vague : des fiches qui demandent à réfléchir.
 *
 * La première vague posait des questions de métier auxquelles on répond en
 * dix secondes. Celle-ci vise plus haut : des histoires de six mots, des
 * énigmes de situation, de la logique, du développement, de la perception,
 * des paradoxes.
 *
 * ## Les six mots
 *
 * Le modèle est la nouvelle attribuée à Hemingway — « For sale: baby shoes,
 * never worn. » Six mots, une vie entière, et un trou que le lecteur comble
 * tout seul. C'est ce trou qui fait écrire les gens.
 *
 * Elle n'est pas reprise ici : elle est trop connue pour intriguer, et la
 * recopier serait emprunter une émotion qu'on n'a pas fabriquée. Les
 * trente-huit qui suivent sont écrites pour ce studio. La moitié parle du
 * métier, l'autre non — une série qui ne parlerait que de logos cesserait
 * vite d'être une histoire pour redevenir une publicité.
 *
 * **Six mots, exactement.** Pas « environ six ». Le compte est vérifié à
 * l'import : une histoire de sept mots arrête le script au lieu de partir à
 * l'impression. Un mot est une suite de lettres ou de chiffres, apostrophes
 * et traits d'union compris — « l'album » et « surprenez-moi » comptent pour
 * un.
 *
 * ## Les énigmes de situation et de logique
 *
 * Beaucoup sont des classiques du folklore, pas des inventions : la voiture
 * poussée devant l'hôtel, les deux gardiens, les trois portes. C'est voulu.
 * Une énigme connue de la moitié des gens est **meilleure** pour un statut
 * qu'une énigme inédite : ceux qui la savent répondent pour le plaisir de
 * savoir, les autres cherchent. Dans les deux cas, ils écrivent.
 *
 * `REPONSES.md` dit lesquelles sont des classiques.
 *
 * ## Les fiches de développement
 *
 * Tous les nombres qui y figurent sont calculables et ont été recalculés :
 * les 42 pliages, les 192 chiffres d'un livre de cent pages, les 45 poignées
 * de main, les 16 777 216 couleurs. Aucun n'est repris de mémoire.
 */

/** Un mot : lettres ou chiffres, apostrophes et traits d'union inclus. */
const MOT = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;
export const compterMots = (t) => (t.match(MOT) ?? []).length;

const six = (t) => {
  const n = compterMots(t);
  if (n !== 6) throw new Error(`« ${t} » fait ${n} mots, pas 6`);
  return t;
};

/**
 * Trente-huit histoires de six mots. La moitié tient au métier, l'autre non.
 * Elles ne s'expliquent pas : c'est tout leur intérêt.
 */
export const SIXMOTS = [
  "Logo livré. Client ravi. Facture impayée.",
  "Site magnifique. Aucun visiteur. Trois ans.",
  "Enseigne neuve. Rue déserte. Loyer impayé.",
  "Il répondait toujours. Plus personne n'appelle.",
  "Deux logos proposés. Il voulait trois.",
  "Cartes imprimées. Numéro de téléphone faux.",
  "Vingt ans d'enseigne. Trois mots effacés.",
  "Refonte terminée. L'ancien site manquait déjà.",
  "Il a choisi la police gratuite.",
  "Boutique fermée. Le site tourne encore.",
  "Mon premier client. Toujours le mien.",
  "Elle a gardé la première maquette.",
  "Devis gratuit. Réponse immédiate. Silence depuis.",
  "Nouveau logo. Les habitués hésitent encore.",
  "Il voulait moderne. Il voulait 1998.",
  "Un seul client. Vingt ans ensemble.",
  "Le camion roule. Personne ne lit.",
  "Affiche parfaite. Date de l'événement oubliée.",
  "Il a signé sans lire. Évidemment.",
  "Trois polices. Aucune ne se parle.",
  "Site rapide. Message clair. Toujours rien.",
  "Elle voulait un logo. Pas seulement.",
  "Atelier vide. Photos superbes. Clients absents.",
  "Il imprime encore ses anciennes cartes.",
  "Mon logo sur sa vitrine. Enfin.",
  "Projet livré vendredi. Entreprise fermée lundi.",
  "Il a tout refusé. Puis rappelé.",
  "La maquette plaisait. Le budget non.",
  "Première commande. Dix ans de retard.",
  "Couleur choisie au téléphone. Mauvaise idée.",
  "Nom déposé. Domaine pris. Recommencer demain.",
  "Il disait : surprenez-moi. Puis il refusait.",
  "Deux tasses servies. Une encore pleine.",
  "Il a gardé la clé. Longtemps.",
  "Billet aller acheté. Retour jamais utilisé.",
  "Le chien attend encore la porte.",
  "Elle a souri. Puis fermé l'album.",
  "Lumière allumée. Personne. Depuis trois jours.",
].map(six);

/**
 * Énigmes de situation. Une mise en place, une pointe, une réponse qui fait
 * dire « ah ». Les classiques sont signalés dans REPONSES.md.
 */
export const LATERALES = [
  ["Un homme pousse sa voiture jusqu'à un hôtel et annonce aussitôt qu'il est ruiné.",
   "Pourquoi ?",
   "Il joue au Monopoly. Classique du folklore."],
  ["Un homme entre dans un bar et demande un verre d'eau. Le barman sort un fusil. L'homme le remercie et s'en va.",
   "Que s'est-il passé ?",
   "Il avait le hoquet. La peur l'a guéri, l'eau n'était plus nécessaire. Classique."],
  ["On retrouve un homme sans vie au milieu d'un champ. À côté de lui, un paquet fermé.",
   "Que contenait le paquet ?",
   "Un parachute qui ne s'est pas ouvert. Classique."],
  ["Une femme appuie sur un interrupteur. Des dizaines de personnes meurent.",
   "Qui est-elle ?",
   "La gardienne d'un phare : elle l'a éteint. Classique."],
  ["Deux hommes disputent cinq parties d'échecs. Chacun en gagne trois. Aucune n'est nulle.",
   "Comment ?",
   "Ils ne jouaient pas l'un contre l'autre. Classique."],
  ["Un homme habite au vingtième étage. Il prend l'ascenseur jusqu'au dixième et monte le reste à pied — sauf les jours de pluie.",
   "Pourquoi ?",
   "Il est trop petit pour atteindre le bouton du vingtième. Les jours de pluie, il a son parapluie. Classique."],
  ["Antoine et Cléopâtre gisent sans vie sur le plancher, entourés d'eau et de verre brisé.",
   "Que s'est-il passé ?",
   "Ce sont des poissons rouges : le bocal est tombé. Classique."],
  ["Un homme regarde une photographie et déclare : je n'ai ni frère ni sœur, mais le père de cet homme est le fils de mon père.",
   "Qui est sur la photo ?",
   "Son fils. Classique."],
  ["Un chasseur marche dix kilomètres vers le sud, dix vers l'est, dix vers le nord, et se retrouve à son point de départ. Il aperçoit un ours.",
   "De quelle couleur est l'ours ?",
   "Blanc : il est au pôle Nord. Classique."],
  ["Un avion s'écrase exactement sur la frontière entre deux pays.",
   "Où enterre-t-on les survivants ?",
   "Nulle part : on n'enterre pas les survivants. Classique."],
  ["Un fermier possède dix-sept moutons. Tous meurent sauf neuf.",
   "Combien lui en reste-t-il ?",
   "Neuf. « Tous sauf neuf » dit déjà la réponse. Classique."],
  ["Deux pères et deux fils partent à la pêche. Ils attrapent trois poissons et chacun en rapporte un.",
   "Comment est-ce possible ?",
   "Ils sont trois : un grand-père, un père, un fils. Classique."],
  ["Vous dépassez le deuxième coureur d'une course.",
   "À quelle place êtes-vous ?",
   "Deuxième. La plupart répondent premier. Classique."],
  ["Il a plu sans arrêt pendant la nuit. Le lendemain matin, le soleil brillait.",
   "Y aura-t-il du soleil soixante-douze heures plus tard ?",
   "Non : soixante-douze heures plus tard, il fera nuit. Classique."],
  ["Plus on lui en enlève, plus il devient grand.",
   "Qu'est-ce que c'est ?",
   "Un trou. Classique."],
  ["Je parle toutes les langues sans en avoir appris aucune.",
   "Qui suis-je ?",
   "L'écho. Classique."],
  ["Plus il sèche, plus il est mouillé.",
   "Qu'est-ce que c'est ?",
   "La serviette. Classique."],
  ["Un homme est né un 29 février 1944 et a fêté son dix-huitième anniversaire en 2016.",
   "Comment ?",
   "Son jour de naissance ne revient que les années bissextiles : 1948, 1952… 2016 est la dix-huitième."],
  ["Un client approuve une maquette qu'il n'a jamais vue, et il a raison de le faire.",
   "Comment ?",
   "Il l'avait décrite lui-même, mot pour mot, dans son brief. La maquette ne faisait que l'exécuter. Celle-là est de la maison."],
  ["Un logo est validé par tout le monde et refusé par une seule personne, qui obtient gain de cause.",
   "Qui est-elle ?",
   "La graveuse : il ne passait pas en broderie. Celle-là est de la maison."],
];

/** Logique pure. Les réponses sont calculées, pas estimées. */
export const LOGIQUES = [
  ["Une batte et une balle coûtent 1,10 $ ensemble. La batte coûte 1,00 $ de plus que la balle.",
   "Combien coûte la balle ?",
   "5 cents. Presque tout le monde répond 10, ce qui donnerait 1,20 $ au total. C'est le test de réflexion cognitive de Frederick."],
  ["Un nénuphar double de surface chaque jour et recouvre le lac en 48 jours.",
   "Quand en recouvre-t-il la moitié ?",
   "Le 47e jour. Doubler une fois de plus suffit à passer de la moitié au tout."],
  ["Cinq machines fabriquent cinq objets en cinq minutes.",
   "Combien de temps pour que cent machines fabriquent cent objets ?",
   "Cinq minutes. Chaque machine met cinq minutes par objet, quel que soit leur nombre."],
  ["Trois portes. Derrière l'une, une voiture. Vous en choisissez une ; l'animateur, qui sait, ouvre une porte vide parmi les deux autres et vous propose de changer.",
   "Faut-il changer ?",
   "Oui. Changer gagne deux fois sur trois, garder une fois sur trois. Le problème de Monty Hall."],
  ["Deux portes, deux gardiens. L'un dit toujours vrai, l'autre ment toujours. Vous n'avez droit qu'à une question, à un seul gardien.",
   "Laquelle ?",
   "« Que me répondrait l'autre si je lui demandais où est la sortie ? » Puis prenez l'inverse : les deux chemins passent par exactement un mensonge."],
  ["Deux cordes brûlent chacune en une heure, mais irrégulièrement : une moitié de corde ne fait pas une demi-heure.",
   "Comment mesurer 45 minutes ?",
   "Allumez la première aux deux bouts et la seconde à un seul. Quand la première est consumée, 30 minutes ont passé : allumez alors l'autre bout de la seconde, qui finira 15 minutes plus tard."],
  ["Un escargot monte de 3 mètres le jour et redescend de 2 mètres la nuit. Le puits fait 10 mètres.",
   "Quand sort-il ?",
   "Le huitième jour. Au soir du septième il est à 7 mètres ; le huitième jour il monte de 3 et sort avant de redescendre."],
  ["Trois interrupteurs en bas, une ampoule à l'étage. Vous ne pouvez monter qu'une fois.",
   "Comment savoir lequel commande l'ampoule ?",
   "Allumez le premier dix minutes, éteignez-le, allumez le second et montez. Allumée : le second. Éteinte et chaude : le premier. Éteinte et froide : le troisième."],
  ["Dix personnes se saluent, chacune serrant la main de toutes les autres une seule fois.",
   "Combien de poignées de main ?",
   "45. Chacune en donne 9, mais chaque poignée est comptée deux fois : 10 × 9 ÷ 2."],
  ["Un livre compte cent pages, numérotées de 1 à 100.",
   "Combien de chiffres l'imprimeur a-t-il composés ?",
   "192. Neuf pages à un chiffre, quatre-vingt-dix à deux, et la centième à trois : 9 + 180 + 3."],
  ["Une pièce équilibrée vient de tomber cinq fois de suite sur pile.",
   "Quelle est la probabilité qu'elle tombe encore sur pile ?",
   "Une sur deux. La pièce n'a pas de mémoire. C'est le sophisme du joueur."],
  ["Vous avez douze billes identiques à l'oeil. L'une est plus lourde. Une balance à deux plateaux, trois pesées.",
   "Est-ce suffisant ?",
   "Oui. Trois pesées distinguent jusqu'à 27 cas, et il n'y en a que 12. Pesez 4 contre 4, puis 2 contre 2 (ou 1 contre 1) dans le groupe suspect."],
  ["Dans une salle, il suffit d'un certain nombre de personnes pour avoir plus d'une chance sur deux que deux d'entre elles partagent leur anniversaire.",
   "Combien ?",
   "23. On compare 253 paires, pas 23 dates. C'est le paradoxe des anniversaires."],
  ["Un loup, une chèvre et un chou doivent traverser une rivière. La barque n'en porte qu'un. Seul, le loup mange la chèvre, et la chèvre mange le chou.",
   "Dans quel ordre ?",
   "La chèvre, puis le chou — et on ramène la chèvre. Puis le loup, puis on revient chercher la chèvre. Classique."],
  ["Deux sabliers : l'un de 7 minutes, l'autre de 11.",
   "Comment mesurer exactement 15 minutes ?",
   "Lancez les deux. À 7, retournez le petit. À 11, retournez le petit encore : il lui reste 4 minutes à rendre, qui vous mènent à 15."],
  ["La suite commence par 1, 11, 21, 1211, 111221.",
   "Quel est le terme suivant ?",
   "312211. Chaque terme décrit le précédent à voix haute : « trois 1, deux 2, un 1 ». C'est la suite de Conway."],
  ["Combien de fois peut-on soustraire 10 du nombre 100 ?",
   "Une seule fois.",
   "Une fois : après, on soustrait de 90, plus de 100. La question est un piège de formulation."],
];

/** Développement. Chaque nombre a été recalculé, aucun repris de mémoire. */
export const CODE = [
  ["Pourquoi 0,1 + 0,2 ne donne-t-il pas exactement 0,3 dans presque tous les langages ?",
   "Parce qu'en base 2, 0,1 et 0,2 sont des développements infinis, comme 1/3 en base 10. La machine les arrondit, et les erreurs s'additionnent. On obtient 0,30000000000000004."],
  ["Combien de fois faut-il plier une feuille de papier pour dépasser la distance Terre-Lune ?",
   "42. Chaque pli double l'épaisseur : 0,1 mm × 2⁴² fait environ 440 000 km, pour 384 400 km à parcourir. Au 41e, on est encore trop court."],
  ["Un tableau contient tous les nombres de 1 à 100 sauf un, dans le désordre.",
   "Comment trouver le manquant en une seule lecture ?",
   "On connaît d'avance la somme de 1 à 100 : 5050. On additionne ce qu'on lit, et la différence est le nombre absent."],
  ["Chercher un mot dans un dictionnaire de mille pages prend environ dix coups d'oeil.",
   "Combien pour un dictionnaire d'un million de pages ?",
   "Vingt. Couper en deux à chaque fois, c'est multiplier par mille pour dix étapes de plus. C'est la recherche dichotomique."],
  ["Pourquoi le temps des ordinateurs commence-t-il le 1er janvier 1970 ?",
   "Par convention. Les concepteurs d'Unix avaient besoin d'une origine, ont pris un 1er janvier rond et récent, et tout le monde a suivi. Il n'y a aucune raison plus profonde."],
  ["Pourquoi un mot de passe long vaut-il mieux qu'un mot de passe compliqué ?",
   "Parce que la difficulté croît avec la longueur de façon exponentielle, et avec les symboles de façon linéaire. Quatre mots ordinaires battent huit caractères tordus, et se retiennent."],
  ["On dit qu'il n'y a que deux choses difficiles en informatique : nommer les choses, et… ?",
   "Invalider les caches. La version longue ajoute « et les erreurs de un », en les numérotant un, deux, un — ce qui est la blague."],
  ["Un écran courant affiche 256 nuances de rouge, 256 de vert et 256 de bleu.",
   "Combien de couleurs en tout ?",
   "16 777 216, soit 256³. C'est ce que veut dire « 24 bits »."],
  ["Pourquoi un site rapide chez le développeur peut-il être lent chez le client ?",
   "Parce que le développeur a le fichier en local, un réseau rapide et le cache déjà rempli. Le client a un téléphone, des données mobiles et aucun cache. Seule la seconde mesure compte."],
  ["Un algorithme trie mille éléments en une seconde. Il est en n².",
   "Combien de temps pour deux mille ?",
   "Quatre secondes. Doubler l'entrée quadruple le temps : c'est ce que veut dire « quadratique », et pourquoi ça finit toujours par faire mal."],
  ["Pourquoi ne doit-on jamais enregistrer un mot de passe, même chiffré ?",
   "Parce qu'un chiffrement se déchiffre. On enregistre une empreinte salée, impossible à remonter : le serveur sait vérifier le mot de passe sans jamais le connaître."],
  ["Pourquoi le nombre 255 revient-il partout en informatique ?",
   "Parce que c'est le plus grand entier tenant sur huit bits : 2⁸ − 1. Un octet compte de 0 à 255, d'où les couleurs, les adresses réseau et les limites de tout un tas de choses."],
  ["Pourquoi un disque de 1 To affiche-t-il 931 Go une fois branché ?",
   "Parce que le fabricant compte 10¹² octets et le système 2⁴⁰. Le téraoctet du marketing et le tébioctet de la machine diffèrent de 9 %. Personne ne ment, les deux ne parlent pas la même langue."],
  ["Pourquoi le premier élément d'une liste porte-t-il le numéro zéro ?",
   "Parce que l'indice n'est pas un rang, c'est un décalage depuis le début. Le premier élément est à zéro case du début. Dijkstra a écrit une note entière là-dessus."],
  ["Combien de bits faut-il pour distinguer mille valeurs différentes ?",
   "Dix. 2⁹ = 512, insuffisant ; 2¹⁰ = 1024, suffisant. C'est aussi pourquoi « kilo » vaut 1024 en informatique."],
  ["Une image de 1000 × 1000 pixels, sans aucune compression.",
   "Combien pèse-t-elle ?",
   "Environ 3 Mo : un million de pixels, trois octets chacun. C'est pourquoi un JPEG de 200 Ko est déjà un exploit de compression."],
  ["Pourquoi un test qui passe ne prouve-t-il pas qu'un programme est correct ?",
   "Parce qu'il prouve seulement que ce cas-là fonctionne. Dijkstra : les tests montrent la présence de bogues, jamais leur absence."],
  ["Qu'est-ce qu'un bogue qui disparaît dès qu'on essaie de l'observer ?",
   "Un heisenbug. Ajouter un affichage ou un point d'arrêt change le rythme du programme, et le défaut de synchronisation s'évanouit."],
  ["Pourquoi les ordinateurs comptent-ils en 0 et 1 plutôt qu'en 0 à 9 ?",
   "Parce qu'un circuit distingue de façon fiable deux états — passe ou ne passe pas — et très mal dix niveaux de tension. La base 2 est un choix d'ingénierie, pas de mathématiques."],
  ["Pourquoi n'achète-t-on jamais vraiment un nom de domaine ?",
   "Parce qu'on le loue, un an à la fois. Personne ne possède studiosentis.ca : on en détient le droit d'usage tant qu'on le renouvelle."],
  ["Qu'est-ce qui différencie un site statique d'un site dynamique ?",
   "Le moment où la page est fabriquée. Statique : une fois pour toutes, avant la visite. Dynamique : à chaque visite, par un serveur. Le premier est plus rapide et tombe moins souvent en panne."],
  ["Pourquoi deux ordinateurs peuvent-ils afficher la même page différemment ?",
   "Parce qu'une page web n'est pas une image : c'est une description que chaque navigateur interprète avec ses polices, sa taille d'écran et ses réglages. Le pixel près n'existe pas sur le web."],
  ["Pourquoi un cache peut-il rendre un site plus lent ?",
   "Quand il garde une version périmée qu'il faut ensuite vérifier, ou qu'il range plus de choses qu'il n'en ressort. Un cache mal réglé ajoute du travail au lieu d'en enlever."],
  ["Qu'est-ce que la récursion ?",
   "Voir : récursion. Plus sérieusement : une fonction qui s'appelle elle-même sur un cas plus petit, jusqu'à un cas si petit qu'il se résout directement."],
  ["Pourquoi un identifiant peut-il être public alors qu'un mot de passe ne le doit jamais ?",
   "Parce que l'identifiant dit qui vous prétendez être, et le mot de passe le prouve. Afficher son nom n'est pas un risque ; afficher sa preuve en est un."],
];

/** Ce que l'oeil fait sans qu'on le lui demande. */
export const OEIL = [
  ["Pourquoi le O d'une police dépasse-t-il légèrement la hauteur du H ?",
   "Parce qu'une forme ronde paraît plus petite qu'une forme droite de même hauteur. Le dessinateur la fait dépasser pour qu'elle paraisse égale : c'est le débord optique. Alignées mathématiquement, les lettres semblent sauter."],
  ["Pourquoi un carré noir paraît-il plus petit qu'un carré blanc de même taille ?",
   "Parce que le clair déborde sur le sombre dans l'oeil : c'est l'irradiation. C'est aussi pourquoi une police paraît plus grasse en blanc sur noir."],
  ["Pourquoi centre-t-on un texte plus haut que le milieu exact de sa boîte ?",
   "Parce que le centre optique est au-dessus du centre géométrique, d'environ 2 à 5 %. Un titre centré mathématiquement paraît tomber vers le bas."],
  ["Pourquoi les barres horizontales d'un H sont-elles plus fines que les verticales ?",
   "Parce que l'oeil perçoit une horizontale plus épaisse qu'une verticale de même épaisseur. Le dessinateur l'amincit pour qu'elles paraissent égales."],
  ["Pourquoi une ligne verticale paraît-elle plus longue qu'une horizontale de même longueur ?",
   "Parce que notre champ de vision est plus large que haut : la même longueur occupe une plus grande part du champ en hauteur. C'est l'illusion horizontale-verticale."],
  ["Pourquoi un logo parfaitement centré paraît-il parfois décalé ?",
   "Parce que l'oeil centre les masses, pas les boîtes. Une forme plus lourde d'un côté doit être déplacée vers l'autre pour paraître centrée. On aligne ce qu'on voit, pas ce qu'on mesure."],
  ["Pourquoi le rouge pur et le bleu pur côte à côte font-ils vibrer l'oeil ?",
   "Parce que l'oeil ne les met pas au point dans le même plan : le rouge semble avancer et le bleu reculer. C'est la chromostéréopsie, et c'est pourquoi on évite ce couple en texte."],
  ["Pourquoi l'oeil suit-il un F sur une page web et un Z sur une affiche ?",
   "Parce qu'une page se parcourt en cherchant, par balayages horizontaux de plus en plus courts, tandis qu'une affiche se prend d'un coup. La structure doit suivre le parcours, pas l'inverse."],
  ["Pourquoi l'angle d'un carré arrondi moderne n'est-il pas un quart de cercle ?",
   "Parce qu'un quart de cercle crée une rupture visible là où il rejoint la droite. Les logos récents utilisent une courbure progressive, qui entre et sort du virage sans cassure."],
  ["Pourquoi un texte se lit-il plus vite en colonne étroite ?",
   "Parce que l'oeil avance par bonds et doit retrouver le début de la ligne suivante. Passé 75 caractères environ, il se trompe de ligne. Les journaux ont des colonnes pour cette raison, pas par tradition."],
  ["Pourquoi une couleur paraît-elle plus saturée sur une grande surface ?",
   "Parce que la perception de saturation augmente avec l'aire. Un bleu choisi sur une pastille de 2 cm devient criard sur un mur — on valide toujours une couleur à sa taille réelle."],
  ["Pourquoi l'italique penche-t-il à droite ?",
   "Parce qu'il imite l'écriture manuscrite d'un droitier, dont la main pousse la plume vers l'avant. Un italique penché à gauche existe, et sert à signaler que quelque chose recule."],
  ["Pourquoi un texte tout en capitales se lit-il plus lentement ?",
   "Parce qu'on lit la silhouette des mots avant les lettres, et que les capitales donnent à tous les mots la même silhouette rectangulaire. On est forcé d'épeler."],
  ["Pourquoi deux gris identiques paraissent-ils différents selon leur voisin ?",
   "Parce que l'oeil mesure des écarts, jamais des valeurs absolues. C'est le contraste simultané, et c'est pourquoi une couleur de marque se valide sur ses vrais fonds."],
  ["Pourquoi un pictogramme se dessine-t-il sur une grille ?",
   "Pour que ses traits tombent sur les mêmes épaisseurs et ses formes sur les mêmes rayons d'un dessin à l'autre. Sans grille, une série de pictogrammes se voit comme une série de dessins séparés."],
  ["Pourquoi une photo paraît-elle plus nette avec un léger grain ?",
   "Parce que le grain ajoute du contraste local à haute fréquence, que l'oeil interprète comme du détail. C'est aussi pourquoi un aplat parfaitement lisse paraît plat."],
  ["Pourquoi un triangle pointe en haut paraît-il plus grand qu'un carré de même aire ?",
   "Parce que la pointe attire le regard vers le haut et que la base large lui donne de l'assise : l'oeil additionne une direction à une surface. Les formes se compensent à l'oeil, pas au calcul."],
  ["Pourquoi un logo doit-il être légèrement plus épais en très petit ?",
   "Parce que l'écran et l'encre mangent le trait fin. Les identités sérieuses livrent une version dessinée pour les petites tailles, pas une simple réduction."],
];

/** Des phrases qui se mordent la queue. */
export const PARADOXES = [
  ["On remplace une à une toutes les planches d'un bateau, jusqu'à ce qu'aucune d'origine ne subsiste.",
   "Est-ce encore le même bateau ?",
   "Le bateau de Thésée. Aucune réponse ne fait consensus depuis deux mille ans — et c'est la même question que « est-ce encore la même marque après une refonte »."],
  ["Retirez un grain d'un tas de sable : c'est encore un tas. Recommencez.",
   "Quand cesse-t-il d'en être un ?",
   "Le paradoxe sorite. Il montre que certains mots n'ont pas de frontière nette — « moderne », « professionnel » et « simple » en font partie, d'où l'intérêt de montrer plutôt que de décrire."],
  ["Cette phrase est fausse.",
   "Vraie ou fausse ?",
   "Ni l'une ni l'autre : si elle est vraie, elle est fausse, et réciproquement. Le paradoxe du menteur, vieux de vingt-cinq siècles."],
  ["Un traitement guérit mieux que l'autre chez les hommes, et mieux aussi chez les femmes.",
   "Peut-il être moins bon sur l'ensemble ?",
   "Oui. C'est le paradoxe de Simpson : regrouper des données peut inverser une conclusion. Raison pour laquelle une moyenne globale ne prouve à peu près rien."],
  ["Achille court dix fois plus vite que la tortue, qui part avec cent mètres d'avance. Quand il atteint son point de départ, elle a avancé ; quand il l'atteint, elle a encore avancé.",
   "La rattrape-t-il ?",
   "Oui, après 111,11 mètres. Zénon découpe le trajet en une infinité d'étapes dont la somme est finie — une infinité de choses peut tenir dans un espace fini."],
  ["Un village n'a qu'un barbier, qui rase tous ceux qui ne se rasent pas eux-mêmes, et eux seuls.",
   "Qui rase le barbier ?",
   "Personne ne le peut : s'il se rase, il ne devrait pas ; s'il ne se rase pas, il le devrait. Russell s'en est servi pour montrer qu'un ensemble ne peut pas se contenir n'importe comment."],
  ["Ajouter une route à un réseau routier saturé.",
   "Cela peut-il ralentir tout le monde ?",
   "Oui. C'est le paradoxe de Braess : chacun choisit le trajet le meilleur pour lui, et l'ensemble y perd. On l'a vérifié en fermant des avenues, qui ont fluidifié le trafic."],
  ["Une carte parfaitement exacte d'un territoire.",
   "Quelle serait sa taille ?",
   "Celle du territoire, et elle ne servirait à rien. Borges en a fait une nouvelle d'un paragraphe. Une maquette qui montre tout ne montre rien : c'est le même problème."],
  ["Vous faites la queue. L'autre file avance plus vite.",
   "Est-ce vraiment toujours le cas ?",
   "Presque. S'il y a trois files, la vôtre n'est la plus rapide qu'une fois sur trois : vous avez donc deux chances sur trois d'avoir raison de râler."],
  ["Un ordinateur ne fait jamais d'erreur, et pourtant tous les logiciels en contiennent.",
   "Où est la faute ?",
   "Dans la consigne, jamais dans l'exécution. La machine fait exactement ce qu'on a écrit — le bogue est toujours un malentendu entre un humain et lui-même."],
  ["Plus un devis est détaillé, moins le client le lit.",
   "Faut-il le raccourcir ?",
   "Non : il faut le hiérarchiser. Un prix, une date, une liste courte en haut ; le détail en dessous pour qui le veut. Tout dire et être lu ne s'opposent que si tout est au même niveau."],
  ["Une entreprise affiche ses prix et perd des clients. Elle les cache et en perd aussi.",
   "Que faut-il faire ?",
   "Afficher. Ceux que le prix fait fuir ne seraient pas venus au bout ; ceux que l'absence de prix fait fuir, oui. On ne perd pas les mêmes."],
];

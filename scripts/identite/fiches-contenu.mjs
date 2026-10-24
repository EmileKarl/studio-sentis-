/**
 * Le corpus des fiches de communication.
 *
 * ## La règle qui gouverne tout le fichier
 *
 * **Aucune statistique inventée.** Il aurait été facile d'écrire « 94 % des
 * premières impressions sont liées au design » : ça circule partout, ça
 * sonne bien, et c'est invérifiable. Un chiffre faux sur un statut de studio
 * de design coûte plus cher qu'il ne rapporte, parce que la personne qui le
 * vérifie ne revient pas.
 *
 * Les seuls chiffres affichés sont donc ceux de Studio Sentis — un délai, un
 * prix, un nombre de personnes — que le client connaît et peut tenir. Tout
 * le reste repose sur des faits de métier vérifiables, des définitions, ou
 * des jugements que l'image elle-même démontre.
 *
 * ## Écrit à la main, et pourquoi
 *
 * Le corpus SEO de ce dépôt est produit par grammaire combinatoire : 113 691
 * expressions. Échantillonné, il rendait « gabarits pour entreprise pour
 * café ». Pour du texte lu par un humain sur un statut, la combinaison ne
 * tient pas. Ces fiches sont donc écrites une par une.
 *
 * Les **dessins**, eux, sont paramétrés (`fiches-dessins.mjs`) : déplacer
 * l'intrus d'une case produit une énigme aussi valable que la précédente.
 * La combinaison marche sur la géométrie, pas sur la langue.
 *
 * ## Le mécanisme
 *
 * La fiche **pose** la question. Elle ne donne jamais la réponse. C'est le
 * ressort : sur WhatsApp, on répond à un statut quand on peut répondre
 * quelque chose. La réponse part en message privé, et cette conversation est
 * exactement ce qu'on cherche.
 *
 * Les réponses vivent dans `identite/5-fiches/REPONSES.md`, produit par le
 * même script. C'est l'antisèche de celui qui publie.
 */

/** Devinettes de métier. Un non-spécialiste peut tenter sa chance. */
export const ENIGMES = [
  ["Comment appelle-t-on l'espace entre deux lettres ?",
   "L'approche. Quand on l'ajuste sur une paire précise — le A et le V, par exemple — on parle de crénage."],
  ["Pourquoi un logo se dessine-t-il en noir avant d'être en couleur ?",
   "Parce que la couleur pardonne une forme faible. En noir, il ne reste que la forme : si elle ne tient pas là, elle ne tiendra nulle part."],
  ["Votre enseigne doit se lire depuis une voiture. Qu'est-ce qui décide ?",
   "Le contraste et l'épaisseur du trait, pas la taille. Une grande enseigne fine disparaît ; une petite bien contrastée se lit."],
  ["Combien de polices différentes devrait porter une marque ?",
   "Une ou deux. Trois commence à ressembler à un accident. La variété vient des graisses et des tailles, pas des familles."],
  ["Pourquoi deux rouges côte à côte ne sont-ils jamais le même rouge ?",
   "Parce que l'oeil juge une couleur par rapport à sa voisine. Le même rouge paraît plus sombre sur fond clair : c'est le contraste simultané."],
  ["Que voit une personne daltonienne de votre logo ?",
   "Souvent autre chose que vous. Environ un homme sur douze confond le rouge et le vert — d'où la règle de ne jamais faire porter une information par la seule couleur."],
  ["Pourquoi votre logo paraît plus petit sur un camion que sur un écran ?",
   "Parce qu'on le regarde de plus loin, et que l'oeil juge la taille apparente, pas la taille réelle. Un logo de véhicule se dessine pour 20 mètres."],
  ["Qu'est-ce qu'un logo doit survivre avant d'être validé ?",
   "La broderie, la gravure, le fax, le favicon de 16 pixels et la photocopie. Ce qui survit à ça survit à tout."],
  ["Quelle est la première chose que l'oeil cherche sur une page web ?",
   "Un point d'entrée : la zone la plus contrastée. Si tout est également gros et coloré, l'oeil n'a plus de point d'entrée et il part."],
  ["Pourquoi les enseignes de pharmacie sont-elles presque toutes vertes ?",
   "Par convention de secteur. Une couleur n'a pas de sens en soi : elle en prend un par l'usage. S'en écarter se remarque, et c'est parfois exactement ce qu'on veut."],
  ["Un site met 4 secondes à s'afficher. Qu'est-ce qui pèse le plus souvent ?",
   "Les images. Avant le code, avant les polices : une seule photo non redimensionnée pèse souvent plus que la page entière."],
  ["Pourquoi une page centrée sur tout l'écran se lit-elle mal ?",
   "Parce que l'oeil doit retrouver le début de chaque ligne. Au-delà de 75 caractères environ, il se perd. C'est pour ça que les journaux ont des colonnes."],
  ["Qu'est-ce qui distingue une charte graphique d'un logo ?",
   "Le logo est un dessin. La charte est le mode d'emploi : qui a le droit de l'utiliser, à quelle taille, sur quel fond, avec quelles couleurs et quelles polices."],
  ["Pourquoi un logo ne doit-il pas expliquer le métier ?",
   "Parce que personne ne devine un métier dans un dessin. Apple ne vend pas de pommes. Le logo fait reconnaître, le reste explique."],
  ["À quelle distance teste-t-on une carte d'affaires ?",
   "Bras tendu, puis à deux mètres sur une table. Ce qui disparaît à deux mètres ne sert qu'à celui qui l'a dessinée."],
  ["Pourquoi dit-on qu'un blanc n'est jamais perdu ?",
   "Parce que l'espace vide est ce qui donne sa valeur au reste. Remplir une affiche jusqu'au bord, c'est dire que rien n'y est important."],
  ["Qu'est-ce qu'une police sans empattement ?",
   "Une police sans les petits pieds au bout des lettres. Celle que vous lisez en ce moment en est une."],
  ["Pourquoi un texte blanc sur fond jaune est-il illisible ?",
   "Parce que la lisibilité tient au contraste de clarté, pas à la différence de couleur. Deux couleurs vives de même clarté se neutralisent."],
  ["Comment sait-on qu'un logo est trop compliqué ?",
   "On demande à quelqu'un de le redessiner de mémoire après cinq secondes. Ce qu'il dessine, c'est votre vrai logo."],
  ["Pourquoi votre site doit-il exister en français ET en anglais ici ?",
   "Parce qu'en Montérégie un client sur plusieurs cherche en anglais, et qu'une page qui n'existe pas dans sa langue ne sort pas dans sa recherche."],
  ["Qu'est-ce qui coûte le plus cher dans un site web ?",
   "Les allers-retours qu'on n'avait pas prévus. D'où le prix et la date annoncés au premier échange."],
  ["Pourquoi un devis gratuit n'est-il pas un devis rapide ?",
   "Parce que chiffrer honnêtement demande de comprendre le travail. Gratuit veut dire que vous ne payez pas pour qu'on réfléchisse, pas qu'on ne réfléchit pas."],
  ["Votre logo est en JPG. Pourquoi est-ce un problème ?",
   "Parce qu'un JPG a une taille fixe et un fond. Agrandi, il devient flou ; sur une couleur, il traîne un rectangle blanc. Il faut un fichier vectoriel."],
  ["Qu'est-ce qu'un fichier vectoriel ?",
   "Un dessin décrit par des courbes plutôt que par des points. Il s'agrandit d'une carte d'affaires à une enseigne sans jamais perdre en netteté."],
  ["Pourquoi la plupart des logos sont-ils plus larges que hauts ?",
   "Parce que les endroits où on les pose le sont aussi : un en-tête de site, une bannière, le haut d'une facture. Un logo carré y perd la moitié de sa place."],
  ["Qu'est-ce qui fait qu'une photo de produit paraît chère ?",
   "Une seule source de lumière et beaucoup de vide autour. Le reste est une affaire de patience, pas de matériel."],
  ["Pourquoi change-t-on rarement un logo d'un coup ?",
   "Parce que la reconnaissance met des années à se construire et une journée à se perdre. On fait évoluer, on ne remplace que s'il n'y a rien à sauver."],
  ["Qu'est-ce qu'une maquette ne montrera jamais ?",
   "Le comportement. Une maquette est une photo ; un site est un film. Ce qui se passe au clic, au survol, à l'erreur, ne se dessine pas, ça s'essaie."],
  ["Pourquoi votre formulaire de contact perd-il des clients ?",
   "Souvent parce qu'il demande trop. Chaque champ ajouté fait abandonner quelqu'un. Un nom, un moyen de vous joindre, un message : ça suffit."],
  ["Qu'est-ce qui se trouve en premier sur Google : votre site ou votre fiche ?",
   "Presque toujours la fiche d'établissement Google, surtout sur un téléphone. C'est le premier levier local, et il est gratuit."],
];

/** Vrai ou faux. L'affirmation s'affiche, le verdict reste privé. */
export const VRAIFAUX = [
  ["Un bon logo doit expliquer ce que fait l'entreprise.", "Faux",
   "Il doit faire reconnaître, pas expliquer. Nike ne dessine pas de chaussure."],
  ["Plus un logo a de détails, plus il paraît professionnel.", "Faux",
   "C'est l'inverse. Le détail disparaît à petite taille, et ce qui reste paraît sale."],
  ["Le bleu est la couleur la plus répandue dans les logos d'entreprise.", "Vrai",
   "Au point d'en être un réflexe. Ce qui en fait un choix sûr, et un choix peu distinctif."],
  ["Un site web doit tenir en entier sans faire défiler.", "Faux",
   "Les gens font défiler depuis toujours. Ce qui compte, c'est que le haut donne envie de continuer."],
  ["Changer de logo fait perdre des clients.", "Faux",
   "Changer sans prévenir, oui. Un changement expliqué et progressif ne coûte rien."],
  ["Une charte graphique sert surtout à faire joli.", "Faux",
   "Elle sert à ce que votre marque reste la même quand ce n'est plus vous qui l'applique."],
  ["Un logo doit être lisible en noir et blanc.", "Vrai",
   "La télécopie a disparu, pas la gravure, la broderie ni la photocopie."],
  ["Le rouge attire l'oeil plus que les autres couleurs.", "Faux",
   "C'est le contraste avec son entourage qui attire l'oeil. Du rouge sur du rouge ne se voit pas."],
  ["Il faut refaire son site tous les deux ans.", "Faux",
   "Il faut l'entretenir. On refait quand le métier a changé, pas quand la mode a changé."],
  ["Une police gratuite ne peut pas servir en entreprise.", "Faux",
   "Beaucoup de polices gratuites sont excellentes. Ce qu'il faut vérifier, c'est la licence, pas le prix."],
  ["Un site rapide compte plus qu'un site beau.", "Vrai",
   "Un beau site qui met six secondes n'est vu par personne."],
  ["Le logo doit toujours être en haut à gauche.", "Faux",
   "C'est une convention, pas une règle. Mais on ne s'en écarte qu'avec une raison."],
  ["Une entreprise d'une personne a besoin d'une charte graphique.", "Vrai",
   "Surtout elle. C'est ce qui la fait paraître constante quand elle est seule à tout tenir."],
  ["Écrire en MAJUSCULES rend un texte plus lisible.", "Faux",
   "L'inverse. On lit la silhouette des mots, et les majuscules les rendent toutes rectangulaires."],
  ["Un bon site se juge sur sa page d'accueil.", "Faux",
   "La plupart des visiteurs arrivent par une autre page, depuis une recherche."],
  ["Le format PNG convient pour imprimer une enseigne.", "Faux",
   "Il faut un fichier vectoriel. Un PNG agrandi devient flou, quelle que soit sa taille de départ."],
  ["Avoir un site rend inutile une fiche Google.", "Faux",
   "Sur un téléphone, la fiche s'affiche souvent avant le site. Les deux travaillent ensemble."],
  ["Un devis doit arriver avant de commencer le travail.", "Vrai",
   "Toujours. C'est la seule façon de savoir ce qu'on achète."],
  ["Deux couleurs suffisent à une identité.", "Vrai",
   "Souvent même une seule, plus le papier et l'encre. La contrainte fait la reconnaissance."],
  ["Un logo doit plaire au dirigeant avant tout.", "Faux",
   "Il doit être reconnu par les clients. Ce n'est pas la même épreuve."],
  ["On peut déposer n'importe quel logo comme marque de commerce.", "Faux",
   "Il faut qu'il soit distinctif et libre. Un logo trop générique ne se protège pas."],
  ["Le responsive, c'est faire une deuxième version du site pour téléphone.", "Faux",
   "C'est un seul site qui se réorganise. Deux versions, c'est deux fois l'entretien."],
  ["Une animation rend toujours un site plus moderne.", "Faux",
   "Une animation sans raison rend un site plus lent. Elle doit expliquer un changement d'état."],
  ["Le noir pur convient pour un texte à l'écran.", "Faux",
   "Un noir très légèrement adouci fatigue moins. Le contraste maximal n'est pas le confort maximal."],
  ["Un nom de domaine en .ca vaut mieux qu'un .com au Québec.", "Vrai",
   "À conditions égales, il signale l'ancrage local — aux clients comme aux moteurs."],
];

/** Deux chemins, un seul bon. Le lecteur tranche. */
export const CHOIX = [
  ["Un client vous trouve sur son téléphone. Que doit-il voir d'abord ?",
   "Vos services", "Comment vous joindre", "B",
   "Sur un téléphone, l'intention est presque toujours de contacter. Les services, il les lira après."],
  ["Deux logos. Lequel tiendra dix ans ?",
   "Le plus original", "Le plus simple", "B",
   "L'originalité date. La simplicité se laisse remettre au goût du jour sans être reniée."],
  ["Votre site n'apparaît pas sur Google. Vous commencez par quoi ?",
   "Acheter de la publicité", "Créer votre fiche d'établissement", "B",
   "La fiche est gratuite et c'est le premier levier local. La publicité s'arrête le jour où vous arrêtez de payer."],
  ["Une page de services. Combien de boutons d'action ?",
   "Un seul, répété", "Plusieurs, différents", "A",
   "Plusieurs choix différents, c'est une hésitation. Un seul geste, proposé plusieurs fois, c'est une direction."],
  ["Votre texte est trop long. Vous faites quoi ?",
   "Vous réduisez le corps", "Vous coupez du texte", "B",
   "Réduire le corps déplace le problème sur les yeux du lecteur."],
  ["Un logo pour un camion. Vous partez de quoi ?",
   "Du logo du site, agrandi", "D'une version dessinée pour la distance", "B",
   "Agrandir ne rend pas lisible : les proportions qui marchent à 3 cm ne marchent pas à 20 m."],
  ["Deux photos de votre atelier. Laquelle met en confiance ?",
   "L'atelier vide et rangé", "L'atelier avec vous dedans", "B",
   "On achète à quelqu'un. Un lieu vide ne dit pas qui répond au téléphone."],
  ["Votre prix est plus élevé qu'un concurrent. Sur le site, vous faites quoi ?",
   "Vous le cachez", "Vous l'affichez et vous dites ce qu'il comprend", "B",
   "Un prix caché fait partir le client comparer ailleurs. Un prix expliqué fait rester celui qui peut payer."],
  ["Un client veut « quelque chose de moderne ». Vous demandez quoi ?",
   "Des exemples qu'il aime", "Sa couleur préférée", "A",
   "Moderne ne veut rien dire tant qu'on ne l'a pas montré. Trois exemples valent une heure de discussion."],
  ["Deux pages d'accueil. Laquelle convertit ?",
   "Celle qui montre tout", "Celle qui montre une chose", "B",
   "Montrer tout, c'est laisser le visiteur choisir où regarder. La plupart choisissent de partir."],
  ["Votre marque a besoin d'une police. Vous choisissez ?",
   "Celle qui vous plaît", "Celle qui a toutes les graisses", "B",
   "Une police à une seule graisse vous bloque dès la deuxième mise en page."],
  ["Le logo sur fond photo. Vous faites quoi ?",
   "Vous ajoutez une ombre", "Vous posez un aplat derrière", "B",
   "L'ombre sauve mal un contraste insuffisant. Un aplat règle le problème et reste propre."],
  ["Pour une soumission, le client vous envoie ?",
   "Son budget", "Son besoin", "A",
   "Les deux, mais le budget en premier : il décide de ce qui est possible, et il évite deux semaines perdues."],
  ["Un site de restaurant. L'élément le plus important ?",
   "Les photos des plats", "Le menu et les heures", "B",
   "On cherche d'abord si c'est ouvert et ce que ça coûte. Les photos viennent ensuite."],
  ["Vous avez 500 $ pour votre image. Vous mettez tout sur ?",
   "Un logo", "Des photos de votre travail", "B",
   "Un logo sans preuve de travail ne convainc personne. De bonnes photos vendent avec n'importe quel logo correct."],
  ["Deux noms de domaine. Lequel ?",
   "Le plus court", "Le plus descriptif", "A",
   "On le dicte au téléphone plus souvent qu'on ne le lit. Court gagne presque toujours."],
  ["Votre formulaire reçoit peu de demandes. Vous ?",
   "Ajoutez un champ « budget »", "Retirez des champs", "B",
   "Chaque champ coûte des demandes. On enlève avant d'ajouter."],
  ["Un client n'aime pas la proposition. Vous ?",
   "En montrez trois autres", "Demandez ce qui ne va pas", "B",
   "Trois autres propositions sans diagnostic, c'est trois chances de se tromper à nouveau."],
];

/** Une phrase, rien d'autre. Elle doit se suffire ou se taire. */
export const PHRASES = [
  "Votre logo n'est pas votre marque.",
  "Un beau site que personne ne trouve n'existe pas.",
  "Le devis arrive avant la facture. Toujours.",
  "Ce qui ne se lit pas de loin ne se lit pas.",
  "La couleur pardonne. La forme, non.",
  "On ne dessine pas un logo. On le resserre.",
  "Le vide n'est pas de la place perdue.",
  "Un site se juge le jour où il faut le modifier.",
  "Si tout est important, rien ne l'est.",
  "Votre client ne lit pas. Il cherche.",
  "Une marque constante vaut mieux qu'une marque parfaite.",
  "Le premier prix n'est pas le vrai prix.",
  "Ce qui survit à la photocopieuse survit à tout.",
  "Un logo se reconnaît. Il ne s'explique pas.",
  "La vitesse est une décision de design.",
  "Trois polices, c'est deux de trop.",
  "On n'achète pas un service. On achète quelqu'un.",
  "Votre page d'accueil n'est pas votre porte d'entrée.",
  "Le détail disparaît à 2 centimètres.",
  "Un prix affiché filtre. C'est son travail.",
  "La charte sert surtout quand ce n'est plus vous qui l'applique.",
  "Agrandir ne rend pas lisible.",
  "Le gris est une couleur. Le flou, non.",
  "Ce que vous dessinez de mémoire, c'est le vrai logo.",
  "Un formulaire long est un client perdu.",
  "On reconnaît une marque à ce qu'elle refuse.",
  "Le mobile n'est pas une version. C'est la version.",
  "Deux semaines de retard coûtent plus cher qu'une refonte.",
  "Une animation sans raison est une lenteur.",
  "Le blanc cassé fatigue moins que le blanc.",
  "Votre concurrent a le même modèle que vous. Ça se voit.",
  "Un bon brief vaut trois propositions.",
  "La simplicité se date moins vite que l'originalité.",
  "Ce qui est gratuit vous coûte votre temps.",
  "On ne refait pas un site. On le remet au travail.",
];

/**
 * Un mot du métier, seul, en grand. La fiche n'explique rien : c'est tout
 * l'intérêt. Celui qui veut savoir écrit.
 */
export const MOTS = [
  ["Crénage", "L'ajustement de l'espace entre deux lettres précises, quand la paire sonne mal — AV, To, Ly."],
  ["Chasse", "La largeur qu'occupe un caractère, blancs latéraux compris. Une police à chasse fixe aligne tout en colonnes."],
  ["Graisse", "L'épaisseur du trait d'une police : fine, normale, demi-grasse, grasse."],
  ["Empattement", "Le petit pied au bout des lettres. Les polices qui n'en ont pas sont dites linéales."],
  ["Interlignage", "L'espace vertical entre deux lignes de texte. Trop serré, les lignes se collent ; trop lâche, elles se détachent."],
  ["Approche", "L'espace général entre toutes les lettres d'un mot. À ne pas confondre avec le crénage, qui vise une paire."],
  ["Oeil", "La hauteur des lettres minuscules sans leurs jambages. Deux polices au même corps peuvent avoir un oeil très différent."],
  ["Veuve", "La dernière ligne d'un paragraphe isolée en haut d'une colonne. On la chasse."],
  ["Orpheline", "La première ligne d'un paragraphe restée seule en bas d'une colonne."],
  ["Lézarde", "La rivière de blanc qui se forme verticalement dans un texte justifié. Elle attire l'oeil et ne devrait pas."],
  ["Gouttière", "L'espace entre deux colonnes. C'est lui qui les sépare, pas un trait."],
  ["Fond perdu", "La marge imprimée au-delà de la coupe, pour qu'un décalage de massicot ne laisse pas de filet blanc."],
  ["Ligature", "Deux lettres fondues en un seul dessin, comme le fi ou le fl, pour éviter la collision."],
  ["Capitale", "La majuscule. Les petites capitales, elles, ont la hauteur des minuscules."],
  ["Filet", "Un trait fin de mise en page. Celui du bas de cette fiche en est un."],
  ["Aplat", "Une surface de couleur uniforme, sans dégradé ni texture."],
  ["Défonce", "Le texte laissé en blanc dans un aplat de couleur, au lieu d'être imprimé."],
  ["Repère", "La marque qui dit où couper, plier ou aligner. Les équerres aux angles de cette fiche en sont."],
  ["Vectoriel", "Un dessin décrit par des courbes et non par des points : il s'agrandit sans jamais devenir flou."],
  ["Pantone", "Un nuancier de couleurs normalisé, pour qu'un rouge imprimé à Montréal soit le même qu'à Québec."],
  ["Quadrichromie", "L'impression en quatre encres — cyan, magenta, jaune, noir — qui recompose toutes les autres."],
  ["Gabarit", "La structure invisible qui tient une mise en page : marges, colonnes, lignes de base."],
  ["Hiérarchie", "L'ordre dans lequel l'oeil rencontre les éléments. Elle se construit par la taille, le poids et le vide."],
  ["Contraste", "L'écart qui permet de distinguer. De clarté, de taille, de graisse, de couleur — rarement un seul à la fois."],
  ["Lisibilité", "La facilité à déchiffrer les lettres. À ne pas confondre avec la clarté du propos."],
  ["Signalétique", "L'ensemble des repères qui guident dans un lieu. Elle se juge en marchant, pas sur un écran."],
  ["Déclinaison", "La même identité adaptée à un nouveau support, sans la refaire."],
  ["Monogramme", "Les initiales dessinées comme un seul signe. Utile quand le logo complet ne rentre pas."],
  ["Favicon", "La minuscule image de l'onglet du navigateur. 16 pixels de côté : l'épreuve la plus dure pour un logo."],
  ["Maquette", "Le dessin d'une page avant qu'elle existe. Elle montre l'état, jamais le comportement."],
  ["Responsive", "Une mise en page qui se réorganise selon la largeur de l'écran. Un seul site, pas deux."],
  ["Wireframe", "La maquette réduite aux blocs, sans couleur ni image : on y juge la structure seule."],
];

/** Un chiffre nu, et une ligne. Ceux de Studio Sentis, pas des statistiques. */
export const CHIFFRES = [
  ["48", "heures", "Le délai de réponse. Pas « on vous revient »."],
  ["0", "dollar", "Ce que coûte une soumission."],
  ["1", "personne", "Qui répond, qui dessine, qui livre."],
  ["2", "langues", "Français et anglais, sur chaque page."],
  ["16", "pixels", "La taille où votre logo doit encore se reconnaître."],
  ["4", "formats", "Ce qu'un logo livré devrait contenir, au minimum."],
  ["1", "prix", "Annoncé au premier échange. Pas au dernier."],
];

/** L'ancrage local. Il vaut plus qu'un mot-clé. */
export const LOCAL = [
  ["Combien d'entreprises de Châteauguay ont un site qui s'affiche mal sur téléphone ?",
   "Plus qu'on ne croit. Le test prend dix secondes : ouvrez le vôtre sur votre propre téléphone, en données mobiles, pas en wifi."],
  ["Un client de Montérégie cherche « près de chez moi ». Qu'est-ce qui le décide ?",
   "La fiche d'établissement : les heures, les avis, la distance. Le site vient après, pour confirmer."],
  ["Votre entreprise est à Châteauguay. Combien de villes devrait couvrir votre site ?",
   "Celles que vous desservez vraiment. Inventer des villes où vous n'allez pas se retourne contre vous."],
  ["Pourquoi un site en français seul limite-t-il ici ?",
   "Parce que le Grand Montréal cherche dans les deux langues. Une page qui n'existe pas en anglais ne sort pas d'une recherche en anglais."],
];

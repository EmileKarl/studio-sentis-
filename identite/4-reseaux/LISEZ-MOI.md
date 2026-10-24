# Réseaux sociaux

| Fichier | Où le poster |
|---|---|
| `affiche-whatsapp-bleu.png` | **Statut WhatsApp** — 1080 × 1920. La version par défaut. |
| `affiche-whatsapp-papier.png` | Statut WhatsApp, version claire. |
| `affiche-whatsapp-encre.png` | Statut WhatsApp, version sombre. |
| `affiche-whatsapp-*-hd.png` | Les mêmes en **2160 × 3840**. Le maître : impression, autres plateformes, archives. |
| `facebook-couverture-1640x856.png` | Couverture de page Facebook |
| `linkedin-banniere-1584x396.png` | Bannière LinkedIn |
| `publication-carree-1080x1080.png` | Publication Facebook, Instagram, LinkedIn |
| `publication-portrait-1080x1350.png` | Publication Instagram |
| `story-1080x1920.png` | Story Instagram, Facebook, TikTok |

## Les zones réservées

Les fichiers `-reperes` montrent en pointillé ce que la plateforme recouvre.
Ils servent à vérifier, **pas à publier**.

- **WhatsApp** : environ 240 px en haut (photo de profil, nom, heure) et
  260 px en bas (barre « Répondre »). Tout ce qui compte tient entre les deux.
- **Facebook** : le téléphone ne montre que le centre de la couverture.

## Quelle version téléverser

**La version 1080 × 1920**, pas la HD. WhatsApp recompresse ce qu'on lui
donne ; partir d'une image déjà à la bonne taille lui évite un
redimensionnement de plus. La HD sert à tout le reste : impression, autres
plateformes, et le jour où une plateforme demandera plus grand.

## Refaire les affiches

```bash
node scripts/identite/affiche-whatsapp.mjs     # les neuf fichiers
node scripts/identite/verifier-affiche.mjs     # le contrôle de contraste
```

Le logo vient des fichiers de `1-logo/` : si le logo change, les affiches
changent avec lui. L'arc est le sourire du logo agrandi — ses proportions sont
dérivées du tracé de `logotype.tsx`, pas redessinées à l'oeil, donc il suit lui
aussi. La réponse est le slogan du site.

## Ce que dit l'affiche, et dans quel ordre

L'affiche ne commence pas par la promesse. Elle commence par les deux seules
questions qu'un client se pose avant de confier un mandat — **Combien ?** et
**Quand ?** — et la promesse arrive dessous, plus petite, comme la réponse.

C'est le décalage qui retient le regard, pas la taille du corps : personne ne
s'arrête sur la réponse à une question qu'il ne s'est pas encore posée.

Trois interventions restent volontairement sous le seuil de l'attention :

- **l'arc**, le sourire du logo agrandi jusqu'à sortir du cadre, à 16 %. Il
  sépare le message de la signature comme une ligne d'horizon. Son creux est
  posé dans la bande vide entre la réponse et la signature ; plus haut, il
  passait derrière la réponse et la barrait ;
- **le fil vertical** de 58 px sous le symbole, fondu aux deux bouts. Il pose
  l'axe central et fait descendre le regard ;
- **les équerres** aux quatre angles, un peu plus franches que le filet qui
  les relie. C'est le repère d'imprimeur : ça dit « calé ».

Le point d'interrogation est tracé une graisse plus légère que le mot. Même
couleur, donc même contraste : c'est une respiration, pas un affaiblissement.
L'espace fine insécable qui le précède est la règle française ; elle a été
resserrée de 0,09 em, parce que la chasse d'Inter, juste dans un paragraphe,
est béante à 132 px.

## Ce qui a été mesuré

Le fond n'est pas un aplat : c'est un dégradé, troublé par un grain. La
couleur derrière une ligne de texte n'est donc écrite nulle part — elle se
**relève dans le PNG rendu**, pixel par pixel, à l'emplacement exact du texte.
C'est ce que fait `verifier-affiche.mjs`, et il échoue sous 4,5:1.

Pire couple des trois affiches : **5,98:1** (bleu · la question). L'arc passe
derrière elle et l'éclaircit très légèrement — c'est précisément ce que le
contrôle sert à voir, puisqu'il relève le fond arc compris.

Le dégradé descend du clair vers le sombre et jamais l'inverse : éclaircir le
haut du bleu faisait passer le blanc cassé de 4,93 à 3,81:1.

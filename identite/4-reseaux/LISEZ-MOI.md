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
node scripts/identite/affiche-whatsapp.mjs     # les six fichiers
node scripts/identite/verifier-affiche.mjs     # le contrôle de contraste
```

Le logo vient des fichiers de `1-logo/` : si le logo change, les statuts
changent avec lui. Le slogan est celui du site.

## Ce qui a été mesuré

Le fond n'est pas un aplat : c'est un dégradé, troublé par un grain. La
couleur derrière une ligne de texte n'est donc écrite nulle part — elle se
**relève dans le PNG rendu**, pixel par pixel, à l'emplacement exact du texte.
C'est ce que fait `verifier-affiche.mjs`, et il échoue sous 4,5:1.

Pire couple des trois affiches : **6,16:1**. Le dégradé a même amélioré les
contrastes, puisque le texte vit dans la partie basse, plus sombre.

Le dégradé descend du clair vers le sombre et jamais l'inverse : éclaircir le
haut du bleu faisait passer le blanc cassé de 4,93 à 3,81:1.

# Réseaux sociaux

| Fichier | Où le poster |
|---|---|
| `statut-whatsapp-bleu.png` | **Statut WhatsApp** — 1080 × 1920. La version par défaut. |
| `statut-whatsapp-papier.png` | Statut WhatsApp, version claire. |
| `statut-whatsapp-encre.png` | Statut WhatsApp, version sombre. |
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

## Refaire les statuts

```bash
node scripts/identite/statut-whatsapp.mjs
```

Le logo vient des fichiers de `1-logo/` : si le logo change, les statuts
changent avec lui. Le slogan est celui du site.

## Ce qui a été mesuré

Chaque couple texte/fond des trois statuts, calculé et non estimé. Pire
couple : **4,60:1**, au-dessus du plancher de 4,5. Le lieu et l'adresse de la
version bleue étaient d'abord à 3,30:1 — invisible à l'écran, et illisible sur
un téléphone au soleil. L'opacité est passée de 72 % à 95 %.

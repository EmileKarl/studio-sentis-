# Le formulaire envoie vraiment

Depuis le 25 octobre 2026, le formulaire de `/contact` envoie la demande au
serveur, qui la relaie par courriel à la boîte du studio. Avant, il composait
un `mailto:` et remettait le message au logiciel de courriel du visiteur.

## Pourquoi c'était à refaire

Deux défauts, dont un invisible.

**Le visible** : sur un téléphone, beaucoup de gens lisent leur courriel dans
le navigateur, sans logiciel configuré. Pour eux, le bouton ne faisait **rien**
— ou ouvrait une application inutilisable. Ils partaient, et la demande était
perdue.

**L'invisible** : même avec un logiciel configuré, ce qui se passe après le
clic se passe hors du site. Impossible de savoir si la demande a été envoyée.
C'est la seule mesure qui compte sur ce site, et elle était structurellement
hors de portée.

## Les deux variables à poser

Chez **Vercel → Settings → Environment Variables**, pour les trois
environnements (Production, Preview, Development) :

| Nom | Valeur |
|---|---|
| `ZOHO_SMTP_UTILISATEUR` | `Ntek@studiosentis.ca` |
| `ZOHO_SMTP_MOTDEPASSE` | un **mot de passe d'application** Zoho, pas le mot de passe du compte |
| `ZOHO_SMTP_HOTE` | facultatif — `smtp.zohocloud.ca` par défaut |

### Créer le mot de passe d'application

1. Connectez-vous à Zoho Mail (centre de données canadien).
2. **Mon compte → Sécurité → Mots de passe d'application**.
3. Générez-en un, nommé « site web ».
4. Copiez-le dans Vercel. Zoho ne le réaffichera plus.

**N'utilisez pas le mot de passe du compte.** Un mot de passe d'application se
révoque seul, sans changer celui du compte, et il ne donne accès qu'à l'envoi.

**Ne le collez jamais dans une conversation ni dans un fichier du dépôt.** Il
n'existe que dans Vercel.

### Après l'avoir posé

Les variables sont lues **au rendu de la page de contact**, donc il faut un
redéploiement pour que le formulaire bascule. Un `git push` suffit, ou
« Redeploy » depuis le tableau de bord Vercel.

## Tant que les variables n'existent pas

Le formulaire garde **exactement** le comportement d'avant : il compose le
`mailto:` et n'appelle jamais le serveur. Aucune requête, aucun message
d'erreur. C'est le rôle du drapeau `envoiActif` passé par la page.

Sans ce drapeau, chaque visiteur aurait vu « L'envoi n'a pas fonctionné »
avant d'obtenir le filet — pire que l'ancien comportement.

## Ce qui protège le formulaire

| Garde | Ce qu'elle fait |
|---|---|
| **Piège à robots** | Un champ `site`, invisible à l'oeil, au lecteur d'écran et au clavier. Rempli = message jeté, et on répond « envoyé » : dire au robot qu'il est repéré, c'est l'aider à s'ajuster |
| **Délai minimal** | Moins de 2,5 s entre l'affichage et l'envoi = jeté. Le champ reste vide sans JavaScript, et la garde ne s'applique alors pas, plutôt que de bloquer quelqu'un |
| **Validation serveur** | Zod. La validation du navigateur donne la réponse immédiate ; celle du serveur fait foi, c'est la seule qu'un robot ne contourne pas |
| **En-têtes nettoyés** | Les caractères de contrôle sautent du nom avant d'atteindre `Subject` et `Reply-To`. Nodemailer encode déjà ses en-têtes : on ne fait pas reposer une protection sur une seule couche |
| **Délais d'expiration** | 10 s à la connexion, 15 s au socket. Par défaut, un SMTP muet tiendrait la requête près de deux minutes |

**Ce qui n'est pas protégé** : il n'y a pas de limitation de débit. Sur une
plateforme sans serveur, un compteur en mémoire ne vaut rien — chaque requête
peut tomber sur une instance différente. Si du pourriel passe, il faudra un
stockage partagé. À ce volume, le piège et le délai suffisent.

## Ce qui a été vérifié, et ce qui ne l'a pas été

Vérifié dans un vrai navigateur :

- formulaire vide → aucune requête, trois erreurs affichées ;
- rempli normalement → une requête, l'action serveur est atteinte ;
- envoyé en 0,3 s → rejeté en silence ;
- piège rempli → rejeté en silence ;
- sans identifiants → aucune requête, comportement d'avant intact ;
- avec identifiants invalides → échec en 10,5 s, filet proposé, détail dans
  le journal du serveur et pas chez le visiteur.

**Non vérifié** : la livraison réelle. Le port 465 est bloqué en sortie depuis
l'environnement de développement, comme le port 25. Le test qui tranche est
d'envoyer une demande depuis le site en ligne, une fois les variables posées.

## Le configurateur de prix utilise encore un `mailto:`

`configurateur-prix.tsx` ouvre toujours un brouillon. C'est un autre parcours
— le visiteur a composé une offre et veut l'envoyer telle quelle — et il n'a
pas de champ libre à valider. À brancher aussi le jour où l'on voudra mesurer
ce parcours-là.

# studio-sentis-

## MCP

Ce dépôt déclare un serveur MCP au niveau du projet dans `.mcp.json` :

| Serveur | Paquet | Rôle |
| --- | --- | --- |
| `magicuidesign-mcp` | [`@magicuidesign/mcp`](https://www.npmjs.com/package/@magicuidesign/mcp) | Accès aux composants Magic UI |

Il est lancé via `npx -y @magicuidesign/mcp@latest`, donc aucune installation
préalable n'est nécessaire — Node.js (npx) suffit.

Au premier démarrage de Claude Code dans ce dépôt, il faut approuver le serveur
(`/mcp` permet de vérifier son état).

## Skills

Le skill [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
est installé dans `.claude/skills/` (via `npx ui-ux-pro-max-cli init --ai claude`),
ce qui ajoute :

`ui-ux-pro-max`, `design`, `design-system`, `ui-styling`, `brand`,
`banner-design`, `slides`.

Il s'active automatiquement sur les demandes UI/UX. Ses scripts de recherche
sont en Python (stdlib uniquement, aucun accès réseau) :

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "saas dashboard" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "beauty spa wellness" --design-system -p "Mon Projet"
```

**Prérequis :** Python 3.x. Pour mettre à jour : `npx ui-ux-pro-max-cli update`.

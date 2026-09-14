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

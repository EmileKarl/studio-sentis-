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

### Impeccable

[Impeccable](https://github.com/pbakaus/impeccable) est installé dans
`.claude/skills/impeccable/` (via `npx impeccable install --providers=claude
--scope=project`), avec ses 4 sous-agents dans `.claude/agents/`.

Un seul point d'entrée, 23 commandes :

```
/impeccable init          # à lancer en premier : écrit PRODUCT.md
/impeccable audit <cible>
/impeccable critique <cible>
/impeccable polish <cible>
```

Le détecteur (61 règles déterministes, sans LLM ni clé API) s'utilise aussi
directement :

```bash
.claude/skills/impeccable/scripts/impeccable detect src/
```

**Deux choses ne sont pas versionnées, volontairement :**

- `scripts/bin/` — le moteur est un binaire compilé par plateforme (~16 Mo).
  Le launcher le retélécharge au premier lancement et vérifie son sha256.
- `.claude/settings.local.json` — le hook Impeccable, qui lance le détecteur
  après chaque Edit/Write et en fin de tour. Upstream le veut machine-local.
  Chacun l'obtient en relançant `npx impeccable install`; pour l'activer pour
  toute l'équipe, déplacer son contenu dans `.claude/settings.json` (Impeccable
  le reconnaît aussi à cet endroit).

Pour mettre à jour : `npx impeccable update`.

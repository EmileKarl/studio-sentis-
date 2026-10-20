import type { CleService } from "@/lib/services-detail";

/**
 * Une illustration par page de métier, dessinée avec la grammaire du logo.
 *
 * **Pourquoi pas une banque d'images ni une icône de bibliothèque.** La charte
 * tient en trois primitives : un carré aux angles arrondis à 32 % de son côté,
 * un filet dont l'épaisseur vaut 5,5 % de la boîte, et la courbe du sourire.
 * Tout ce qui est dessiné ici n'est fait que de ces trois choses, aux mêmes
 * proportions. Une illustration conforme à la charte n'est pas une
 * illustration à laquelle on applique la couleur de la marque après coup :
 * c'est une illustration faite de ses formes.
 *
 * **Pourquoi pas de fond de section coloré.** Les quatre lavis existaient et
 * ont été retirés le 5 octobre, sur le constat du client : « comme un cahier
 * de couleurs ». La règle inscrite dans `parts.tsx` depuis ce jour-là est que
 * la couleur reste où elle signifie quelque chose — un titre, un chiffre, un
 * pictogramme, un bouton. Une illustration qui dit ce que fait la page en est
 * un ; un fond rose derrière un paragraphe, non.
 *
 * **La couleur vient du parent**, par `currentColor` : chaque page pose la
 * sienne sur l'enveloppe, et le dessin bascule seul en thème sombre puisque
 * les jetons d'accent le font déjà. Seuls les quatre points de la page Charte
 * portent des couleurs fixes, et pour cause : c'est la palette elle-même.
 *
 * Aucun JavaScript. Ces dessins sont dans le HTML livré.
 */

/** Le carré de la marque : rayon à 32 % du côté, filet à 5,5 % de la boîte. */
function Carre({
  x,
  y,
  cote,
  rempli = false,
  opacite = 1,
}: {
  x: number;
  y: number;
  cote: number;
  rempli?: boolean;
  opacite?: number;
}) {
  const trait = cote * 0.055;
  return (
    <rect
      x={x + trait / 2}
      y={y + trait / 2}
      width={cote - trait}
      height={cote - trait}
      rx={cote * 0.32}
      fill={rempli ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={trait}
      opacity={opacite}
    />
  );
}

/** Le sourire du logo, replacé dans un carré de `cote` posé en (x, y). */
function Sourire({
  x,
  y,
  cote,
  contraste = false,
}: {
  x: number;
  y: number;
  cote: number;
  contraste?: boolean;
}) {
  const k = cote / 40;
  const p = (a: number) => a * k;
  return (
    <path
      d={`M ${x + p(12.8)} ${y + p(18.2)} C ${x + p(14.2)} ${y + p(25.6)}, ${x + p(25.8)} ${y + p(25.6)}, ${x + p(27.2)} ${y + p(18.2)}`}
      fill="none"
      stroke={contraste ? "var(--accent-contrast)" : "currentColor"}
      strokeWidth={p(2.2)}
      strokeLinecap="round"
    />
  );
}

/**
 * Logo : trois pistes, une seule menée à terme.
 *
 * C'est littéralement ce que dit la page — trois directions, puis une qu'on
 * dessine jusqu'au bout. Les deux premières sont au filet et en retrait ; la
 * troisième est pleine et porte le sourire.
 */
function Logo() {
  return (
    <>
      <Carre x={4} y={4} cote={58} opacite={0.3} />
      <Carre x={28} y={28} cote={58} opacite={0.55} />
      <Carre x={52} y={52} cote={58} rempli />
      <Sourire x={52} y={52} cote={58} contraste />
    </>
  );
}

/**
 * Charte : le logo, sa zone de protection, et la palette.
 *
 * Les quatre points sont les quatre couleurs du livre. C'est le seul dessin du
 * site qui les montre ensemble, et c'est le bon endroit : la page parle de la
 * palette.
 */
function Charte() {
  return (
    <>
      {/* La zone de protection, en pointillé — la page 04 de la charte. */}
      <rect
        x={4}
        y={4}
        width={104}
        height={78}
        rx={6}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeDasharray="5 5"
        opacity={0.45}
      />
      <Carre x={29} y={11} cote={64} />
      <Sourire x={29} y={11} cote={64} />
      <g>
        {[
          { cx: 21, classe: "fill-accent-bleu" },
          { cx: 48, classe: "fill-accent-cyan" },
          { cx: 75, classe: "fill-accent-violet" },
          { cx: 102, classe: "fill-accent-vert" },
        ].map(({ cx, classe }) => (
          <circle key={cx} cx={cx} cy={104} r={9} className={classe} />
        ))}
      </g>
    </>
  );
}

/**
 * Site web : le même site sur deux écrans.
 *
 * Un rectangle large, un étroit par-dessus. Les deux portent le même rayon
 * relatif que le carré de la marque, donc ils appartiennent à la même famille
 * de formes sans être le logo.
 */
function Site() {
  return (
    <>
      <rect
        x={3}
        y={16}
        width={94}
        height={64}
        rx={10}
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
      />
      {/* Les deux lignes de contenu : la mesure courte de la charte. */}
      <g stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" opacity={0.5}>
        <line x1={17} y1={38} x2={66} y2={38} />
        <line x1={17} y1={52} x2={48} y2={52} />
      </g>
      <rect
        x={74}
        y={48}
        width={43}
        height={69}
        rx={11}
        fill="var(--surface)"
        stroke="currentColor"
        strokeWidth={3.5}
      />
      <g stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" opacity={0.5}>
        <line x1={85} y1={70} x2={106} y2={70} />
        <line x1={85} y1={82} x2={99} y2={82} />
      </g>
    </>
  );
}

/**
 * Application : l'outil posé dans la main.
 *
 * Le téléphone est un carré de la marque étiré ; l'icône à l'intérieur en est
 * un vrai, avec son sourire. C'est l'application du studio sur l'appareil du
 * client, et c'est aussi la seule composition où le logo apparaît en entier.
 */
function Application() {
  return (
    <>
      <rect
        x={26}
        y={4}
        width={68}
        height={112}
        rx={18}
        fill="none"
        stroke="currentColor"
        strokeWidth={3.7}
      />
      <Carre x={44} y={22} cote={32} rempli />
      <Sourire x={44} y={22} cote={32} contraste />
      <g stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" opacity={0.5}>
        <line x1={40} y1={70} x2={80} y2={70} />
        <line x1={40} y1={83} x2={66} y2={83} />
      </g>
      {/* La barre de retour : ce qui fait lire « téléphone » et non « carte ». */}
      <line
        x1={48}
        y1={103}
        x2={72}
        y2={103}
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        opacity={0.35}
      />
    </>
  );
}

const DESSINS: Record<CleService, () => React.JSX.Element> = {
  logo: Logo,
  charte: Charte,
  site: Site,
  application: Application,
};

export function IllustrationService({
  cle,
  className,
}: {
  cle: CleService;
  className?: string;
}) {
  const Dessin = DESSINS[cle];
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden
      className={className}
      strokeLinejoin="round"
    >
      <Dessin />
    </svg>
  );
}

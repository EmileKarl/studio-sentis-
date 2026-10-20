import type { CleService } from "@/lib/services-detail";

/**
 * Seize petits dessins : quatre étapes pour chacun des quatre métiers.
 *
 * **D'où vient cette page du cahier des charges.** Le client a demandé des
 * illustrations de banque d'images — Freepik, Pinterest — montrant « comment
 * est conçu un logo », « comment se construit un site », « le design UX ».
 * L'intention est bonne : montrer le travail plutôt que l'affirmer. Le moyen
 * ne l'était pas. Pinterest n'est pas une source : c'est le travail d'autres
 * gens, sans licence, et le poser sur le site d'un studio qui promet « les
 * droits sont à vous, écrits noir sur blanc » serait la contradiction la plus
 * chère possible. Freepik est licite mais impose une attribution visible en
 * gratuit, un abonnement sinon — et son style plat jurerait avec le reste.
 *
 * Alors ils sont dessinés ici, avec les mêmes primitives que le logo : le
 * carré aux angles arrondis à 32 % de son côté, le filet à 5,5 % de la boîte,
 * la courbe du sourire. Rien d'autre. Un studio de design qui illustre ses
 * propres pages avec de la banque d'images dit quelque chose de lui ; celui-ci
 * dit l'inverse.
 *
 * **Ils informent, ils ne décorent pas.** Chacun est posé au-dessus de
 * l'étape qu'il montre, et il montre réellement ce que l'étape dit — la
 * grille de construction, les trois pistes, le périmètre écrit avec ses
 * exclusions, les trois écrans de la maquette. C'est la condition pour qu'un
 * dessin ait sa place : s'il peut être retiré sans rien perdre, il n'aurait
 * pas dû être là.
 *
 * `currentColor`, aucun JavaScript, présents dans le HTML livré.
 */

const BOITE = 64;

/** Le carré de la marque, aux proportions de la charte. */
function C({
  x,
  y,
  c,
  plein = false,
  o = 1,
}: {
  x: number;
  y: number;
  c: number;
  plein?: boolean;
  o?: number;
}) {
  const t = c * 0.055;
  return (
    <rect
      x={x + t / 2}
      y={y + t / 2}
      width={c - t}
      height={c - t}
      rx={c * 0.32}
      fill={plein ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={t}
      opacity={o}
    />
  );
}

/** Un trait. Épaisseur unique, pour que seize dessins fassent une famille. */
function L({
  x1,
  y1,
  x2,
  y2,
  o = 1,
  pointille = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  o?: number;
  pointille?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      opacity={o}
      strokeDasharray={pointille ? "3 3" : undefined}
    />
  );
}

/** Le sourire du logo, replacé dans un carré de côté `c`. */
function S({ x, y, c }: { x: number; y: number; c: number }) {
  const k = c / 40;
  const p = (a: number) => a * k;
  return (
    <path
      d={`M ${x + p(12.8)} ${y + p(18.2)} C ${x + p(14.2)} ${y + p(25.6)}, ${x + p(25.8)} ${y + p(25.6)}, ${x + p(27.2)} ${y + p(18.2)}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={p(2.2)}
      strokeLinecap="round"
    />
  );
}

function O({ cx, cy, r, o = 1 }: { cx: number; cy: number; r: number; o?: number }) {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill="currentColor"
      opacity={o}
    />
  );
}

/** Un rectangle libre — écran, page, téléphone. */
function R({
  x,
  y,
  w,
  h,
  r = 4,
  plein = false,
  o = 1,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  plein?: boolean;
  o?: number;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={plein ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2.2}
      opacity={o}
    />
  );
}

/** Une flèche courte, pour les enchaînements. */
function F({ x, y }: { x: number; y: number }) {
  return (
    <g stroke="currentColor" strokeWidth={2} strokeLinecap="round" opacity={0.55}>
      <line x1={x} y1={y} x2={x + 7} y2={y} />
      <polyline points={`${x + 4},${y - 3} ${x + 7},${y} ${x + 4},${y + 3}`} fill="none" />
    </g>
  );
}

const DESSINS: Record<CleService, React.JSX.Element[]> = {
  // Création de logo : on parle · trois pistes · une menée à terme · livraison
  logo: [
    <>
      {/* Deux interlocuteurs, et ce qui se dit entre eux. */}
      <C x={4} y={14} c={22} />
      <C x={38} y={14} c={22} />
      <L x1={30} y1={25} x2={34} y2={25} o={0.5} />
      <L x1={14} y1={46} x2={50} y2={46} o={0.45} />
      <L x1={14} y1={54} x2={38} y2={54} o={0.45} />
    </>,
    <>
      {/* Trois directions, franchement différentes. */}
      <C x={3} y={21} c={18} />
      <C x={23} y={21} c={18} plein />
      <C x={43} y={21} c={18} o={0.5} />
      <L x1={8} y1={48} x2={16} y2={48} o={0.4} />
      <L x1={28} y1={48} x2={36} y2={48} o={0.4} />
      <L x1={48} y1={48} x2={56} y2={48} o={0.4} />
    </>,
    <>
      {/* La grille de construction : c'est là que le dessin se règle. */}
      <L x1={6} y1={32} x2={58} y2={32} o={0.3} pointille />
      <L x1={32} y1={6} x2={32} y2={58} o={0.3} pointille />
      <circle cx={32} cy={32} r={24} fill="none" stroke="currentColor" strokeWidth={1.4} opacity={0.3} strokeDasharray="3 3" />
      <C x={12} y={12} c={40} />
      <S x={12} y={12} c={40} />
    </>,
    <>
      {/* Les déclinaisons : du grand format au favicon. */}
      <C x={4} y={18} c={28} plein />
      <C x={36} y={26} c={16} plein />
      <C x={54} y={32} c={8} plein />
      <L x1={6} y1={54} x2={58} y2={54} o={0.35} />
    </>,
  ],

  // Charte : le logo · les couleurs · la typographie et les règles · le document
  charte: [
    <>
      <C x={18} y={14} c={28} />
      <S x={18} y={14} c={28} />
      <L x1={10} y1={54} x2={54} y2={54} o={0.35} pointille />
    </>,
    <>
      {/* Quatre couleurs, et leur lavis au-dessous. */}
      <O cx={13} cy={24} r={7} />
      <O cx={30} cy={24} r={7} />
      <O cx={47} cy={24} r={7} />
      <O cx={13} cy={42} r={7} o={0.25} />
      <O cx={30} cy={42} r={7} o={0.25} />
      <O cx={47} cy={42} r={7} o={0.25} />
    </>,
    <>
      {/* Une famille, plusieurs graisses : des barres d'épaisseurs croissantes. */}
      <rect x={8} y={16} width={40} height={3} rx={1.5} fill="currentColor" opacity={0.45} />
      <rect x={8} y={26} width={40} height={5} rx={2.5} fill="currentColor" opacity={0.7} />
      <rect x={8} y={38} width={40} height={8} rx={4} fill="currentColor" />
      {/* La mesure : la largeur maximale d'une ligne de texte. */}
      <L x1={8} y1={54} x2={48} y2={54} o={0.35} />
    </>,
    <>
      {/* Le document, et les pages qu'il y a dessous. */}
      <R x={16} y={8} w={36} h={46} r={3} o={0.3} />
      <R x={12} y={12} w={36} h={46} r={3} o={0.55} />
      <R x={8} y={16} w={36} h={42} r={3} />
      <L x1={14} y1={28} x2={38} y2={28} o={0.5} />
      <L x1={14} y1={36} x2={32} y2={36} o={0.5} />
      <L x1={14} y1={44} x2={36} y2={44} o={0.5} />
    </>,
  ],

  // Site web : le cadrage · la maquette · la construction · la mise en ligne
  site: [
    <>
      {/* Le périmètre écrit, et ce qui est coché. */}
      <R x={12} y={8} w={40} h={48} r={4} />
      <L x1={19} y1={22} x2={45} y2={22} o={0.5} />
      <L x1={19} y1={32} x2={45} y2={32} o={0.5} />
      <L x1={19} y1={42} x2={36} y2={42} o={0.5} />
      <polyline points="38,41 41,44 47,37" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </>,
    <>
      {/* La maquette : des blocs avant d'être des pages. */}
      <R x={6} y={12} w={52} h={40} r={4} />
      <rect x={12} y={18} width={40} height={6} rx={3} fill="currentColor" opacity={0.25} />
      <rect x={12} y={28} width={18} height={18} rx={3} fill="currentColor" opacity={0.25} />
      <rect x={34} y={28} width={18} height={8} rx={3} fill="currentColor" opacity={0.25} />
      <rect x={34} y={39} width={18} height={7} rx={3} fill="currentColor" opacity={0.25} />
    </>,
    <>
      {/* La construction : les mêmes blocs, devenus du contenu. */}
      <R x={6} y={12} w={52} h={40} r={4} />
      <L x1={12} y1={21} x2={30} y2={21} />
      <rect x={12} y={28} width={18} height={18} rx={3} fill="currentColor" opacity={0.55} />
      <L x1={34} y1={31} x2={52} y2={31} o={0.6} />
      <L x1={34} y1={38} x2={46} y2={38} o={0.6} />
      <rect x={34} y={43} width={14} height={5} rx={2.5} fill="currentColor" />
    </>,
    <>
      {/* En ligne : le même site sur deux écrans. */}
      <R x={4} y={14} w={38} h={28} r={4} />
      <R x={44} y={22} w={16} h={28} r={4} />
      <L x1={10} y1={24} x2={30} y2={24} o={0.5} />
      <L x1={10} y1={32} x2={24} y2={32} o={0.5} />
      <L x1={48} y1={32} x2={56} y2={32} o={0.5} />
      <L x1={48} y1={39} x2={53} y2={39} o={0.5} />
    </>,
  ],

  // Application : observer · écrire le périmètre · maquetter · chiffrer
  application: [
    <>
      {/* Ce qui se note à la main, et ce qui se recopie deux fois. */}
      <R x={10} y={10} w={30} h={40} r={3} o={0.45} />
      <R x={20} y={18} w={30} h={40} r={3} />
      <L x1={26} y1={30} x2={44} y2={30} o={0.5} />
      <L x1={26} y1={38} x2={44} y2={38} o={0.5} />
      <L x1={26} y1={46} x2={36} y2={46} o={0.5} />
    </>,
    <>
      {/* Le périmètre : ce qui est dedans, et ce qui est dehors. */}
      {/* Le cadre est en pointillé : un périmètre, pas une boîte fermée. */}
      <rect
        x={6}
        y={14}
        width={52}
        height={36}
        rx={5}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeDasharray="4 4"
      />
      <polyline points="16,31 20,35 28,26" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" opacity={0.45}>
        <line x1={38} y1={27} x2={48} y2={37} />
        <line x1={48} y1={27} x2={38} y2={37} />
      </g>
    </>,
    <>
      {/* La maquette cliquable : trois écrans, et le chemin entre eux. */}
      <R x={2} y={16} w={16} h={32} r={4} />
      <F x={20} y={32} />
      <R x={30} y={16} w={16} h={32} r={4} />
      <F x={48} y={32} />
      <R x={56} y={22} w={6} h={20} r={3} o={0.4} />
    </>,
    <>
      {/* La soumission : un prix ferme, et une date. */}
      <R x={12} y={10} w={40} h={44} r={4} />
      <L x1={19} y1={22} x2={45} y2={22} o={0.4} />
      <rect x={19} y={30} width={26} height={8} rx={4} fill="currentColor" />
      <L x1={19} y1={46} x2={34} y2={46} o={0.4} />
    </>,
  ],
};

export function EtapeDessin({
  cle,
  index,
  className,
}: {
  cle: CleService;
  /** De 0 à 3 : l'étape que ce dessin montre. */
  index: number;
  className?: string;
}) {
  const dessin = DESSINS[cle][index];
  if (!dessin) return null;
  return (
    <svg
      viewBox={`0 0 ${BOITE} ${BOITE}`}
      aria-hidden
      className={className}
      strokeLinejoin="round"
    >
      {dessin}
    </svg>
  );
}

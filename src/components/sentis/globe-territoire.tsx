"use client";

import { useEffect, useRef } from "react";

import { COTES } from "@/lib/cotes";
import { cn } from "@/lib/utils";

/**
 * Globe terrestre : le territoire desservi, et la portée en ligne.
 *
 * Il remplace un schéma plat qui simplifiait à l'excès la géographie du coin.
 * Ici, tout ce qui peut être exact l'est : les côtes viennent de Natural Earth
 * (voir `src/lib/cotes.ts`) et Châteauguay est placée à ses coordonnées
 * réelles, 45,363° N et 73,749° O.
 *
 * Une seule chose ne l'est pas, et elle est écrite sous le dessin : **le halo
 * local est symbolique**. À cette échelle, un globe de trois cents pixels, la
 * Montérégie mesure moins de deux pixels — la dessiner à l'échelle reviendrait
 * à ne rien dessiner. Les arcs qui partent vers le reste du monde disent la
 * même chose que la ligne « ailleurs, en ligne » : ils parlent de portée, pas
 * de clients.
 *
 * Le globe est décoratif et `aria-hidden` : les villes desservies sont
 * énumérées en toutes lettres juste à côté, en texte que lit un lecteur
 * d'écran.
 *
 * Rendu en canvas 2D plutôt qu'en WebGL : il n'y a ici que des polylignes et
 * une projection à quatre lignes de trigonométrie. Une scène 3D serait de la
 * machinerie pour rien.
 */

/** Châteauguay, Québec. */
const BASE = { lon: -73.749, lat: 45.363 };

/**
 * Projection orthographique — celle d'un globe vu de loin.
 *
 * `cosc` est le cosinus de la distance angulaire au centre de la vue : positif,
 * le point est sur la face tournée vers nous ; négatif, il est derrière. C'est
 * ce seul test qui fait tout le travail de « face cachée ».
 */
function projeter(lon: number, lat: number, lon0: number, lat0: number) {
  const rad = Math.PI / 180;
  const l = (lon - lon0) * rad;
  const p = lat * rad;
  const p0 = lat0 * rad;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  return {
    x: Math.cos(p) * Math.sin(l),
    y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l),
    visible: cosc > 0,
  };
}

/** Points d'un grand cercle entre deux positions — le plus court chemin réel. */
function grandCercle(
  a: { lon: number; lat: number },
  b: { lon: number; lat: number },
  pas = 48,
) {
  const rad = Math.PI / 180;
  const [la1, lo1, la2, lo2] = [a.lat * rad, a.lon * rad, b.lat * rad, b.lon * rad];
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((la2 - la1) / 2) ** 2 +
          Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2,
      ),
    );
  const pts: [number, number][] = [];
  for (let i = 0; i <= pas; i++) {
    const f = i / pas;
    const A = Math.sin((1 - f) * d) / Math.sin(d);
    const B = Math.sin(f * d) / Math.sin(d);
    const x = A * Math.cos(la1) * Math.cos(lo1) + B * Math.cos(la2) * Math.cos(lo2);
    const y = A * Math.cos(la1) * Math.sin(lo1) + B * Math.cos(la2) * Math.sin(lo2);
    const z = A * Math.sin(la1) + B * Math.sin(la2);
    pts.push([
      Math.atan2(y, x) / rad,
      Math.atan2(z, Math.sqrt(x * x + y * y)) / rad,
    ]);
  }
  return pts;
}

/**
 * Quatre destinations lointaines, réparties sur le globe.
 *
 * Elles ne sont pas nommées à l'écran et ne prétendent rien : elles servent
 * seulement à faire partir des arcs dans quatre directions, pour que « en
 * ligne » se voie au lieu de s'écrire.
 */
const DIRECTIONS = [
  { lon: 2.35, lat: 48.86 },
  { lon: -123.1, lat: 49.28 },
  { lon: -46.63, lat: -23.55 },
  { lon: 139.69, lat: 35.69 },
];

export function GlobeTerritoire({
  className,
  legende,
}: {
  className?: string;
  /** Le libellé posé près du point, dans la langue de la page. */
  legende: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx0 = canvas.getContext("2d");
    if (!ctx0) return;
    // Recopié dans une constante : TypeScript perd le rétrécissement de type
    // à l'intérieur d'une fonction déclarée plus bas, qui est remontée.
    const ctx = ctx0;

    // Les couleurs sont lues sur les variables CSS héritées : le globe suit
    // donc le thème clair et le thème sombre sans seconde version.
    const jeton = (nom: string, repli: string) => {
      const v = getComputedStyle(canvas).getPropertyValue(nom).trim();
      return v || repli;
    };

    let l = 0;
    let h = 0;
    let R = 0;
    let cx = 0;
    let cy = 0;

    const dimensionner = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      l = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(l * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // De la marge pour l'étiquette et les arcs qui dépassent du disque.
      R = Math.min(l, h) / 2 - 26;
      cx = l / 2;
      cy = h / 2;
    };
    dimensionner();

    const ecran = (p: { x: number; y: number }) => [cx + p.x * R, cy - p.y * R];

    /** Une polyligne géographique, coupée là où elle passe derrière. */
    function trait(pts: [number, number][], lon0: number, lat0: number) {
      let trace = false;
      ctx.beginPath();
      for (const [lon, lat] of pts) {
        const p = projeter(lon, lat, lon0, lat0);
        if (!p.visible) {
          trace = false;
          continue;
        }
        const [x, y] = ecran(p);
        if (trace) ctx.lineTo(x, y);
        else {
          ctx.moveTo(x, y);
          trace = true;
        }
      }
      ctx.stroke();
    }

    const dessiner = (lon0: number, lat0: number, temps: number) => {
      const encre = jeton("--ink-secondary", "#4a443c");
      const filet = jeton("--rule", "#e0d9cb");
      const accent = jeton("--accent-bleu", "#1d4ed8");
      const teinte = jeton("--teinte-bleu", "#e2ecff");
      const sourd = jeton("--ink-muted", "#6e6659");
      const papier = jeton("--paper", "#fcfaf6");

      ctx.clearRect(0, 0, l, h);

      // Le disque : la Terre vue de loin.
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = teinte;
      ctx.fill();
      ctx.strokeStyle = filet;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Parallèles et méridiens, tous les 30°.
      ctx.strokeStyle = filet;
      ctx.lineWidth = 1;
      for (let lat = -60; lat <= 60; lat += 30) {
        const pts: [number, number][] = [];
        for (let lon = -180; lon <= 180; lon += 4) pts.push([lon, lat]);
        trait(pts, lon0, lat0);
      }
      for (let lon = -180; lon < 180; lon += 30) {
        const pts: [number, number][] = [];
        for (let lat = -90; lat <= 90; lat += 4) pts.push([lon, lat]);
        trait(pts, lon0, lat0);
      }

      // Les côtes.
      ctx.strokeStyle = encre;
      ctx.lineWidth = 1.1;
      for (const ligne of COTES) {
        const pts: [number, number][] = [];
        for (let i = 0; i < ligne.length; i += 2) pts.push([ligne[i], ligne[i + 1]]);
        trait(pts, lon0, lat0);
      }

      // Les arcs de la portée en ligne, depuis Châteauguay.
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.7;
      for (const d of DIRECTIONS) trait(grandCercle(BASE, d), lon0, lat0);
      ctx.globalAlpha = 1;

      // Le point de départ, et son halo — symbolique, c'est écrit dessous.
      const base = projeter(BASE.lon, BASE.lat, lon0, lat0);
      if (base.visible) {
        const [x, y] = ecran(base);
        const battement = 0.5 + 0.5 * Math.sin(temps * 1.6);
        ctx.strokeStyle = accent;
        for (const [rayon, alpha] of [
          [9 + battement * 3, 0.5],
          [16 + battement * 5, 0.28],
        ] as const) {
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, rayon, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // L'étiquette bascule du côté où il reste de la place, et se pose
        // au-delà du halo : collée au point, elle se lisait par-dessus les
        // anneaux. Un fond opaque la sépare des côtes, qu'elle traverse
        // forcément à un moment ou à un autre de la rotation.
        const aGauche = x > l * 0.58;
        const marge = 30;
        ctx.font = `600 12px ${getComputedStyle(canvas).fontFamily}`;
        const largeurTexte = ctx.measureText(legende).width;
        const tx = aGauche ? x - marge : x + marge;
        ctx.fillStyle = papier;
        ctx.beginPath();
        ctx.roundRect(
          aGauche ? tx - largeurTexte - 5 : tx - 5,
          y - 9,
          largeurTexte + 10,
          18,
          4,
        );
        ctx.fill();
        ctx.fillStyle = encre;
        ctx.textAlign = aGauche ? "right" : "left";
        ctx.textBaseline = "middle";
        ctx.fillText(legende, tx, y);
      }

      // Le repère d'échelle, en bas : la seule mention qui compte.
      ctx.fillStyle = sourd;
      ctx.font = `11px ${getComputedStyle(canvas).fontFamily}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText("Halo symbolique — la Montérégie ferait 2 px", cx, h - 6);
    };

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = true;
    let survol = false;
    const depart = performance.now();
    // La vue part sur Châteauguay : la première image montre ce qui compte.
    let lon0 = BASE.lon;

    const boucle = () => {
      raf = requestAnimationFrame(boucle);
      if (!visible || document.hidden) return;
      const t = (performance.now() - depart) / 1000;
      // Un tour en 72 secondes, arrêté au survol pour laisser lire l'étiquette.
      if (!survol) lon0 = BASE.lon + t * 5;
      dessiner(lon0, 22, t);
    };

    const io = new IntersectionObserver((e) => {
      visible = e[0]?.isIntersecting ?? false;
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      dimensionner();
      if (reduit.matches) dessiner(BASE.lon, 22, 0);
    });
    ro.observe(canvas);

    const entrer = () => (survol = true);
    const sortir = () => (survol = false);
    canvas.addEventListener("pointerenter", entrer);
    canvas.addEventListener("pointerleave", sortir);

    if (reduit.matches) dessiner(BASE.lon, 22, 0);
    else boucle();

    const surChangement = () => {
      cancelAnimationFrame(raf);
      if (reduit.matches) dessiner(BASE.lon, 22, 0);
      else boucle();
    };
    reduit.addEventListener("change", surChangement);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      reduit.removeEventListener("change", surChangement);
      canvas.removeEventListener("pointerenter", entrer);
      canvas.removeEventListener("pointerleave", sortir);
    };
  }, [legende]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("block h-[300px] w-full", className)}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Fond 3D en WebGL — un nuage de points projeté en vraie perspective.
 *
 * Pourquoi pas Three.js : cette scène ne fait qu'une chose, projeter quelques
 * milliers de points. Une bibliothèque de 150 ko gzippés pour cela contredirait
 * l'argument du studio, qui est de livrer des sites rapides. Le programme
 * ci-dessous fait 40 lignes de GLSL et ne coûte rien au chargement.
 *
 * Trois règles tiennent cette scène :
 *
 * 1. Elle est décorative. `aria-hidden`, aucun texte, aucune information. Un
 *    lecteur d'écran ne la rencontre jamais, et la page se comprend sans elle.
 * 2. Elle ne touche pas au contraste. La couleur vient de `--rule-strong` et
 *    l'opacité plafonne à `alpha` ; les points passent derrière le texte, pas
 *    dessous à lutter avec lui. Le contrôle navigateur échantillonne les
 *    pixels sous les titres pour le vérifier.
 * 3. Sous `prefers-reduced-motion`, elle rend **une seule image** et s'arrête.
 *    La profondeur reste, le mouvement disparaît — plutôt qu'une page vide.
 *
 * La boucle s'arrête aussi hors écran (IntersectionObserver), en arrière-plan
 * d'onglet, et à la perte de contexte WebGL.
 */

export type Variante3D =
  | "treillis"
  | "onde"
  | "anneau"
  | "poussiere"
  // Ajoutés après comparaison en mouvement de trois candidats. Le troisième,
  // un ruban de Möbius, a été écarté ; il ne reste rien de lui.
  | "helice"
  | "constellation";

const VS = `
attribute vec3 aPos;
attribute float aSeed;
uniform mat4 uRot;
uniform float uTime;
uniform float uCam;
uniform float uSize;
uniform vec2 uAspect;
uniform vec2 uOffset;
uniform int uMode;
varying float vDepth;
varying float vSeed;

void main() {
  vec3 pos = aPos;

  // Mode « onde » : le plan de points ondule en profondeur. Le déplacement est
  // calculé ici plutôt qu'en JavaScript — c'est le seul endroit où il ne coûte
  // rien, quelle que soit la densité.
  if (uMode == 1) {
    pos.z += 0.42 * sin(pos.x * 1.7 + uTime * 0.9) * cos(pos.y * 1.3 - uTime * 0.6);
  }
  // Mode « poussière » : dérive lente, chaque point sur son propre rythme.
  if (uMode == 3) {
    pos.y += 0.22 * sin(uTime * 0.35 + aSeed * 6.28);
    pos.x += 0.16 * cos(uTime * 0.27 + aSeed * 3.14);
  }

  vec4 p = uRot * vec4(pos, 1.0);
  p.z += uCam;

  float w = max(p.z, 0.35);
  gl_Position = vec4((p.xy / w) * uAspect + uOffset, 0.0, 1.0);
  gl_PointSize = clamp(uSize / w, 1.0, 9.0);

  // Les points lointains s'effacent : c'est ce qui fait lire la profondeur.
  vDepth = clamp(1.25 - (w - (uCam - 2.0)) / 4.2, 0.0, 1.0);
  vSeed = aSeed;
}
`;

const FS = `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uAlpha;
uniform float uPoint;
varying float vDepth;
varying float vSeed;

void main() {
  // gl_PointCoord n'a de sens que pour GL_POINTS ; sur une ligne il est
  // indéfini, d'où le drapeau plutôt qu'un second programme.
  float bord = 1.0;
  if (uPoint > 0.5) {
    vec2 d = gl_PointCoord - 0.5;
    float r2 = dot(d, d);
    if (r2 > 0.25) discard;
    bord = smoothstep(0.25, 0.04, r2);
  }
  float a = uAlpha * vDepth * bord * (0.55 + 0.45 * vSeed);

  // Trois couleurs réparties sur la graine du sommet, déjà tirée entre 0 et 1
  // pour moduler l'opacité. Aucune géométrie ni aucun attribut de plus : le
  // dégradé traverse le nuage, deux points voisins ne sont donc pas de la même
  // couleur et le volume gagne en profondeur sans gagner en densité.
  //
  // Quand la page ne déclare qu'une couleur, les trois uniformes valent la
  // même valeur et le mélange est un no-op : les autres scènes du site ne
  // changent pas d'un pixel.
  vec3 teinte = vSeed < 0.5
    ? mix(uColor, uColor2, vSeed * 2.0)
    : mix(uColor2, uColor3, (vSeed - 0.5) * 2.0);

  gl_FragColor = vec4(teinte * a, a);
}
`;

/**
 * Géométrie de la scène : un nuage de points **et** ses arêtes.
 *
 * Les arêtes font tout le travail. Un nuage de points seul lit comme du bruit ;
 * ce sont les lignes qui, en se déformant avec la perspective, donnent le
 * volume. C'est aussi pour cela que la densité reste basse : un fil de fer
 * lisible vaut mieux qu'un maillage saturé.
 */
function nuage(variante: Variante3D): {
  pos: Float32Array;
  seeds: Float32Array;
  lignes: Float32Array;
  seedsL: Float32Array;
} {
  const pts: number[] = [];
  const lns: number[] = [];
  // Générateur déterministe : deux chargements donnent la même scène, ce qui
  // rend les captures comparables d'une vérification à l'autre.
  let graine = 1;
  const rnd = () => {
    graine = (graine * 1664525 + 1013904223) % 4294967296;
    return graine / 4294967296;
  };
  const arete = (a: number[], b: number[]) => lns.push(...a, ...b);

  if (variante === "treillis") {
    const n = 6;
    const d = 4.6;
    const at = (i: number, j: number, k: number) => [
      (i / (n - 1) - 0.5) * d,
      (j / (n - 1) - 0.5) * d,
      (k / (n - 1) - 0.5) * d,
    ];
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        for (let k = 0; k < n; k++) {
          pts.push(...at(i, j, k));
          if (i < n - 1) arete(at(i, j, k), at(i + 1, j, k));
          if (j < n - 1) arete(at(i, j, k), at(i, j + 1, k));
          if (k < n - 1) arete(at(i, j, k), at(i, j, k + 1));
        }
  } else if (variante === "onde") {
    // Plan de relief : les lignes de la trame ondulent en profondeur. Le
    // déplacement se fait dans le vertex shader, donc la grille suffit ici.
    const nx = 30;
    const ny = 18;
    const at = (i: number, j: number) => [
      (i / (nx - 1) - 0.5) * 7.2,
      (j / (ny - 1) - 0.5) * 4.2,
      0,
    ];
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < ny; j++) {
        pts.push(...at(i, j));
        if (i < nx - 1) arete(at(i, j), at(i + 1, j));
        if (j < ny - 1) arete(at(i, j), at(i, j + 1));
      }
  } else if (variante === "anneau") {
    const grand = 44;
    const petit = 14;
    const R = 1.85;
    const r = 0.7;
    const at = (i: number, j: number) => {
      const u = (i / grand) * Math.PI * 2;
      const v = (j / petit) * Math.PI * 2;
      return [
        (R + r * Math.cos(v)) * Math.cos(u),
        (R + r * Math.cos(v)) * Math.sin(u),
        r * Math.sin(v),
      ];
    };
    for (let i = 0; i < grand; i++)
      for (let j = 0; j < petit; j++) {
        pts.push(...at(i, j));
        arete(at(i, j), at((i + 1) % grand, j));
        arete(at(i, j), at(i, (j + 1) % petit));
      }
  } else if (variante === "helice") {
    // Double hélice : deux spirales entrelacées, reliées par des barreaux.
    //
    // Sa silhouette est **verticale et ouverte**, là où l'anneau est fermé et
    // le treillis cubique : c'est ce qui la distingue d'un coup d'œil. Elle se
    // lit comme un déroulement, un enchaînement d'étapes — d'où sa place
    // naturelle sur Services, qui décrit une méthode.
    const tours = 3.2;
    const pas = 34;
    const n = Math.round(tours * pas);
    const R = 1.5;
    const hauteur = 5.4;
    const brin = (i: number, phase: number) => {
      const u = (i / pas) * Math.PI * 2 + phase;
      return [R * Math.cos(u), (i / n - 0.5) * hauteur, R * Math.sin(u)];
    };
    for (let i = 0; i < n; i++) {
      for (const phase of [0, Math.PI]) {
        pts.push(...brin(i, phase));
        if (i < n - 1) arete(brin(i, phase), brin(i + 1, phase));
      }
      // Un barreau sur quatre : tous, le volume se remplit et redevient un
      // cylindre plein ; aucun, les deux brins ne se lisent plus comme un
      // même objet.
      if (i % 4 === 0) arete(brin(i, 0), brin(i, Math.PI));
    }
  } else if (variante === "constellation") {
    // Constellation : un nuage clairsemé dont seuls les points **proches**
    // sont reliés.
    //
    // Le graphe est calculé une fois, à la génération ; c'est la dérive du
    // shader qui donne ensuite l'impression que les liens respirent. Elle se
    // lit comme un réseau de relations — ce qu'une page Réalisations raconte
    // quand elle n'a pas encore de réalisations : des liens à établir.
    const n = 150;
    const points: number[][] = [];
    for (let i = 0; i < n; i++) {
      points.push([(rnd() - 0.5) * 6.4, (rnd() - 0.5) * 4.2, (rnd() - 0.5) * 3]);
      pts.push(...points[i]);
    }
    const seuil = 1.15;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dz = points[i][2] - points[j][2];
        if (dx * dx + dy * dy + dz * dz < seuil * seuil) arete(points[i], points[j]);
      }
  } else {
    // Poussière : pas d'arêtes. Le volume vient de la taille des points et de
    // leur dérive à des rythmes différents.
    for (let i = 0; i < 900; i++) {
      pts.push((rnd() - 0.5) * 7, (rnd() - 0.5) * 4.6, (rnd() - 0.5) * 3.4);
    }
  }

  const seeds = new Float32Array(pts.length / 3);
  for (let i = 0; i < seeds.length; i++) seeds[i] = rnd();
  const seedsL = new Float32Array(lns.length / 3);
  for (let i = 0; i < seedsL.length; i++) seedsL[i] = 0.7 + rnd() * 0.3;
  return {
    pos: new Float32Array(pts),
    seeds,
    lignes: new Float32Array(lns),
    seedsL,
  };
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** Rotation yaw/pitch en colonne-major, sans dépendance mathématique. */
function matrice(yaw: number, pitch: number) {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  // Ry puis Rx
  return new Float32Array([
    cy, sy * sp, -sy * cp, 0,
    0, cp, sp, 0,
    sy, -cy * sp, cy * cp, 0,
    0, 0, 0, 1,
  ]);
}

export function Scene3D({
  variante = "treillis",
  alpha = 0.5,
  vitesse = 1,
  scroll = 1,
  decalage = 0,
  zoom = 1,
  className,
}: {
  variante?: Variante3D;
  /** Opacité maximale d'un point au premier plan. */
  alpha?: number;
  /** Multiplicateur de la rotation continue. */
  vitesse?: number;
  /** Part de la rotation pilotée par le défilement. */
  scroll?: number;
  /**
   * Décalage horizontal de l'objet, en coordonnées d'écran (−1 à 1). Il sert à
   * poser le volume dans la colonne libre plutôt que derrière le texte : le
   * masque CSS atténue, ce décalage déplace.
   */
  decalage?: number;
  /** Distance de caméra. Sous 1 l'objet grossit, au-dessus il s'éloigne. */
  zoom?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl =
      (canvas.getContext("webgl", { antialias: true, alpha: true, depth: false }) as
        | WebGLRenderingContext
        | null) ?? null;
    // Pas de WebGL (machine ancienne, pilote bloqué, rendu logiciel désactivé) :
    // on ne rend rien. La page garde sa trame CSS et ne perd que le décor.
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const { pos, seeds, lignes, seedsL } = nuage(variante);
    const aPos = gl.getAttribLocation(prog, "aPos");
    const aSeed = gl.getAttribLocation(prog, "aSeed");
    gl.enableVertexAttribArray(aPos);
    gl.enableVertexAttribArray(aSeed);

    const tampon = (data: Float32Array) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };
    const bufPos = tampon(pos);
    const bufSeed = tampon(seeds);
    const bufLignes = lignes.length ? tampon(lignes) : null;
    const bufSeedL = seedsL.length ? tampon(seedsL) : null;

    const u = {
      rot: gl.getUniformLocation(prog, "uRot"),
      time: gl.getUniformLocation(prog, "uTime"),
      cam: gl.getUniformLocation(prog, "uCam"),
      size: gl.getUniformLocation(prog, "uSize"),
      aspect: gl.getUniformLocation(prog, "uAspect"),
      offset: gl.getUniformLocation(prog, "uOffset"),
      mode: gl.getUniformLocation(prog, "uMode"),
      color: gl.getUniformLocation(prog, "uColor"),
      color2: gl.getUniformLocation(prog, "uColor2"),
      color3: gl.getUniformLocation(prog, "uColor3"),
      alpha: gl.getUniformLocation(prog, "uAlpha"),
      point: gl.getUniformLocation(prog, "uPoint"),
    };

    // Les deux nouveaux volumes réutilisent les modes de déplacement existants
    // plutôt que d'en ajouter au shader : l'hélice respire comme le treillis,
    // la constellation dérive comme la poussière.
    const modeNum = {
      treillis: 0,
      onde: 1,
      anneau: 2,
      poussiere: 3,
      helice: 0,
      constellation: 3,
    }[variante];
    // L'anneau est tracé dans le plan XY, normale vers la caméra : c'est un
    // lacet important qui le met de chant et le fait lire comme un tube. On le
    // pose donc presque de face et on borne sa part de défilement à l'usage.
    const assiette = {
      treillis: 0.3,
      onde: 0.52,
      anneau: 0.2,
      poussiere: 0.24,
      helice: 0.34,
      constellation: 0.26,
    }[variante];
    gl.uniform1i(u.mode, modeNum);
    gl.uniform1f(u.cam, 5.6 * zoom);
    gl.enable(gl.BLEND);
    // Prémultiplié : le fragment sort déjà `couleur * alpha`, ce qui évite les
    // liserés sombres autour des points sur fond crème.
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // Les couleurs sont lues sur le canvas lui-même, qui porte la classe du
    // token. Changer de thème les change, donc la scène suit sans
    // recompilation.
    //
    // La première vient de `color`. Les deux autres, facultatives, de deux
    // propriétés personnalisées : une page qui veut une scène multicolore pose
    // `--scene-2` et `--scene-3`, une page qui n'en veut pas ne pose rien et
    // hérite de la couleur unique. Passer par des propriétés plutôt que par des
    // props évite de faire traverser trois couleurs à la frontière client d'un
    // composant chargé en différé, et laisse le thème sombre les basculer tout
    // seul.
    const lire = (brut: string): [number, number, number] | null => {
      // Trois écritures à couvrir, et la troisième a coûté une itération.
      //
      // `color` est une vraie propriété CSS : le navigateur la sérialise
      // toujours en `rgb(...)` ou en `color(srgb ...)`. Une **propriété
      // personnalisée**, non : sa valeur calculée reste le flux de jetons
      // écrit à la source, donc `#016e5e` sort tel quel. L'expression
      // numérique y trouvait « 016 » et « 5 » — deux nombres au lieu de trois
      // — et la lecture échouait en silence, si bien que la scène retombait
      // sur sa couleur unique sans que rien ne le signale.
      const hex = brut.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i);
      if (hex) {
        const h = hex[1];
        const p3 = h.length === 3;
        const canal = (i: number) =>
          parseInt(p3 ? h[i] + h[i] : h.slice(i * 2, i * 2 + 2), 16) / 255;
        return [canal(0), canal(1), canal(2)];
      }
      const m = brut.match(/-?\d+(\.\d+)?/g);
      if (!m || m.length < 3) return null;
      // Deux écritures cohabitent : `rgb(181, 171, 153)` et, dès qu'un modificateur
      // d'opacité passe par color-mix, `color(srgb 0.71 0.67 0.6 / 0.7)`. Diviser
      // les secondes par 255 rendait la scène noire — c'est exactement ce qui est
      // arrivé sur la section encre, où l'onde s'est mise à assombrir le fond au
      // lieu de l'éclaircir.
      const d = brut.startsWith("color(") ? 1 : 255;
      return [Number(m[0]) / d, Number(m[1]) / d, Number(m[2]) / d];
    };

    let couleur: [number, number, number] = [0.5, 0.5, 0.5];
    let couleur2: [number, number, number] = couleur;
    let couleur3: [number, number, number] = couleur;
    const lireCouleur = () => {
      const style = getComputedStyle(canvas);
      const principale = lire(style.color);
      if (!principale) return;
      couleur = principale;
      // Repli sur la principale : une page qui ne déclare rien garde
      // exactement l'apparence qu'elle avait.
      couleur2 = lire(style.getPropertyValue("--scene-2").trim()) ?? principale;
      couleur3 = lire(style.getPropertyValue("--scene-3").trim()) ?? principale;
    };
    lireCouleur();

    let l = 0;
    let h = 0;
    // Sur un téléphone il n'y a pas de colonne libre : l'objet passerait
    // derrière le texte courant. On le descend sous le bloc de texte et on
    // l'atténue fortement. Les valeurs ne sont pas choisies à l'œil : à la
    // moitié de l'opacité, `tests/scene-contrast.mjs` mesurait encore 4,11:1
    // sur le chapô des Services en thème sombre, sous le plancher de 4,5.
    let facteurAlpha = 1;
    const dimensionner = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      const etroit = r.width < 640;
      facteurAlpha = etroit ? 0.24 : 1;
      gl.uniform2f(u.offset, etroit ? decalage * 0.2 : decalage, etroit ? -0.72 : 0);
      l = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = l;
      canvas.height = h;
      gl.viewport(0, 0, l, h);
      // Le champ reste carré quel que soit le format : sans cela le nuage
      // s'étire en paysage et se comprime en portrait.
      const ratio = l / h;
      gl.uniform2f(u.aspect, ratio >= 1 ? 1 / ratio : 1, ratio >= 1 ? 1 : ratio);
      gl.uniform1f(u.size, 6.5 * dpr);
    };
    dimensionner();

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nb = pos.length / 3;

    const dessiner = (t: number, defilement: number) => {
      lireCouleur();
      gl.uniform3f(u.color, couleur[0], couleur[1], couleur[2]);
      gl.uniform3f(u.color2, couleur2[0], couleur2[1], couleur2[2]);
      gl.uniform3f(u.color3, couleur3[0], couleur3[1], couleur3[2]);
      gl.uniform1f(u.time, t);
      const yaw = t * 0.12 * vitesse + defilement * 1.4 * scroll;
      const pitch = assiette + Math.sin(t * 0.09 * vitesse) * 0.14 + defilement * 0.45 * scroll;
      gl.uniformMatrix4fv(u.rot, false, matrice(yaw, pitch));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Les arêtes d'abord, plus discrètes : elles donnent la structure, les
      // points marquent les sommets par-dessus.
      if (bufLignes && bufSeedL) {
        gl.uniform1f(u.point, 0);
        gl.uniform1f(u.alpha, alpha * facteurAlpha * 0.62);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufLignes);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, bufSeedL);
        gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, lignes.length / 3);
      }

      gl.uniform1f(u.point, 1);
      gl.uniform1f(u.alpha, alpha * facteurAlpha);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, bufSeed);
      gl.vertexAttribPointer(aSeed, 1, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.POINTS, 0, nb);
    };

    let raf = 0;
    let visible = true;
    let perdu = false;
    const depart = performance.now();

    const progression = () => {
      const r = canvas.getBoundingClientRect();
      const course = r.height + window.innerHeight;
      return course <= 0 ? 0 : (window.innerHeight - r.top) / course;
    };

    const boucle = () => {
      raf = requestAnimationFrame(boucle);
      if (!visible || document.hidden || perdu) return;
      dessiner((performance.now() - depart) / 1000, progression());
    };

    const onPerte = (e: Event) => {
      e.preventDefault();
      perdu = true;
      cancelAnimationFrame(raf);
    };
    canvas.addEventListener("webglcontextlost", onPerte);

    const io = new IntersectionObserver((entrees) => {
      visible = entrees[0]?.isIntersecting ?? false;
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      dimensionner();
      if (reduit.matches) dessiner(0, progression());
    });
    ro.observe(canvas);

    if (reduit.matches) {
      // Une image fixe : la profondeur sans le mouvement.
      dessiner(0, 0);
    } else {
      boucle();
    }

    const surChangement = () => {
      if (reduit.matches) {
        cancelAnimationFrame(raf);
        dessiner(0, progression());
      } else {
        cancelAnimationFrame(raf);
        boucle();
      }
    };
    reduit.addEventListener("change", surChangement);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      reduit.removeEventListener("change", surChangement);
      canvas.removeEventListener("webglcontextlost", onPerte);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(bufPos);
      gl.deleteBuffer(bufSeed);
      if (bufLignes) gl.deleteBuffer(bufLignes);
      if (bufSeedL) gl.deleteBuffer(bufSeedL);
    };
  }, [variante, alpha, vitesse, scroll, decalage, zoom]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "text-ink-muted pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
    />
  );
}

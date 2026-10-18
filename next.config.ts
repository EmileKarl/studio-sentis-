import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 n'accepte que les qualités déclarées ici ; toute autre valeur
     * répond une erreur. 75 reste la valeur par défaut du reste du site ;
     * 65 est réservé aux photos d'ambiance des panneaux, qui sont vues sous
     * un voile sombre avec du texte par-dessus — voir `panneaux-accueil.tsx`
     * pour la mesure qui a décidé du chiffre.
     */
    qualities: [65, 75],
  },
};

export default nextConfig;

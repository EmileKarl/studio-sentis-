import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Gouttière unique du projet (§5.6). Toute page passe par ici : c'est ce qui
 * garantit que rien ne touche le bord de l'écran, à n'importe quelle largeur.
 */
export function Container({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-(--container-page) px-4 sm:px-6 lg:px-10",
        className,
      )}
      {...props}
    />
  );
}

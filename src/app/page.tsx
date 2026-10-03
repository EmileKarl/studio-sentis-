import { redirect } from "next/navigation";

import { DEFAULT_LOCALE } from "@/lib/i18n";

/**
 * La racine du domaine appartient à l'agence, pas à la vitrine technique.
 * Le français est la langue par défaut : au Québec ce n'est pas un réglage
 * de préférence mais le cadre légal des communications commerciales.
 */
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`);
}

export const PROJECT_TYPE_VALUES: Record<string, string> = {
    "Court métrage": "COURT_METRAGE",
    "Long métrage": "LONG_METRAGE",
    "Série": "SERIE",
    "Clip": "CLIP",
    "Documentaire": "DOCUMENTAIRE",
    "YouTube": "YOUTUBE",
    "Autre": "AUTRE",
};
export const PROJECT_TYPES = Object.keys(PROJECT_TYPE_VALUES);
export const DATE_OPTIONS = ["Aujourd'hui", "Cette semaine", "Ce mois", "Cette année"];
export const WORKMODE_OPTIONS = ["Présentiel", "Distanciel", "Hybride"];
export const REMUNERATION_OPTIONS = ["Rémunéré", "Non rémunéré"];
export const LEVEL_OPTIONS = ["Débutant", "Intermédiaire", "Avancé"];

export const WORKMODE_VALUES: Record<string, string> = {
    Présentiel: "PRESENTIEL", Distanciel: "DISTANCIEL", Hybride: "HYBRIDE",
};
export const REMUNERATION_VALUES: Record<string, string> = {
    Rémunéré: "REMUNERE", "Non rémunéré": "NON_REMUNERE",
};
export const LEVEL_VALUES: Record<string, string> = {
    Débutant: "DEBUTANT", Intermédiaire: "INTERMEDIAIRE", Avancé: "AVANCE",
};

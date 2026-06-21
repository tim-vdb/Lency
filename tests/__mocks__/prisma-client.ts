export const ContactType = {
    SUPPORT_TECHNIQUE: "SUPPORT_TECHNIQUE",
    CONTACT_GENERAL: "CONTACT_GENERAL",
    FACTURATION: "FACTURATION",
    PARTENARIAT: "PARTENARIAT",
    AUTRE: "AUTRE",
} as const;

export const ProjectLevel = {
    DEBUTANT: "DEBUTANT",
    INTERMEDIAIRE: "INTERMEDIAIRE",
    AVANCE: "AVANCE",
} as const;

export const ProjectType = {
    COURT_METRAGE: "COURT_METRAGE",
    LONG_METRAGE: "LONG_METRAGE",
    SERIE: "SERIE",
    CLIP: "CLIP",
    DOCUMENTAIRE: "DOCUMENTAIRE",
    YOUTUBE: "YOUTUBE",
    AUTRE: "AUTRE",
} as const;

export const RemunerationType = {
    NON_REMUNERE: "NON_REMUNERE",
    REMUNERE: "REMUNERE",
} as const;

export const Visibility = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
    MEMBERS_ONLY: "MEMBERS_ONLY",
} as const;

export const WorkMode = {
    PRESENTIEL: "PRESENTIEL",
    DISTANCIEL: "DISTANCIEL",
    HYBRIDE: "HYBRIDE",
} as const;

export const ProjectStatus = {
    DRAFT: "DRAFT",
    PUBLISHED: "PUBLISHED",
    ARCHIVED: "ARCHIVED",
} as const;

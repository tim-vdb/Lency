import { parseAsString } from "nuqs";

export const tabParser = {
    tab: parseAsString.withDefault("projets"),
} as const;

export const projectFilterParsers = {
    pType: parseAsString.withDefault(""),
    pWorkMode: parseAsString.withDefault(""),
    pLevel: parseAsString.withDefault(""),
    pRemu: parseAsString.withDefault(""),
    pCity: parseAsString.withDefault(""),
    pDate: parseAsString.withDefault(""),
} as const;

export const talentFilterParsers = {
    tRole: parseAsString.withDefault(""),
    tWorkMode: parseAsString.withDefault(""),
    tLevel: parseAsString.withDefault(""),
    tRemu: parseAsString.withDefault(""),
} as const;

export const allMarketplaceParsers = {
    ...tabParser,
    ...projectFilterParsers,
    ...talentFilterParsers,
} as const;

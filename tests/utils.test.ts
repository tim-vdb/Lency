import { describe, it, expect } from "vitest";
import {
    cn,
    formatDate,
    timeAgo,
    formatCount,
    getDisplayName,
    getInitialName,
    zodEnum,
} from "@/front/lib/utils";
import { z } from "zod";

describe("cn", () => {
    it("merges classes with clsx + twMerge", () => {
        expect(cn("px-4", "py-2")).toBe("px-4 py-2");
    });

    it("handles conditional classes", () => {
        expect(cn("base", false && "hidden", "extra")).toBe("base extra");
    });

    it("resolves tailwind conflicts", () => {
        expect(cn("px-4", "px-2")).toBe("px-2");
    });

    it("returns empty string for no args", () => {
        expect(cn()).toBe("");
    });
});

describe("formatDate", () => {
    it("formats a date in fr-FR locale", () => {
        const date = new Date(2026, 0, 15, 9, 30);
        const result = formatDate(date);
        expect(result).toContain("15/01/2026");
        expect(result).toContain("09:30");
    });
});

describe("timeAgo", () => {
    it('returns seconds for < 1 min', () => {
        const now = new Date();
        const fewSecondsAgo = new Date(now.getTime() - 30 * 1000);
        expect(timeAgo(fewSecondsAgo)).toMatch(/^\d+ s$/);
    });

    it('returns minutes for < 1 hour', () => {
        const now = new Date();
        const fewMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        expect(timeAgo(fewMinutesAgo)).toBe("5 min");
    });

    it('returns hours for < 1 day', () => {
        const now = new Date();
        const fewHoursAgo = new Date(now.getTime() - 3 * 3600 * 1000);
        expect(timeAgo(fewHoursAgo)).toBe("3 h");
    });

    it('returns days for < 1 month', () => {
        const now = new Date();
        const fewDaysAgo = new Date(now.getTime() - 10 * 86400 * 1000);
        expect(timeAgo(fewDaysAgo)).toBe("10 j");
    });

    it('returns months for < 1 year', () => {
        const now = new Date();
        const fewMonthsAgo = new Date(now.getTime() - 60 * 86400 * 1000);
        expect(timeAgo(fewMonthsAgo)).toBe("2 mois");
    });

    it('returns years for >= 1 year', () => {
        const now = new Date();
        const oneYearAgo = new Date(now.getTime() - 400 * 86400 * 1000);
        expect(timeAgo(oneYearAgo)).toMatch(/^\d+ an$/);
    });

    it("works with string dates", () => {
        const now = new Date();
        const dateStr = new Date(now.getTime() - 2 * 3600 * 1000).toISOString();
        expect(timeAgo(dateStr)).toBe("2 h");
    });
});

describe("formatCount", () => {
    it("returns the number as string for < 1000", () => {
        expect(formatCount(0)).toBe("0");
        expect(formatCount(42)).toBe("42");
        expect(formatCount(999)).toBe("999");
    });

    it("formats thousands with k suffix", () => {
        expect(formatCount(1000)).toBe("1k");
        expect(formatCount(1500)).toBe("1.5k");
        expect(formatCount(10000)).toBe("10k");
    });

    it("removes .0 for round thousands", () => {
        expect(formatCount(2000)).toBe("2k");
        expect(formatCount(50000)).toBe("50k");
    });
});

describe("getDisplayName", () => {
    it("returns firstname + lastname when both exist", () => {
        expect(getDisplayName({ firstname: "Jean", lastname: "Dupont" })).toBe("Jean Dupont");
    });

    it("returns name when no firstname/lastname", () => {
        expect(getDisplayName({ name: "JeanDupont" })).toBe("JeanDupont");
    });

    it("returns username when only username is present", () => {
        expect(getDisplayName({ username: "jdupont" })).toBe("jdupont");
    });

    it('returns "Anonyme" when nothing is set', () => {
        expect(getDisplayName({})).toBe("Anonyme");
    });

    it("prefers firstname+lastname over name", () => {
        expect(getDisplayName({ firstname: "Jean", lastname: "Dupont", name: "JD" })).toBe("Jean Dupont");
    });

    it("prefers name over username", () => {
        expect(getDisplayName({ name: "JD", username: "jdupont" })).toBe("JD");
    });
});

describe("getInitialName", () => {
    it("returns initials from firstname + lastname", () => {
        expect(getInitialName({ firstname: "Jean", lastname: "Dupont" })).toBe("JD");
    });

    it("returns initials from name split by space", () => {
        expect(getInitialName({ name: "Jean Dupont" })).toBe("JD");
    });

    it("returns first letter of username", () => {
        expect(getInitialName({ username: "jdupont" })).toBe("J");
    });

    it('returns "?" when nothing is set', () => {
        expect(getInitialName({})).toBe("?");
    });

    it("takes max 2 words from name", () => {
        expect(getInitialName({ name: "Jean Luc Dupont" })).toBe("JL");
    });
});

describe("zodEnum", () => {
    const TestEnum = {
        FOO: "FOO",
        BAR: "BAR",
    } as const;

    it("creates a zod enum from an object", () => {
        const schema = zodEnum(TestEnum);
        expect(schema.safeParse("FOO").success).toBe(true);
        expect(schema.safeParse("BAR").success).toBe(true);
        expect(schema.safeParse("BAZ").success).toBe(false);
    });
});

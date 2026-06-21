import { describe, it, expect } from "vitest";
import { TalentProfileSchema, TalentProfileModalSchema } from "@/front/schemas/zod/talent.zod";

describe("TalentProfileSchema", () => {
    it("accepts a complete valid profile", () => {
        const result = TalentProfileSchema.safeParse({
            bio: "Développeur créatif",
            portfolio: "https://portfolio.com",
            cv: "https://cv.com/file.pdf",
            isMarketplaceTalent: true,
        });
        expect(result.success).toBe(true);
    });

    it("rejects bio longer than 500 characters", () => {
        const result = TalentProfileSchema.safeParse({
            bio: "a".repeat(501),
            isMarketplaceTalent: false,
        });
        expect(result.success).toBe(false);
    });

    it("accepts bio exactly 500 characters", () => {
        const result = TalentProfileSchema.safeParse({
            bio: "a".repeat(500),
            isMarketplaceTalent: true,
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid portfolio URL", () => {
        const result = TalentProfileSchema.safeParse({
            portfolio: "not-a-url",
            isMarketplaceTalent: true,
        });
        expect(result.success).toBe(false);
    });

    it("accepts empty string for portfolio and cv", () => {
        const result = TalentProfileSchema.safeParse({
            portfolio: "",
            cv: "",
            isMarketplaceTalent: false,
        });
        expect(result.success).toBe(true);
    });

    it("rejects missing isMarketplaceTalent", () => {
        const result = TalentProfileSchema.safeParse({
            bio: "Test",
        });
        expect(result.success).toBe(false);
    });
});

describe("TalentProfileModalSchema", () => {
    it("accepts complete modal data", () => {
        const result = TalentProfileModalSchema.safeParse({
            bio: "Un talent créatif",
            portfolio: "https://portfolio.com",
            cv: "https://cv.com/doc.pdf",
            isMarketplaceTalent: true,
            workMode: "DISTANCIEL",
            level: "AVANCE",
            remunerationType: "REMUNERE",
            address: "123 rue de Paris",
            latitude: 48.8566,
            longitude: 2.3522,
        });
        expect(result.success).toBe(true);
    });

    it("accepts minimal valid data", () => {
        const result = TalentProfileModalSchema.safeParse({
            isMarketplaceTalent: false,
        });
        expect(result.success).toBe(true);
    });

    it("rejects address longer than 255 characters", () => {
        const result = TalentProfileModalSchema.safeParse({
            isMarketplaceTalent: true,
            address: "a".repeat(256),
        });
        expect(result.success).toBe(false);
    });
});

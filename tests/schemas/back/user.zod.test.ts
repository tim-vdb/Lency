import { describe, it, expect } from "vitest";
import { updateUserSchema } from "@/back/schemas/zod/user.zod";

describe("updateUserSchema", () => {
    it("accepts a single field update", () => {
        const result = updateUserSchema.safeParse({ firstname: "Jean" });
        expect(result.success).toBe(true);
    });

    it("accepts multiple fields", () => {
        const result = updateUserSchema.safeParse({
            firstname: "Jean",
            lastname: "Dupont",
            bio: "Développeur",
        });
        expect(result.success).toBe(true);
    });

    it("accepts boolean fields", () => {
        const result = updateUserSchema.safeParse({
            isMarketplaceTalent: true,
            readyToStart: false,
        });
        expect(result.success).toBe(true);
    });

    it("accepts numeric fields", () => {
        const result = updateUserSchema.safeParse({
            latitude: 48.8566,
            longitude: 2.3522,
        });
        expect(result.success).toBe(true);
    });

    it("rejects empty object", () => {
        const result = updateUserSchema.safeParse({});
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("Aucune donnée");
        }
    });

    it("rejects address longer than 255 characters", () => {
        const result = updateUserSchema.safeParse({
            address: "a".repeat(256),
        });
        expect(result.success).toBe(false);
    });

    it("accepts address exactly 255 characters", () => {
        const result = updateUserSchema.safeParse({
            address: "a".repeat(255),
        });
        expect(result.success).toBe(true);
    });

    it("accepts URL fields", () => {
        const result = updateUserSchema.safeParse({
            image: "https://cdn.com/avatar.png",
            avatarUrl: "https://cdn.com/avatar2.png",
            cv: "https://cdn.com/cv.pdf",
            portfolio: "https://portfolio.com",
        });
        expect(result.success).toBe(true);
    });

    it("accepts all fields at once", () => {
        const result = updateUserSchema.safeParse({
            name: "Jean Dupont",
            firstname: "Jean",
            lastname: "Dupont",
            username: "jdupont",
            phone: "0612345678",
            bio: "Dev créatif",
            image: "https://img.com/photo.jpg",
            avatarUrl: "https://img.com/avatar.jpg",
            cv: "https://docs.com/cv.pdf",
            portfolio: "https://port.com",
            isMarketplaceTalent: true,
            readyToStart: true,
            address: "123 rue de Paris",
            latitude: 48.85,
            longitude: 2.35,
        });
        expect(result.success).toBe(true);
    });
});

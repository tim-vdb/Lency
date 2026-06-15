import { describe, it, expect } from "vitest";
import { CreateFeedbackSchema } from "@/front/schemas/zod/feedback.zod";

describe("CreateFeedbackSchema", () => {
    it("accepts description with at least 10 characters", () => {
        const result = CreateFeedbackSchema.safeParse({
            description: "Ceci est un feedback valide.",
        });
        expect(result.success).toBe(true);
    });

    it("accepts description with optional imageUrl", () => {
        const result = CreateFeedbackSchema.safeParse({
            description: "Un feedback avec capture d'ecran.",
            imageUrl: "https://img.com/screenshot.png",
        });
        expect(result.success).toBe(true);
    });

    it("accepts null imageUrl", () => {
        const result = CreateFeedbackSchema.safeParse({
            description: "Feedback sans image.",
            imageUrl: null,
        });
        expect(result.success).toBe(true);
    });

    it("rejects description shorter than 10 characters", () => {
        const result = CreateFeedbackSchema.safeParse({
            description: "Court",
        });
        expect(result.success).toBe(false);
    });

    it("rejects description exactly 9 characters", () => {
        const result = CreateFeedbackSchema.safeParse({
            description: "123456789",
        });
        expect(result.success).toBe(false);
    });

    it("accepts description exactly 10 characters", () => {
        const result = CreateFeedbackSchema.safeParse({
            description: "1234567890",
        });
        expect(result.success).toBe(true);
    });
});

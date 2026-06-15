import { describe, it, expect } from "vitest";
import { EditBioSchema, SocialLinkSchema } from "@/front/schemas/zod/user.zod";

describe("EditBioSchema", () => {
    it("accepts a valid bio within 300 chars", () => {
        const result = EditBioSchema.safeParse({ bio: "Une bio valide" });
        expect(result.success).toBe(true);
    });

    it("accepts empty object (bio is optional)", () => {
        const result = EditBioSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it("accepts undefined bio", () => {
        const result = EditBioSchema.safeParse({ bio: undefined });
        expect(result.success).toBe(true);
    });

    it("rejects bio longer than 300 characters", () => {
        const result = EditBioSchema.safeParse({ bio: "a".repeat(301) });
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.issues[0].message).toContain("300");
        }
    });

    it("accepts bio exactly 300 characters", () => {
        const result = EditBioSchema.safeParse({ bio: "a".repeat(300) });
        expect(result.success).toBe(true);
    });
});

describe("SocialLinkSchema", () => {
    it("accepts valid platform and URL", () => {
        const result = SocialLinkSchema.safeParse({
            platform: "github",
            url: "https://github.com/user",
        });
        expect(result.success).toBe(true);
    });

    it("rejects empty platform", () => {
        const result = SocialLinkSchema.safeParse({
            platform: "",
            url: "https://github.com/user",
        });
        expect(result.success).toBe(false);
    });

    it("rejects URL without http(s)", () => {
        const result = SocialLinkSchema.safeParse({
            platform: "github",
            url: "github.com/user",
        });
        expect(result.success).toBe(false);
    });

    it("accepts http URL", () => {
        const result = SocialLinkSchema.safeParse({
            platform: "site",
            url: "http://example.com",
        });
        expect(result.success).toBe(true);
    });

    it("rejects missing URL", () => {
        const result = SocialLinkSchema.safeParse({
            platform: "github",
        });
        expect(result.success).toBe(false);
    });
});

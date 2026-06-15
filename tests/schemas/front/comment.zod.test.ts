import { describe, it, expect } from "vitest";
import { CreateCommentSchema } from "@/front/schemas/zod/comment.zod";

describe("CreateCommentSchema", () => {
    it("accepts valid content", () => {
        const result = CreateCommentSchema.safeParse({
            content: "Super projet !",
            imageUrls: [],
            videoUrls: [],
            audioUrls: [],
        });
        expect(result.success).toBe(true);
    });

    it("accepts image URLs without text", () => {
        const result = CreateCommentSchema.safeParse({
            content: "",
            imageUrls: ["https://image.com/pic.jpg"],
            videoUrls: [],
            audioUrls: [],
        });
        expect(result.success).toBe(true);
    });

    it("accepts video URLs without text", () => {
        const result = CreateCommentSchema.safeParse({
            content: "",
            imageUrls: [],
            videoUrls: ["https://video.com/vid.mp4"],
            audioUrls: [],
        });
        expect(result.success).toBe(true);
    });

    it("rejects empty content with no media", () => {
        const result = CreateCommentSchema.safeParse({
            content: "",
            imageUrls: [],
            videoUrls: [],
            audioUrls: [],
        });
        expect(result.success).toBe(false);
    });

    it("rejects whitespace-only content with no media", () => {
        const result = CreateCommentSchema.safeParse({
            content: "   ",
            imageUrls: [],
            videoUrls: [],
            audioUrls: [],
        });
        expect(result.success).toBe(false);
    });

    it("returns error message on content path for empty content", () => {
        const result = CreateCommentSchema.safeParse({
            content: "",
            imageUrls: [],
            videoUrls: [],
            audioUrls: [],
        });
        expect(result.success).toBe(false);
        if (!result.success) {
            const contentError = result.error.issues.find((e) => e.path.includes("content"));
            expect(contentError).toBeDefined();
        }
    });
});

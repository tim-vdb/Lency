import { describe, it, expect } from "vitest";
import { projectApplicationSchema, ApplyToProjectSchema } from "@/front/schemas/zod/application.zod";

describe("projectApplicationSchema", () => {
    const validApplication = {
        id: "app-123",
        projectId: "proj-456",
        userId: "user-789",
        status: "PENDING" as const,
        appliedAt: new Date(),
        respondedAt: null,
        user: {
            id: "user-789",
            firstname: "Jean",
            lastname: "Dupont",
            username: "jdupont",
            image: null,
            email: "jean@example.com",
        },
        project: {
            id: "proj-456",
            title: "Mon Super Projet",
        },
    };

    it("accepts a valid application object", () => {
        const result = projectApplicationSchema.safeParse(validApplication);
        expect(result.success).toBe(true);
    });

    it("accepts an application with ACCEPTED status", () => {
        const result = projectApplicationSchema.safeParse({
            ...validApplication,
            status: "ACCEPTED",
            respondedAt: new Date(),
        });
        expect(result.success).toBe(true);
    });

    it("accepts an application with REJECTED status", () => {
        const result = projectApplicationSchema.safeParse({
            ...validApplication,
            status: "REJECTED",
            respondedAt: new Date(),
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid status", () => {
        const result = projectApplicationSchema.safeParse({
            ...validApplication,
            status: "INVALID",
        });
        expect(result.success).toBe(false);
    });

    it("coerces date strings to dates", () => {
        const result = projectApplicationSchema.safeParse({
            ...validApplication,
            appliedAt: "2026-01-15T10:00:00Z",
            respondedAt: "2026-01-16T12:00:00Z",
        });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.appliedAt).toBeInstanceOf(Date);
            expect(result.data.respondedAt).toBeInstanceOf(Date);
        }
    });
});

describe("ApplyToProjectSchema", () => {
    it("accepts empty form (all fields optional)", () => {
        const result = ApplyToProjectSchema.safeParse({});
        expect(result.success).toBe(true);
    });

    it("accepts a note within 1000 characters", () => {
        const result = ApplyToProjectSchema.safeParse({
            applicantNote: "Je suis très intéressé par ce projet !",
        });
        expect(result.success).toBe(true);
    });

    it("rejects note longer than 1000 characters", () => {
        const result = ApplyToProjectSchema.safeParse({
            applicantNote: "a".repeat(1001),
        });
        expect(result.success).toBe(false);
    });

    it("accepts valid portfolio URL", () => {
        const result = ApplyToProjectSchema.safeParse({
            portfolioUrl: "https://myportfolio.com",
        });
        expect(result.success).toBe(true);
    });

    it("rejects invalid portfolio URL", () => {
        const result = ApplyToProjectSchema.safeParse({
            portfolioUrl: "not-a-url",
        });
        expect(result.success).toBe(false);
    });

    it("accepts empty string for portfolio and cv url", () => {
        const result = ApplyToProjectSchema.safeParse({
            portfolioUrl: "",
            cvUrl: "",
        });
        expect(result.success).toBe(true);
    });

    it("accepts valid cv URL", () => {
        const result = ApplyToProjectSchema.safeParse({
            cvUrl: "https://cv.com/file.pdf",
        });
        expect(result.success).toBe(true);
    });
});

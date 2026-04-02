import { CategoriesService } from "@/back/services/categories.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const data = await CategoriesService.findByIdCategory(categoryId);
        return NextResponse.json({ category: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Category not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        const data = await req.json();
        const updatedCategory = await CategoriesService.updateCategory(categoryId, data);
        return NextResponse.json({ category: updatedCategory });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "Category not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ categoryId: string }> }
) {
    try {
        const { categoryId } = await params;
        await CategoriesService.deleteCategory(categoryId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "Category not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
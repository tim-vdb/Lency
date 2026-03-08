import { CategoriesAction } from "@/back/repositories/categories.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;

    const data = await CategoriesAction.findById(categoryId);

    return NextResponse.json({ category: data });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;
    const data = await req.json();

    const updatedCategory = await CategoriesAction.update(categoryId, data);
    return NextResponse.json({ category: updatedCategory });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ categoryId: string }> }) {
    const { categoryId } = await params;

    await CategoriesAction.delete(categoryId);

    return NextResponse.json({ message: `Category ${categoryId} deleted` });
}
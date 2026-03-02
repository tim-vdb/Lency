import { CategoriesAction } from "@/back/repositories/categories.action";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { categoryId: string }) {
    const categoryId = params.categoryId;

    const data = CategoriesAction.findById(categoryId);

    return NextResponse.json({ category: data });
}

export async function PATCH(req: NextRequest, params: { categoryId: string }) {
    const categoryId = params.categoryId;
    const data = await req.json();

    const updatedCategory = CategoriesAction.update(categoryId, data);
    return NextResponse.json({ category: updatedCategory });
}

export async function DELETE(req: NextRequest, params: { categoryId: string }) {
    const categoryId = params.categoryId;

    CategoriesAction.delete(categoryId)

    return NextResponse.json({ message: `Category ${categoryId} deleted` });
}
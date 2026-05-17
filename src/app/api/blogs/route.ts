import { BlogsService } from "@/back/services/blogs.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await BlogsService.findAllBlogs();
        return NextResponse.json({ blogs: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newBlog = await BlogsService.createBlog(data);
        return NextResponse.json({ blog: newBlog }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if ([
                "Title is required",
                "Content is required",
                "Tag is required",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { ProjectApplicationService } from "@/back/services/project-applications.service";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: applicationId } = await params;
    const body = await req.json().catch(() => ({}));
    const { ownerNote } = body;

    const application = await ProjectApplicationService.accept(applicationId, ownerNote);

    return NextResponse.json(
      { application, message: "Application accepted" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return NextResponse.json(
          { error: "You must be logged in" },
          { status: 401 }
        );
      }
      if (error.message === "Application not found") {
        return NextResponse.json(
          { error: "Application not found" },
          { status: 404 }
        );
      }
      if (error.message === "You are not the project owner") {
        return NextResponse.json(
          { error: "You are not authorized to accept this application" },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

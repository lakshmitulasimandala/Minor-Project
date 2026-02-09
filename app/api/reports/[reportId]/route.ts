import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const reportId = resolvedParams?.reportId;
    
    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const { status } = await request.json();
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}

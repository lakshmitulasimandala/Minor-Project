import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ reportId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportId } = await context.params; // ✅ params is now async in Next.js 16
    const { status } = await request.json();

    if (!reportId || !status) {
      return NextResponse.json(
        { error: "Report ID and status are required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("❌ Error updating report:", error);
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { reportid: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reportid } = params; // ✅ this is Prisma `id`
    const { status } = await request.json();

    if (!reportid || !status) {
      return NextResponse.json(
        { error: "Report ID and status are required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.update({
      where: { id: reportid }, // ✅ CORRECT
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

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reportId: string }> }
) {
  try {
    // Handle params as a Promise in Next.js 16
    const resolvedParams = await params;
    const reportId = resolvedParams?.reportId;
    
    console.log("🔍 Fetching report with ID:", reportId);
    
    if (!reportId) {
      console.error("❌ Report ID not provided in params");
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 }
      );
    }
    
    const report = await prisma.report.findUnique({
      where: {
        reportId: reportId,
      },
    });

    if (!report) {
      console.error("❌ Report not found:", reportId);
      return NextResponse.json(
        { error: `Report not found with ID: ${reportId}` },
        { status: 404 }
      );
    }

    console.log("✅ Report found:", report.reportId);

    // Ensure all fields are properly returned
    return NextResponse.json({
      id: report.id,
      reportId: report.reportId,
      status: report.status,
      createdAt: report.createdAt,
      title: report.title,
      description: report.description,
      location: report.location,
      image: report.image,
      type: report.type,
      reportType: report.reportType,
      latitude: report.latitude,
      longitude: report.longitude,
      updatedAt: report.updatedAt,
    });
  } catch (error: any) {
    console.error("❌ Error fetching report details:", error);
    const errorMessage = error?.message || error?.toString() || "Unknown error";
    console.error("❌ Full error details:", JSON.stringify({
      message: errorMessage,
      code: error?.code,
      details: error?.meta?.message || error?.meta?.cause,
    }, null, 2));
    
    return NextResponse.json(
      { error: `Failed to fetch report details: ${errorMessage}` },
      { status: 500 }
    );
  }
}

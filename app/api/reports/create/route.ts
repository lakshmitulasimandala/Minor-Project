import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("❌ Error parsing JSON:", parseError);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON in request body",
        },
        { status: 400 }
      );
    }

    const {
      reportId,
      type,
      specificType,
      title,
      description,
      location,
      latitude,
      longitude,
      image,
      status,
    } = requestBody;

    // Validate required fields
    if (!reportId || !type || !specificType || !title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: reportId, type, specificType, title, description",
        },
        { status: 400 }
      );
    }

    // Validate enum values
    const validTypes = ["EMERGENCY", "NON_EMERGENCY"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid type: ${type}. Must be EMERGENCY or NON_EMERGENCY`,
        },
        { status: 400 }
      );
    }

    console.log("📝 Creating report with data:", {
      reportId,
      type,
      specificType,
      title,
    });

    // Create report - type is passed as string, Prisma will handle enum conversion
    const report = await prisma.report.create({
      data: {
        reportId,
        type: type as any, // Let Prisma handle enum conversion
        title,
        description,
        reportType: specificType,
        location: location || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        image: image || null,
        status: status || "PENDING",
      },
    });

    console.log("✅ Report created successfully:", report.reportId);

    return NextResponse.json({
      success: true,
      reportId: report.reportId,
      title: report.title,
      description: report.description,
      location: report.location,
      image: report.image,
      createdAt: report.createdAt,
      type: report.type,
      specificType: report.reportType,
      status: report.status,
    });
  } catch (error: any) {
    console.error("❌ Error creating report:", error);
    
    // Provide detailed error message
    const errorMessage = error?.message || error?.toString() || "Failed to submit report";
    const errorDetails = error?.meta?.message || error?.meta?.cause || null;
    
    console.error("❌ Full error object:", JSON.stringify({
      message: errorMessage,
      details: errorDetails,
      code: error?.code,
    }, null, 2));
    
    return NextResponse.json(
      {
        success: false,
        error: `Failed to submit report: ${errorMessage}`,
        details: process.env.NODE_ENV === "development" ? errorDetails : undefined,
      },
      { status: 500 }
    );
  }
}

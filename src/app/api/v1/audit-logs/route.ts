import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/services/auditService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const module = searchParams.get("module") || undefined;

    const result = await getAuditLogs({ page, limit, module });
    return NextResponse.json({ success: true, data: result.logs, meta: { total: result.total, page: result.page, totalPages: result.totalPages } });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json({ success: false, message: error.message || "Failed to fetch audit logs" }, { status: 500 });
  }
}

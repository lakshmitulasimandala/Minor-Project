"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

// Defining enums locally for client-side use
const ReportStatusOptions = ["PENDING", "IN_PROGRESS", "RESOLVED", "DISMISSED"] as const;
const ReportTypeOptions = ["EMERGENCY", "NON_EMERGENCY"] as const;

type ReportStatus = typeof ReportStatusOptions[number];
type ReportType = typeof ReportTypeOptions[number];

interface Report {
  id: string;
  reportId: string;
  type: ReportType;
  title: string;
  description: string;
  reportType: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  status: ReportStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<ReportType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  // ✅ SAFE FETCH (CRITICAL FIX)
  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();

      // 🔥 Defensive check
      if (!res.ok || !Array.isArray(data)) {
        console.error("Reports API failed:", data);
        setReports([]);
        return;
      }

      setReports(data);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateReportStatus = async (id: string, status: ReportStatus) => {
    try {
      await fetch(`/api/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchReports();
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // ✅ EXTRA SAFETY
  const safeReports = Array.isArray(reports) ? reports : [];

  const filteredReports = safeReports.filter((r) => {
    const s = filter === "ALL" || r.status === filter;
    const t = typeFilter === "ALL" || r.type === typeFilter;
    return s && t;
  });

  const statusStyles: Record<ReportStatus, string> = {
    PENDING: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    IN_PROGRESS: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
    RESOLVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    DISMISSED: "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20",
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
            Reportify Admin
          </h1>
          <div className="flex items-center gap-6">
            <span className="text-zinc-400">
              {session?.user?.name || "Admin"}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 rounded-lg bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* FILTERS */}
        <div className="mb-8 flex flex-wrap justify-between gap-4 items-center">
          <div className="flex gap-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-black border border-border rounded-lg px-4 py-2 text-zinc-300 focus:ring-2 focus:ring-orange-500/30"
            >
              <option value="ALL">All Status</option>
              {ReportStatusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-black border border-border rounded-lg px-4 py-2 text-zinc-300 focus:ring-2 focus:ring-orange-500/30"
            >
              <option value="ALL">All Types</option>
              {ReportTypeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <span className="text-zinc-400">
            {filteredReports.length} Reports
          </span>
        </div>

        {/* REPORT CARDS */}
        <div className="grid gap-6">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              className="bg-[#1f1a16] p-6 rounded-2xl border border-white/5 hover:border-orange-500/20 transition"
            >
              <div className="flex justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      {r.title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </div>

                  <p className="text-zinc-400 text-sm">{r.description}</p>

                  <div className="flex flex-wrap gap-6 text-sm text-zinc-500">
                    <span>{r.type}</span>
                    <span>{r.location || "N/A"}</span>
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  {r.image && (
                    <img
                      src={r.image}
                      alt="Report"
                      className="mt-4 rounded-xl border border-border"
                    />
                  )}
                </div>

                <select
                  value={r.status}
                  onChange={(e) =>
                    updateReportStatus(r.id, e.target.value as ReportStatus)
                  }
                  className="h-fit bg-black border border-border rounded-lg px-4 py-2 text-zinc-300 focus:ring-2 focus:ring-orange-500/30"
                >
                  {ReportStatusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-16 text-zinc-500 bg-[#1f1a16] rounded-2xl border border-white/5">
              No reports found.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

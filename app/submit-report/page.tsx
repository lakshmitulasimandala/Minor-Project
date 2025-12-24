import { ReportWizard } from "@/components/report/ReportWizard";

export default function SubmitReport() {
  return (
    <div className="relative min-h-screen bg-black selection:bg-orange-500/20 overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10 min-h-screen">
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.05),transparent_40%)]" />
        <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_bottom_left,rgba(251,146,60,0.03),transparent_50%)]" />
      </div>

      <main className="relative px-6 pt-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex h-9 items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 text-sm text-orange-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure & Anonymous
            </div>

            <h1 className="mt-8 bg-gradient-to-b from-white to-white/80 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
              Submit Anonymous Report
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
              Your safety is our priority. All submissions are encrypted and
              anonymized.
            </p>
          </div>

          <div className="mt-16 rounded-2xl border border-orange-500/20 p-6" style={{backgroundColor: "var(--card)"}}>
            <ReportWizard />
          </div>
        </div>
      </main>
    </div>
  );
}

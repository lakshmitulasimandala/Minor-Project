// app/api/reverse-geocode/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { latitude, longitude } = body ?? {};

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json({ error: "latitude and longitude required" }, { status: 400 });
    }

    const key = process.env.LOCATIONIQ_KEY; // or use Nominatim (no key)
    if (!key) {
      // If we wanna prefer Nominatim (no key) uncomment and use that block below
      // const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
      // const r = await fetch(nominatimUrl, { headers: { "User-Agent": "SafeReport/1.0" } });
      // const data = await r.json();
      // return NextResponse.json({ display_name: data.display_name || "", raw: data });
      // only make these changes when necessary bro ! if not ignore !.
      return NextResponse.json({ error: "LOCATIONIQ_KEY not set on server" }, { status: 500 });
    }

    const url = `https://us1.locationiq.com/v1/reverse?key=${encodeURIComponent(
      key
    )}&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&format=json`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "SafeReport/1.0 (you@example.com)",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json({ error: "Reverse geocode provider error", status: res.status, details: txt }, { status: 502 });
    }

    const data = await res.json().catch(() => null);
    return NextResponse.json({
      display_name: data?.display_name || "",
      lat: data?.lat,
      lon: data?.lon,
      address: data?.address || {},
      raw: data,
    });
  } catch (err: any) {
    console.error("reverse-geocode route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

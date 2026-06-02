import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q")

    if (!q || q.length < 3) {
        return NextResponse.json(
            { error: "Query must be at least 3 characters" },
            { status: 400 }
        )
    }

    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=1`,
            {
                headers: {
                    "User-Agent": "Lency-App"
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Nominatim returned ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Geocoding error:", error)
        return NextResponse.json(
            { error: "Geocoding failed" },
            { status: 500 }
        )
    }
}

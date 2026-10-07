import { NextResponse } from "next/server";
import { getCoinChart } from "@/lib/coins";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  if (!/^[a-z0-9-]{1,64}$/i.test(id)) {
    return NextResponse.json({ points: [] }, { status: 400 });
  }

  const points = await getCoinChart(id);
  if (points.length === 0) {
    return NextResponse.json({ points: [] }, { status: 503 });
  }
  return NextResponse.json({ points });
}

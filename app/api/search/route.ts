import { NextResponse } from "next/server";
import { localSearch } from "@/lib/search-server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const hits = await localSearch(q);
  return NextResponse.json({ hits });
}

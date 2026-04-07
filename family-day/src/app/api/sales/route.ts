import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const SALES_PATH = path.join(process.cwd(), "data", "sales.json");

export async function GET() {
  try {
    const data = await fs.readFile(SALES_PATH, "utf-8");
    const sales = JSON.parse(data);
    return NextResponse.json(sales);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sale = await req.json();
    const data = await fs.readFile(SALES_PATH, "utf-8");
    const sales = JSON.parse(data);
    sales.push(sale);
    await fs.writeFile(SALES_PATH, JSON.stringify(sales, null, 2));
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

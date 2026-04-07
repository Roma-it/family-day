import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const MENU_PATH = path.join(process.cwd(), "data", "menu.json");

export async function GET() {
  try {
    const data = await fs.readFile(MENU_PATH, "utf-8");
    const menu = JSON.parse(data);
    return NextResponse.json(menu);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

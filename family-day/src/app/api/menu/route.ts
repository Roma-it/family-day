import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menu = await prisma.menuItem.findMany();
    return NextResponse.json(menu);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

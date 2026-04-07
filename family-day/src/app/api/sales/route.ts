import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ventas = await prisma.venta.findMany({
      include: {
        cuenta: true,
        items: {
          include: { producto: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(ventas);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const venta = await req.json();
    // venta: { cuentaId, total, items: [{ productoId, cantidad, subtotal }] }
    const nuevaVenta = await prisma.venta.create({
      data: {
        cuentaId: venta.cuentaId,
        total: venta.total,
        items: {
          create: venta.items.map((item: any) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        items: true,
      },
    });
    return NextResponse.json({ ok: true, venta: nuevaVenta });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 },
    );
  }
}

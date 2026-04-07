"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

type MenuItem = { id: string; nombre: string; precio: number };
type Account = { id: string; nombre: string };

type VentaItem = {
  productoId: string;
  cantidad: number;
  subtotal: number;
};

type Venta = {
  items: VentaItem[];
  cuentaId: string;
  total: number;
};
import Link from "next/link";

export default function Home() {
  return (
    <div className='min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 py-8 px-2'>
      <Navbar />
      <h1 className='text-3xl md:text-4xl font-extrabold mb-12 text-blue-900 drop-shadow text-center w-full'>
        Family Day
      </h1>
      <div className='flex flex-col gap-8 w-full max-w-xs'>
        <Link
          href='/caja'
          className='bg-blue-700 text-white rounded-lg px-6 py-6 font-bold text-xl shadow hover:bg-blue-800 transition-colors text-center'>
          Ir a Caja
        </Link>
        <Link
          href='/resumen'
          className='bg-blue-500 text-white rounded-lg px-6 py-6 font-bold text-xl shadow hover:bg-blue-600 transition-colors text-center'>
          Ver Resumen
        </Link>
      </div>
    </div>
  );
}

// Página de Resumen: estadísticas por cuenta y por producto
"use client";
import Link from "next/link";
import Navbar from "../Navbar";
import { useEffect, useState } from "react";

type MenuItem = { id: string; nombre: string; precio: number };
type Account = { id: string; nombre: string };
type VentaItem = { productoId: string; cantidad: number; subtotal: number };
type Venta = { items: VentaItem[]; cuentaId: string; total: number };

export default function Resumen() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenu);
    fetch("/api/accounts")
      .then((res) => res.json())
      .then(setAccounts);
    fetch("/api/sales")
      .then((res) => res.json())
      .then(setVentas);
  }, []);

  // Resumen por cuenta
  const resumenCuentas = accounts
    .map((cuenta) => {
      const total = ventas
        .filter((venta) => venta.cuentaId === cuenta.id)
        .reduce((sum, venta) => sum + (venta.total || 0), 0);
      return { ...cuenta, total };
    })
    .sort((a, b) => b.total - a.total);

  // Resumen por producto
  const resumenProductos = menu
    .map((producto) => {
      let cantidad = 0;
      let dinero = 0;
      ventas.forEach((venta) => {
        venta.items.forEach((item) => {
          if (item.productoId === producto.id) {
            cantidad += item.cantidad;
            dinero += item.subtotal;
          }
        });
      });
      return { ...producto, cantidad, dinero };
    })
    .sort((a, b) => b.cantidad - a.cantidad);

  return (
    <div className='mb-18 min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-blue-200 pb-8 px-2 pt-0'>
      <Navbar />
      <div className='w-full max-w-3xl flex flex-col gap-10 mt-0'>
        <div className='bg-white/95 p-6 rounded-xl shadow-lg border border-blue-200'>
          <h2 className='text-xl font-extrabold mb-4 text-blue-900 text-center'>
            Resumen por cuenta
          </h2>
          <table className='w-full text-left text-blue-900 font-medium table-fixed'>
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr>
                <th className='py-1'>Cuenta</th>
                <th className='py-1 text-right'>Total</th>
              </tr>
            </thead>
            <tbody>
              {resumenCuentas.map((cuenta) => (
                <tr key={cuenta.id}>
                  <td className='py-1 pr-2'>{cuenta.nombre}</td>
                  <td className='py-1 text-right pl-4 whitespace-nowrap'>
                    $ {cuenta.total.toLocaleString("es-AR")}
                  </td>
                </tr>
              ))}
              <tr className='border-t border-blue-300 font-bold'>
                <td className='py-2'>TOTAL</td>
                <td className='py-2 text-right pl-4 whitespace-nowrap'>
                  ${" "}
                  {resumenCuentas
                    .reduce((sum, c) => sum + c.total, 0)
                    .toLocaleString("es-AR")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='bg-white/95 p-6 rounded-xl shadow-lg border border-blue-200'>
          <h2 className='text-xl font-extrabold mb-4 text-blue-900 text-center'>
            Resumen por producto
          </h2>
          <table className='w-full text-left text-blue-900 font-medium'>
            <thead>
              <tr>
                <th className='py-1'>Producto</th>
                <th className='py-1 text-right'>Cantidad</th>
                <th className='py-1 text-right'>Total $</th>
              </tr>
            </thead>
            <tbody>
              {resumenProductos.map((prod) => (
                <tr key={prod.id}>
                  <td className='py-1 pr-2 truncate max-w-[10rem]'>
                    {prod.nombre}
                  </td>
                  <td className='py-1 text-right pl-2 pr-2'>
                    {prod.cantidad.toLocaleString("es-AR")}
                  </td>
                  <td className='py-1 text-right pl-4 whitespace-nowrap'>
                    $ {prod.dinero.toLocaleString("es-AR")}
                  </td>
                </tr>
              ))}
              <tr className='border-t border-blue-300 font-bold'>
                <td className='py-2'>TOTAL</td>
                <td className='py-2 text-right pl-2 pr-2'>
                  {resumenProductos
                    .reduce((sum, p) => sum + p.cantidad, 0)
                    .toLocaleString("es-AR")}
                </td>
                <td className='py-2 text-right pl-4'>
                  ${" "}
                  {resumenProductos
                    .reduce((sum, p) => sum + p.dinero, 0)
                    .toLocaleString("es-AR")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

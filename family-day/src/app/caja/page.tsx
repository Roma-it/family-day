"use client";
import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

type MenuItem = { id: string; nombre: string; precio: number };
type Account = { id: string; nombre: string };
type VentaItem = { productoId: string; cantidad: number; subtotal: number };
type Venta = { items: VentaItem[]; cuentaId: string; total: number };

export default function Caja() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [productoId, setProductoId] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [cuentaId, setCuentaId] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [tipoMensaje, setTipoMensaje] = useState<"success" | "warning" | "">(
    "",
  );
  const [carrito, setCarrito] = useState<VentaItem[]>([]);

  const totalPorCuenta: Record<string, number> = ventas.reduce(
    (acc, venta) => {
      acc[venta.cuentaId] = (acc[venta.cuentaId] || 0) + venta.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  const LIMITE = 500000;
  const cuentaInhabilitada = cuentaId && totalPorCuenta[cuentaId] >= LIMITE;

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

  function agregarItem(e: React.FormEvent) {
    e.preventDefault();
    if (!productoId || cantidad < 1) {
      setMensaje("Selecciona un producto y cantidad válida.");
      setTipoMensaje("warning");
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 2000);
      return;
    }
    const producto = menu.find((p) => p.id === productoId);
    if (!producto) return;
    setCarrito([
      ...carrito,
      {
        productoId,
        cantidad,
        subtotal: producto.precio * cantidad,
      },
    ]);
    setProductoId("");
    setCantidad(1);
  }

  async function registrarVenta(e: React.FormEvent) {
    e.preventDefault();
    if (carrito.length === 0 || !cuentaId) {
      setMensaje("Agrega al menos un producto y selecciona una cuenta.");
      setTipoMensaje("warning");
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 2000);
      return;
    }
    if (cuentaInhabilitada) {
      setMensaje(
        "Esta cuenta ha alcanzado el máximo permitido de $500.000 y no puede recibir más ventas.",
      );
      setTipoMensaje("warning");
      setTimeout(() => {
        setMensaje("");
        setTipoMensaje("");
      }, 3000);
      return;
    }
    const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
    const nuevaVenta = {
      items: carrito,
      cuentaId,
      total,
    };
    await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevaVenta),
    });
    const ventasActualizadas = await fetch("/api/sales").then((res) =>
      res.json(),
    );
    setVentas(ventasActualizadas);
    setCarrito([]);
    setCuentaId("");
    setMensaje("¡Venta registrada exitosamente!");
    setTipoMensaje("success");
    setTimeout(() => {
      setMensaje("");
      setTipoMensaje("");
    }, 2000);
  }
  //
  return (
    <div className='mb-18 min-h-screen w-full flex flex-col items-center justify-start bg-gradient-to-br from-blue-100 via-white to-blue-200 pb-6 md: px-2 relative'>
      <Navbar />

      {mensaje && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 top-6 z-50 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg animate-fade-in-out transition-all max-w-[95vw] w-full sm:w-auto text-center
            ${tipoMensaje === "success" ? "bg-green-600" : ""}
            ${tipoMensaje === "warning" ? "bg-orange-500" : ""}
          `}>
          {mensaje}
        </div>
      )}

      <h1 className='text-3xl md:text-4xl font-extrabold mb-8 text-blue-900 drop-shadow text-center w-full'>
        Registro de ventas
      </h1>

      <div className='w-full flex flex-col md:flex-row md:items-start md:justify-center gap-8 max-w-5xl'>
        <div className='flex flex-col gap-6 w-full md:w-1/3'>
          {/* Formulario para agregar items al carrito */}
          <form
            className='flex flex-col gap-4 bg-white/95 p-8 rounded-xl shadow-lg w-full border border-blue-200'
            onSubmit={agregarItem}>
            <label className='flex flex-col text-blue-900 font-semibold'>
              Producto
              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className='border-2 border-blue-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium'>
                <option value='' disabled>
                  Selecciona un producto
                </option>
                {menu.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} (${item.precio})
                  </option>
                ))}
              </select>
            </label>
            <label className='flex flex-col text-blue-900 font-semibold'>
              Cantidad
              <div className='w-full flex items-center justify-center gap-2 mt-1'>
                <button
                  type='button'
                  aria-label='Restar'
                  className='bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center border border-blue-300'
                  onClick={() => setCantidad((c) => Math.max(1, c - 1))}>
                  <MinusIcon className='h-5 w-5' />
                </button>
                <input
                  type='text'
                  inputMode='numeric'
                  pattern='[0-9]*'
                  min={1}
                  value={cantidad === 0 ? "" : cantidad}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setCantidad(val === "" ? 0 : Math.max(1, Number(val)));
                  }}
                  className='border-2 border-blue-300 rounded w-16 text-center px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium text-lg'
                />
                <button
                  type='button'
                  aria-label='Sumar'
                  className='bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center border border-blue-300'
                  onClick={() => setCantidad((c) => Math.max(1, c + 1))}>
                  <PlusIcon className='h-5 w-5' />
                </button>
              </div>
            </label>
            <button
              type='submit'
              className='bg-blue-600 text-white rounded-lg px-4 py-2 font-semibold hover:bg-blue-700 transition-colors'>
              Agregar item
            </button>
          </form>

          {/* Carrito de items */}
          {carrito.length > 0 && (
            <div className='w-full bg-white/95 p-6 rounded-xl shadow-lg border border-blue-200'>
              <h2 className='text-xl font-extrabold mb-4 text-blue-900'>
                Carrito
              </h2>
              <table className='w-full text-blue-900 font-medium text-sm table-fixed'>
                <colgroup>
                  <col style={{ width: "50%" }} />
                  <col style={{ width: "18%" }} />
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className='py-1 text-left'>Producto</th>
                    <th className='py-1 text-center'>Cantidad</th>
                    <th className='py-1 text-right align-middle'>Subtotal</th>
                    <th className='py-1 text-center'></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item, idx) => (
                    <tr key={idx}>
                      <td className='py-1'>
                        {menu.find((m) => m.id === item.productoId)?.nombre ||
                          item.productoId}
                      </td>
                      <td className='py-1 text-center'>
                        {item.cantidad.toLocaleString("es-AR")}
                      </td>
                      <td className='py-1 text-right align-middle'>
                        $ {item.subtotal.toLocaleString("es-AR")}
                      </td>
                      <td className='py-1 text-center align-middle'>
                        <button
                          type='button'
                          className='p-0.5 text-red-600 hover:text-red-800'
                          aria-label='Quitar'
                          onClick={() => {
                            setCarrito(carrito.filter((_, i) => i !== idx));
                          }}>
                          <TrashIcon className='h-5 w-5' strokeWidth={2.2} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className='font-bold text-right pr-2'>
                      Total:
                    </td>
                    <td className='font-bold text-right'>
                      ${" "}
                      {carrito
                        .reduce((sum, i) => sum + i.subtotal, 0)
                        .toLocaleString("es-AR")}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Formulario para registrar la venta */}
          <form
            className='flex flex-col gap-4 bg-white/95 p-6 rounded-xl shadow-lg w-full border border-blue-200'
            onSubmit={registrarVenta}>
            <label className='flex flex-col text-blue-900 font-semibold'>
              Cuenta
              <select
                value={cuentaId}
                onChange={(e) => setCuentaId(e.target.value)}
                className='border-2 border-blue-300 rounded p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-blue-900 font-medium'>
                <option value='' disabled>
                  Selecciona una cuenta
                </option>
                {accounts.map((cuenta) => (
                  <option key={cuenta.id} value={cuenta.id}>
                    {cuenta.nombre}
                  </option>
                ))}
              </select>
            </label>
            {cuentaInhabilitada && cuentaId && (
              <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-3 rounded mb-2 font-semibold'>
                ⚠️ Esta cuenta ha alcanzado el máximo permitido de $500.000 y no
                puede recibir más ventas.
              </div>
            )}
            <button
              type='submit'
              className={`bg-blue-700 text-white rounded-lg px-4 py-3 font-bold text-lg shadow transition-colors ${cuentaInhabilitada ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-800"}`}
              disabled={!!cuentaInhabilitada}>
              Registrar venta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import {
  HomeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  return (
    <>
      <nav className='fixed bottom-0 left-0 w-full z-40 bg-white/90 border-t border-blue-200 shadow-lg flex justify-center items-center px-2 py-1 md:py-2'>
        <div className='flex gap-8 w-full max-w-md justify-center'>
          <Link
            href='/'
            className='flex flex-col items-center flex-1 px-2 py-2 group'>
            <HomeIcon className='h-7 w-7 text-blue-700 group-hover:text-blue-900' />
            <span className='text-xs text-blue-900 font-bold mt-1'>Home</span>
          </Link>
          <Link
            href='/caja'
            className='flex flex-col items-center flex-1 px-2 py-2 group'>
            <ShoppingBagIcon className='h-7 w-7 text-blue-700 group-hover:text-blue-900' />
            <span className='text-xs text-blue-900 font-bold mt-1'>Caja</span>
          </Link>
          <Link
            href='/resumen'
            className='flex flex-col items-center flex-1 px-2 py-2 group'>
            <ChartBarIcon className='h-7 w-7 text-blue-700 group-hover:text-blue-900' />
            <span className='text-xs text-blue-900 font-bold mt-1'>
              Resumen
            </span>
          </Link>
        </div>
      </nav>
      {/* Espaciado para que el contenido no quede tapado */}
      <div className='h-20 md:h-16' />
    </>
  );
}

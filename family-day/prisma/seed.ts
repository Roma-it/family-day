import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed menú completo
  const menu = [
    { id: "medialuna", nombre: "Medialuna", precio: 2000 },
    { id: "churro", nombre: "Churro", precio: 2000 },
    { id: "dona", nombre: "Dona", precio: 2000 },
    {
      id: "porcion_dulce",
      nombre: "Porción Dulce (Budin/Brownie/Torta)",
      precio: 3000,
    },
    { id: "agua_mate", nombre: "Agua para el mate", precio: 1000 },
    { id: "infusion", nombre: "Infusión (Té/Café)", precio: 2000 },
    { id: "rifa", nombre: "Rifa", precio: 3000 },
    { id: "hamburguesa", nombre: "Hamburguesa", precio: 5000 },
    { id: "hamburguesa_bebida", nombre: "Hamburguesa + Bebida", precio: 7000 },
    { id: "choripan", nombre: "Choripan", precio: 6000 },
    { id: "choripan_bebida", nombre: "Choripan + Bebida", precio: 7500 },
    { id: "porcion_tarta", nombre: "Porción de tarta", precio: 5000 },
    {
      id: "porcion_tarta_bebida",
      nombre: "Porción de tarta + Bebida",
      precio: 7000,
    },
    { id: "bebida", nombre: "Bebida", precio: 3000 },
    { id: "jugo_baggio", nombre: "Jugo Baggio (cajita)", precio: 2000 },
  ];
  for (const item of menu) {
    await prisma.menuItem.upsert({
      where: { nombre: item.nombre },
      update: { id: item.id, precio: item.precio },
      create: item,
    });
  }

  // (Eliminado bloque duplicado de menú)

  console.log("Seeds cargados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

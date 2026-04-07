/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `MenuItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Account_nombre_key" ON "Account"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "MenuItem_nombre_key" ON "MenuItem"("nombre");

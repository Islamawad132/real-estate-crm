-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "contracts_agentId_idx" ON "contracts"("agentId");

// Передаёт права админа (вызывается из handover-multisig.sh).
import { setup, parseAddress, run } from "./common";

run(async () => {
  const { program, config, provider } = setup();
  const newAdmin = parseAddress(process.env.NEW_ADMIN, "NEW_ADMIN (адрес хранилища Squads)");
  const before = await program.account.config.fetch(config);
  if (!before.admin.equals(provider.wallet.publicKey)) throw new Error(`Текущий админ — ${before.admin.toBase58()}, а не этот кошелёк`);
  const sig = await program.methods.setAdmin(newAdmin).accountsPartial({ config }).rpc();
  const after = await program.account.config.fetch(config);
  console.log("Админ был: ", before.admin.toBase58());
  console.log("Админ стал:", after.admin.toBase58());
  console.log("Транзакция:", sig);
});

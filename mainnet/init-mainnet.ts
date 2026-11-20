// Создаёт конфигурацию контракта в mainnet. Запускается из deploy-mainnet.sh.
import { PublicKey } from "@solana/web3.js";
import { setup, parseAddress, run, BPF_UPGRADEABLE } from "./common";

run(async () => {
  const { provider, program, config } = setup();
  const creator = parseAddress(process.env.CREATOR, "CREATOR (кошелёк для 6%)");

  if (await provider.connection.getAccountInfo(config)) {
    const c = await program.account.config.fetch(config);
    console.log("Конфигурация уже создана. Админ:", c.admin.toBase58(), " Кошелёк 6%:", c.creator.toBase58());
    return;
  }
  const [programData] = PublicKey.findProgramAddressSync([program.programId.toBuffer()], BPF_UPGRADEABLE);
  const sig = await program.methods.initialize(creator).accountsPartial({ config, programData }).rpc();
  const c = await program.account.config.fetch(config);
  console.log("Конфигурация создана:", config.toBase58());
  console.log("  Админ:      ", c.admin.toBase58());
  console.log("  Кошелёк 6%:", c.creator.toBase58());
  console.log("  Транзакция: ", sig);
});

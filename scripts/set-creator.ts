// Смена кошелька для 15%. Запуск: NEW_CREATOR=<адрес> anchor run set-creator
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { HelpSplit } from "../target/types/help_split";

async function main() {
  const addr = process.env.NEW_CREATOR;
  if (!addr) throw new Error("Укажите NEW_CREATOR=<адрес кошелька>");
  const newCreator = new PublicKey(addr);
  if (!PublicKey.isOnCurve(newCreator.toBytes())) throw new Error("Это не адрес обычного кошелька");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HelpSplit as anchor.Program<HelpSplit>;
  const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], program.programId);

  const before = await program.account.config.fetch(config);
  console.log("Было:  ", before.creator.toBase58());
  const sig = await program.methods.setCreator(newCreator).accountsPartial({ config }).rpc();
  const after = await program.account.config.fetch(config);
  console.log("Стало: ", after.creator.toBase58());
  console.log("Транзакция:", sig);
}

main().catch((e) => { console.error(e); process.exit(1); });

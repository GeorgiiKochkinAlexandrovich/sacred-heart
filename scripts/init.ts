// Запуск: anchor run init  (после anchor build && anchor deploy)
// Создаёт конфиг и стартовые направления. ЗАМЕНИ адреса получателей на реальные!
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { HelpSplit } from "../target/types/help_split";

// В devnet по умолчанию 15% идут на твой тестовый кошелёк, получатели — тестовые (их создаёт deploy-devnet.sh).
// Для mainnet задай CREATOR и BENEFICIARIES (4 адреса через запятую) реальными кошельками.
const BENS = (process.env.BENEFICIARIES ?? "").split(",").filter(Boolean);

const CAUSES: { name: string; category: object; beneficiary: string }[] = [
  { name: "Лечение зависимостей и психическое здоровье", category: { addictionMentalHealth: {} }, beneficiary: BENS[0] },
  { name: "Восстановление документов за границей",       category: { lostDocuments: {} },         beneficiary: BENS[1] },
  { name: "Помощь украинцам, пострадавшим от войны",     category: { ukraineWar: {} },            beneficiary: BENS[2] },
  { name: "Сборы на операции",                           category: { surgery: {} },               beneficiary: BENS[3] },
];

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.HelpSplit as anchor.Program<HelpSplit>;
  const CREATOR = new PublicKey(process.env.CREATOR ?? provider.wallet.publicKey.toBase58());
  if (BENS.length < CAUSES.length) throw new Error("Нужно BENEFICIARIES: 4 адреса через запятую");
  const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], program.programId);

  if (!(await provider.connection.getAccountInfo(config))) {
    await program.methods.initialize(CREATOR).rpc();
    console.log("Config создан:", config.toBase58());
  }

  const existing = (await program.account.config.fetch(config)).causeCount;
  if (existing > 0) { console.log(`Направления уже созданы (${existing}), пропускаю.`); return; }

  for (const c of CAUSES) {
    const cfg = await program.account.config.fetch(config);
    const idBytes = Buffer.alloc(4);
    idBytes.writeUInt32LE(cfg.causeCount);
    const [cause] = PublicKey.findProgramAddressSync([Buffer.from("cause"), idBytes], program.programId);
    await program.methods
      .addCause(c.name, c.category as any, new PublicKey(c.beneficiary))
      .accountsPartial({ config, cause })
      .rpc();
    console.log(`#${cfg.causeCount} ${c.name} -> ${c.beneficiary}`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });

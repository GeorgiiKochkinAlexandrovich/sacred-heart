// Добавляет направления с РЕАЛЬНЫМИ получателями из mainnet/causes.json.
// По умолчанию — только проверка (ничего не отправляет). Отправка: CONFIRM=yes.
import * as fs from "fs";
import * as path from "path";
import { PublicKey } from "@solana/web3.js";
import { setup, parseAddress, run } from "./common";

const CATEGORIES = ["addictionMentalHealth", "lostDocuments", "ukraineWar", "surgery"];
const FILE = path.join(__dirname, "causes.json");

type Row = { name: string; category: string; beneficiary: string; partner: string; proof: string; status: string; causeId?: number; tx?: string };

run(async () => {
  const { program, config } = setup();
  const cfg = await program.account.config.fetch(config);
  const rows: Row[] = JSON.parse(fs.readFileSync(FILE, "utf8"));
  const todo = rows.filter((r) => r.status === "new");
  if (!todo.length) { console.log("Нет новых направлений (status: \"new\")."); return; }

  // Проверки до отправки
  const seen = new Set<string>();
  for (const r of todo) {
    const where = `«${r.name || "без названия"}»`;
    if (!r.name || Buffer.byteLength(r.name, "utf8") > 128) throw new Error(`${where}: название пустое или длиннее 128 байт`);
    if (!CATEGORIES.includes(r.category)) throw new Error(`${where}: category должна быть одной из: ${CATEGORIES.join(", ")}`);
    if (!r.partner) throw new Error(`${where}: не указан partner (кто получатель)`);
    if (!r.proof) throw new Error(`${where}: не указан proof (ссылка или письмо, где партнёр подтвердил адрес)`);
    const b = parseAddress(r.beneficiary, `${where} beneficiary`);
    if (b.equals(cfg.creator)) throw new Error(`${where}: получатель совпадает с кошельком создателя`);
    if (seen.has(b.toBase58())) throw new Error(`${where}: этот адрес уже указан у другого направления`);
    seen.add(b.toBase58());
    if (!PublicKey.isOnCurve(b.toBytes())) console.log(`!  ${where}: адрес не похож на обычный кошелёк (возможно, адрес контракта). Проверьте с партнёром.`);
  }

  console.log("Будут добавлены направления:");
  todo.forEach((r) => console.log(`  • ${r.name} [${r.category}] → ${r.beneficiary}  (${r.partner})`));

  if (process.env.CONFIRM !== "yes") {
    console.log("\nЭто была ПРОВЕРКА, ничего не отправлено. Если всё верно, запустите с CONFIRM=yes.");
    return;
  }

  for (const r of todo) {
    const c = await program.account.config.fetch(config);
    const id = c.causeCount;
    const idBytes = Buffer.alloc(4); idBytes.writeUInt32LE(id);
    const [cause] = PublicKey.findProgramAddressSync([Buffer.from("cause"), idBytes], program.programId);
    const category = { [r.category]: {} } as any;
    const sig = await program.methods.addCause(r.name, category, new PublicKey(r.beneficiary)).accountsPartial({ config, cause }).rpc();
    r.status = "added"; r.causeId = id; r.tx = sig;
    fs.writeFileSync(FILE, JSON.stringify(rows, null, 2) + "\n");
    console.log(`✓ #${id} ${r.name}  tx: ${sig}`);
  }
});

// Общие функции для скриптов mainnet. Провайдер берётся из ANCHOR_PROVIDER_URL и ANCHOR_WALLET.
import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import idl from "../target/idl/help_split.json";
import { HelpSplit } from "../target/types/help_split";

export const BPF_UPGRADEABLE = new PublicKey("BPFLoaderUpgradeab1e11111111111111111111111");

export function setup() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = new anchor.Program(idl as unknown as HelpSplit, provider);
  const [config] = PublicKey.findProgramAddressSync([Buffer.from("config")], program.programId);
  return { provider, program, config };
}

export function parseAddress(value: string | undefined, label: string): PublicKey {
  if (!value) throw new Error(`Не указан ${label}`);
  let pk: PublicKey;
  try { pk = new PublicKey(value.trim()); } catch { throw new Error(`${label}: «${value}» — не адрес Solana`); }
  if (pk.equals(PublicKey.default)) throw new Error(`${label}: нулевой адрес`);
  return pk;
}

export function run(main: () => Promise<void>) {
  main().then(() => process.exit(0)).catch((e) => { console.error("\n!! ОШИБКА:", e?.message ?? e); process.exit(1); });
}

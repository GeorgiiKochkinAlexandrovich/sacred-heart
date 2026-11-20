/* Настройки сети сайта Sacred Heart.
   Сейчас — тестовая сеть (devnet). Для запуска с настоящими деньгами
   см. mainnet/README-MAINNET.md, шаг «Переключить сайт». */
window.SH_CONFIG = {
  cluster: "devnet",                                         // "devnet" или "mainnet-beta"
  rpc: "https://api.devnet.solana.com",                      // для mainnet — ссылка Helius с ограничением по домену
  programId: "5Ei6gHSQspXtzyMH9wxAru4CEoEx2eyedBQGAPzTzNau",
};

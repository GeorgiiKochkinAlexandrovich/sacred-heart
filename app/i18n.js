/* Sacred Heart — переводы сайта. Языки: ru, en, es, sr (латиница), fr, de.
   Чтобы поправить текст, меняйте строку нужного языка. HTML-теги внутри строк (<em>, <b>) сохраняйте. */
(function () {
  const LANGS = [
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "sr", name: "Srpski" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
  ];

  const T = {
    "meta.title": {
      ru: "Sacred Heart — прозрачная помощь на Solana",
      en: "Sacred Heart — transparent giving on Solana",
      es: "Sacred Heart — ayuda transparente en Solana",
      sr: "Sacred Heart — transparentna pomoć na Solani",
      fr: "Sacred Heart — des dons transparents sur Solana",
      de: "Sacred Heart — transparente Hilfe auf Solana",
    },
    "meta.desc": {
      ru: "Sacred Heart — прозрачная благотворительная платформа на Solana. 85% каждого пожертвования автоматически уходит на помощь.",
      en: "Sacred Heart is a transparent charity platform on Solana. 85% of every donation goes straight to help.",
      es: "Sacred Heart es una plataforma benéfica transparente en Solana. El 85% de cada donación va directamente a la ayuda.",
      sr: "Sacred Heart je transparentna humanitarna platforma na Solani. 85% svake donacije ide direktno na pomoć.",
      fr: "Sacred Heart est une plateforme caritative transparente sur Solana. 85 % de chaque don va directement à l'aide.",
      de: "Sacred Heart ist eine transparente Spendenplattform auf Solana. 85 % jeder Spende gehen direkt in die Hilfe.",
    },
    "banner": {
      ru: "Тестовая версия: платформа работает в тестовой сети Solana (Devnet). Настоящие деньги пока не принимаются.",
      en: "Test version: the platform runs on the Solana test network (Devnet). Real money is not accepted yet.",
      es: "Versión de prueba: la plataforma funciona en la red de pruebas de Solana (Devnet). Todavía no se acepta dinero real.",
      sr: "Probna verzija: platforma radi na Solana test mreži (Devnet). Pravi novac se još ne prima.",
      fr: "Version de test : la plateforme fonctionne sur le réseau de test Solana (Devnet). L'argent réel n'est pas encore accepté.",
      de: "Testversion: Die Plattform läuft im Solana-Testnetz (Devnet). Echtes Geld wird noch nicht angenommen.",
    },
    "aria.home": { ru: "Sacred Heart — на главную", en: "Sacred Heart — home", es: "Sacred Heart — inicio", sr: "Sacred Heart — početna", fr: "Sacred Heart — accueil", de: "Sacred Heart — Startseite" },
    "aria.sections": { ru: "Разделы", en: "Sections", es: "Secciones", sr: "Odeljci", fr: "Rubriques", de: "Bereiche" },
    "lang.label": { ru: "Язык", en: "Language", es: "Idioma", sr: "Jezik", fr: "Langue", de: "Sprache" },

    "nav.causes": { ru: "Направления", en: "Causes", es: "Causas", sr: "Oblasti pomoći", fr: "Causes", de: "Bereiche" },
    "nav.how": { ru: "Как это работает", en: "How it works", es: "Cómo funciona", sr: "Kako funkcioniše", fr: "Comment ça marche", de: "So funktioniert es" },
    "nav.transp": { ru: "Прозрачность", en: "Transparency", es: "Transparencia", sr: "Transparentnost", fr: "Transparence", de: "Transparenz" },
    "nav.founder": { ru: "Об основателе", en: "About the founder", es: "Sobre el fundador", sr: "O osnivaču", fr: "Le fondateur", de: "Über den Gründer" },
    "nav.help": { ru: "Получить помощь", en: "Get help", es: "Pedir ayuda", sr: "Zatražite pomoć", fr: "Demander de l'aide", de: "Hilfe erhalten" },
    "btn.connect": { ru: "Подключить кошелёк", en: "Connect wallet", es: "Conectar billetera", sr: "Poveži novčanik", fr: "Connecter le portefeuille", de: "Wallet verbinden" },

    "hero.eyebrow": { ru: "Благотворительная платформа на Solana", en: "A charity platform on Solana", es: "Plataforma benéfica en Solana", sr: "Humanitarna platforma na Solani", fr: "Une plateforme caritative sur Solana", de: "Eine Spendenplattform auf Solana" },
    "hero.title": {
      ru: "Каждое сердце заслуживает <em>второй шанс.</em>",
      en: "Every heart deserves <em>a second chance.</em>",
      es: "Todo corazón merece <em>una segunda oportunidad.</em>",
      sr: "Svako srce zaslužuje <em>drugu šansu.</em>",
      fr: "Chaque cœur mérite <em>une seconde chance.</em>",
      de: "Jedes Herz verdient <em>eine zweite Chance.</em>",
    },
    "hero.lead": {
      ru: "Мы помогаем людям с зависимостями и психическими трудностями, тем, кто потерял документы за границей, украинцам, пострадавшим от войны, и тем, кому нужна операция. 85% каждого пожертвования уходит на помощь сразу, в момент перевода, и это видно в блокчейне.",
      en: "We help people facing addiction and mental health struggles, people who have lost their documents abroad, Ukrainians affected by the war, and those who need surgery. 85% of every donation goes to help instantly, at the moment of transfer — and you can see it on the blockchain.",
      es: "Ayudamos a personas con adicciones y problemas de salud mental, a quienes han perdido sus documentos en el extranjero, a ucranianos afectados por la guerra y a quienes necesitan una operación. El 85% de cada donación va a la ayuda al instante, en el momento de la transferencia, y se puede ver en la blockchain.",
      sr: "Pomažemo ljudima koji se bore sa zavisnošću i psihičkim teškoćama, onima koji su izgubili dokumenta u inostranstvu, Ukrajincima pogođenim ratom i onima kojima je potrebna operacija. 85% svake donacije ide na pomoć odmah, u trenutku transfera — i to se vidi na blokčejnu.",
      fr: "Nous aidons les personnes confrontées à l'addiction et aux difficultés psychiques, celles qui ont perdu leurs papiers à l'étranger, les Ukrainiens touchés par la guerre et celles qui ont besoin d'une opération. 85 % de chaque don part vers l'aide immédiatement, au moment du transfert — et c'est visible sur la blockchain.",
      de: "Wir helfen Menschen mit Sucht und psychischen Problemen, Menschen, die im Ausland ihre Papiere verloren haben, vom Krieg betroffenen Ukrainern und allen, die eine Operation brauchen. 85 % jeder Spende fließen sofort in die Hilfe — im Moment der Überweisung, sichtbar auf der Blockchain.",
    },
    "hero.cta": { ru: "Помочь сейчас", en: "Donate now", es: "Donar ahora", sr: "Donirajte sada", fr: "Faire un don", de: "Jetzt spenden" },
    "stat.total": { ru: "SOL передано на помощь", en: "SOL delivered to help", es: "SOL entregados a la ayuda", sr: "SOL predato za pomoć", fr: "SOL versés à l'aide", de: "SOL an die Hilfe übergeben" },
    "stat.count": { ru: "пожертвований", en: "donations", es: "donaciones", sr: "donacija", fr: "dons", de: "Spenden" },
    "stat.share": { ru: "каждого перевода — получателю помощи", en: "of every transfer goes to the recipient", es: "de cada transferencia va al destinatario", sr: "svakog transfera ide primaocu pomoći", fr: "de chaque transfert va au bénéficiaire", de: "jeder Überweisung gehen an den Empfänger" },

    "causes.eyebrow": { ru: "Направления помощи", en: "Causes", es: "Causas", sr: "Oblasti pomoći", fr: "Nos causes", de: "Hilfsbereiche" },
    "causes.title": { ru: "Выберите, кому помочь", en: "Choose who to help", es: "Elige a quién ayudar", sr: "Izaberite kome da pomognete", fr: "Choisissez qui aider", de: "Wählen Sie, wem Sie helfen" },
    "causes.sub": {
      ru: "У каждого направления свой проверенный кошелёк получателя. Суммы обновляются прямо из блокчейна.",
      en: "Each cause has its own verified recipient wallet. Totals update straight from the blockchain.",
      es: "Cada causa tiene su propia billetera de destinatario verificada. Los totales se actualizan directamente desde la blockchain.",
      sr: "Svaka oblast ima svoj provereni novčanik primaoca. Iznosi se ažuriraju direktno sa blokčejna.",
      fr: "Chaque cause a son propre portefeuille bénéficiaire vérifié. Les montants sont mis à jour directement depuis la blockchain.",
      de: "Jeder Bereich hat ein eigenes, geprüftes Empfänger-Wallet. Die Summen kommen direkt aus der Blockchain.",
    },

    "how.title": { ru: "Без посредников и скрытых комиссий", en: "No middlemen, no hidden fees", es: "Sin intermediarios ni comisiones ocultas", sr: "Bez posrednika i skrivenih provizija", fr: "Sans intermédiaires ni frais cachés", de: "Ohne Mittelsmänner und versteckte Gebühren" },
    "how.s1t": { ru: "Вы выбираете направление", en: "You choose a cause", es: "Eliges una causa", sr: "Birate oblast pomoći", fr: "Vous choisissez une cause", de: "Sie wählen einen Bereich" },
    "how.s1p": {
      ru: "Подключаете кошелёк Phantom и указываете сумму в SOL. Комиссия сети Solana — доли цента.",
      en: "Connect your Phantom wallet and enter an amount in SOL. The Solana network fee is a fraction of a cent.",
      es: "Conectas tu billetera Phantom e indicas una cantidad en SOL. La comisión de la red Solana es una fracción de céntimo.",
      sr: "Povežete Phantom novčanik i unesete iznos u SOL-u. Naknada Solana mreže je delić centa.",
      fr: "Connectez votre portefeuille Phantom et indiquez un montant en SOL. Les frais du réseau Solana sont d'une fraction de centime.",
      de: "Sie verbinden Ihr Phantom-Wallet und geben einen Betrag in SOL ein. Die Solana-Netzwerkgebühr beträgt Bruchteile eines Cents.",
    },
    "how.s2t": { ru: "Контракт делит перевод", en: "The contract splits it", es: "El contrato la divide", sr: "Ugovor deli transfer", fr: "Le contrat partage le don", de: "Der Vertrag teilt die Spende" },
    "how.s2p": {
      ru: "Смарт-контракт в той же транзакции отправляет 85% на кошелёк получателя и 15% создателю. Ни одна монета не проходит через чужие руки.",
      en: "In the same transaction, the smart contract sends 85% to the recipient's wallet and 15% to the creator. Not a single coin passes through anyone else's hands.",
      es: "En la misma transacción, el contrato inteligente envía el 85% a la billetera del destinatario y el 15% al creador. Ni una sola moneda pasa por otras manos.",
      sr: "U istoj transakciji pametni ugovor šalje 85% na novčanik primaoca i 15% osnivaču. Nijedan novčić ne prolazi kroz tuđe ruke.",
      fr: "Dans la même transaction, le contrat intelligent envoie 85 % au portefeuille du bénéficiaire et 15 % au créateur. Aucune pièce ne passe entre d'autres mains.",
      de: "In derselben Transaktion schickt der Smart Contract 85 % an das Wallet des Empfängers und 15 % an den Gründer. Keine Münze geht durch fremde Hände.",
    },
    "how.s3t": { ru: "Любой может проверить", en: "Anyone can verify", es: "Cualquiera puede verificarlo", sr: "Svako može da proveri", fr: "Tout le monde peut vérifier", de: "Jeder kann es prüfen" },
    "how.s3p": {
      ru: "Каждый перевод получает ссылку в Solana Explorer. Видно, кто получил деньги, сколько и когда.",
      en: "Every transfer gets a link in Solana Explorer. You can see who received the money, how much and when.",
      es: "Cada transferencia tiene un enlace en Solana Explorer. Se ve quién recibió el dinero, cuánto y cuándo.",
      sr: "Svaki transfer dobija link u Solana Explorer-u. Vidi se ko je primio novac, koliko i kada.",
      fr: "Chaque transfert a un lien dans Solana Explorer. On voit qui a reçu l'argent, combien et quand.",
      de: "Jede Überweisung hat einen Link im Solana Explorer. Man sieht, wer das Geld erhalten hat, wie viel und wann.",
    },
    "split.b": { ru: "85% — получателю помощи", en: "85% — to the recipient", es: "85% — al destinatario", sr: "85% — primaocu pomoći", fr: "85 % — au bénéficiaire", de: "85 % — an den Empfänger" },
    "split.c": { ru: "15% — создателю", en: "15% — to the creator", es: "15% — al creador", sr: "15% — osnivaču", fr: "15 % — au créateur", de: "15 % — an den Gründer" },
    "split.aria": { ru: "85% получателю помощи, 15% создателю", en: "85% to the recipient, 15% to the creator", es: "85% al destinatario, 15% al creador", sr: "85% primaocu pomoći, 15% osnivaču", fr: "85 % au bénéficiaire, 15 % au créateur", de: "85 % an den Empfänger, 15 % an den Gründer" },
    "split.note": {
      ru: "15% — это доход создателя платформы: на её работу, поддержку и жизнь. Мы говорим об этом открыто, и процент зашит в код: его невозможно поднять.",
      en: "The 15% is the platform creator's income — for running it, supporting it and making a living. We say so openly, and the percentage is fixed in the code: it cannot be raised.",
      es: "El 15% es el ingreso del creador de la plataforma: para su funcionamiento, su mantenimiento y para vivir. Lo decimos abiertamente, y el porcentaje está fijado en el código: no se puede aumentar.",
      sr: "15% je prihod osnivača platforme — za njen rad, održavanje i život. Govorimo to otvoreno, a procenat je upisan u kod: ne može se povećati.",
      fr: "Les 15 % sont le revenu du créateur de la plateforme : pour la faire fonctionner, l'entretenir et en vivre. Nous le disons ouvertement, et le pourcentage est inscrit dans le code : il ne peut pas augmenter.",
      de: "Die 15 % sind das Einkommen des Gründers — für Betrieb, Pflege der Plattform und seinen Lebensunterhalt. Wir sagen das offen, und der Anteil ist im Code festgelegt: Er kann nicht erhöht werden.",
    },

    "tr.title": { ru: "Не верьте на слово — проверьте", en: "Don't take our word for it — check", es: "No te fíes de nuestra palabra: compruébalo", sr: "Ne verujte na reč — proverite", fr: "Ne nous croyez pas sur parole — vérifiez", de: "Glauben Sie uns nicht einfach — prüfen Sie es" },
    "tr.sub": {
      ru: "Все адреса открыты. Вы можете в любой момент посмотреть каждое пожертвование и каждый вывод.",
      en: "All addresses are public. You can look up every donation and every withdrawal at any time.",
      es: "Todas las direcciones son públicas. Puedes consultar cada donación y cada retiro en cualquier momento.",
      sr: "Sve adrese su javne. U svakom trenutku možete videti svaku donaciju i svaku isplatu.",
      fr: "Toutes les adresses sont publiques. Vous pouvez consulter chaque don et chaque retrait à tout moment.",
      de: "Alle Adressen sind öffentlich. Sie können jede Spende und jede Auszahlung jederzeit einsehen.",
    },
    "tr.c1t": { ru: "Смарт-контракт", en: "Smart contract", es: "Contrato inteligente", sr: "Pametni ugovor", fr: "Contrat intelligent", de: "Smart Contract" },
    "tr.c1p": {
      ru: "Делит каждое пожертвование 85/15. Процент — константа в коде, его не может изменить даже создатель.",
      en: "Splits every donation 85/15. The percentage is a constant in the code — not even the creator can change it.",
      es: "Divide cada donación 85/15. El porcentaje es una constante en el código: ni siquiera el creador puede cambiarlo.",
      sr: "Deli svaku donaciju 85/15. Procenat je konstanta u kodu — ne može ga promeniti ni osnivač.",
      fr: "Partage chaque don 85/15. Le pourcentage est une constante du code : même le créateur ne peut pas le modifier.",
      de: "Teilt jede Spende 85/15. Der Anteil ist eine Konstante im Code — nicht einmal der Gründer kann ihn ändern.",
    },
    "tr.c2t": { ru: "Кошелёк создателя (15%)", en: "Creator's wallet (15%)", es: "Billetera del creador (15%)", sr: "Novčanik osnivača (15%)", fr: "Portefeuille du créateur (15 %)", de: "Wallet des Gründers (15 %)" },
    "tr.c2p": {
      ru: "Сюда приходит только доля создателя. Все поступления видны публично.",
      en: "Only the creator's share arrives here. Every incoming transfer is public.",
      es: "Aquí solo llega la parte del creador. Todos los ingresos son públicos.",
      sr: "Ovde stiže samo udeo osnivača. Sve uplate su javno vidljive.",
      fr: "Seule la part du créateur arrive ici. Toutes les entrées sont publiques.",
      de: "Hier kommt nur der Anteil des Gründers an. Alle Eingänge sind öffentlich sichtbar.",
    },
    "tr.c3t": { ru: "Получатели не подменяются", en: "Recipients can't be swapped", es: "Los destinatarios no se pueden cambiar", sr: "Primaoci se ne mogu podmetnuti", fr: "Les bénéficiaires ne peuvent pas être remplacés", de: "Empfänger können nicht ausgetauscht werden" },
    "tr.c3p": {
      ru: "Адрес получателя у направления нельзя тихо заменить. Можно только закрыть направление и открыть новое — и это тоже останется в блокчейне.",
      en: "A cause's recipient address can't be quietly replaced. A cause can only be closed and a new one opened — and that stays on the blockchain too.",
      es: "La dirección del destinatario de una causa no se puede sustituir en silencio. Solo se puede cerrar la causa y abrir una nueva, y eso también queda en la blockchain.",
      sr: "Adresa primaoca ne može se tiho zameniti. Oblast se može samo zatvoriti i otvoriti nova — i to takođe ostaje na blokčejnu.",
      fr: "L'adresse du bénéficiaire d'une cause ne peut pas être remplacée en douce. On peut seulement fermer la cause et en ouvrir une nouvelle — et cela reste aussi sur la blockchain.",
      de: "Die Empfängeradresse eines Bereichs kann nicht heimlich ersetzt werden. Man kann ihn nur schließen und einen neuen eröffnen — auch das bleibt auf der Blockchain.",
    },
    "tr.c4t": { ru: "Открытый код", en: "Open source", es: "Código abierto", sr: "Otvoreni kod", fr: "Code ouvert", de: "Offener Code" },
    "tr.c4p": {
      ru: "Исходный код контракта и сайта открыт. Перед запуском с настоящими деньгами контракт пройдёт независимый аудит.",
      en: "The source code of the contract and the website is public. Before launching with real money, the contract will go through an independent audit.",
      es: "El código fuente del contrato y del sitio es público. Antes de funcionar con dinero real, el contrato pasará una auditoría independiente.",
      sr: "Izvorni kod ugovora i sajta je javan. Pre pokretanja sa pravim novcem, ugovor će proći nezavisnu reviziju.",
      fr: "Le code source du contrat et du site est public. Avant le lancement avec de l'argent réel, le contrat passera un audit indépendant.",
      de: "Der Quellcode von Vertrag und Website ist öffentlich. Vor dem Start mit echtem Geld wird der Vertrag unabhängig geprüft.",
    },

    "founder.alt": { ru: "Георгий, основатель Sacred Heart", en: "Georgii, founder of Sacred Heart", es: "Georgii, fundador de Sacred Heart", sr: "Georgij, osnivač Sacred Heart-a", fr: "Gueorgui, fondateur de Sacred Heart", de: "Georgii, Gründer von Sacred Heart" },
    "founder.caption": { ru: "<b>Георгий</b>основатель Sacred Heart", en: "<b>Georgii</b>founder of Sacred Heart", es: "<b>Georgii</b>fundador de Sacred Heart", sr: "<b>Georgij</b>osnivač Sacred Heart-a", fr: "<b>Gueorgui</b>fondateur de Sacred Heart", de: "<b>Georgii</b>Gründer von Sacred Heart" },
    "founder.quote": {
      ru: "«Я знаю, каково это — когда кажется, что выхода нет. Поэтому я создал место, где помощь доходит до тех, кому она нужна».",
      en: "“I know what it's like when it feels like there's no way out. That's why I built a place where help reaches the people who need it.”",
      es: "«Sé lo que es sentir que no hay salida. Por eso creé un lugar donde la ayuda llega a quien la necesita».",
      sr: "„Znam kako je kada se čini da nema izlaza. Zato sam stvorio mesto gde pomoć stiže do onih kojima je potrebna.“",
      fr: "« Je sais ce que c'est quand on a l'impression qu'il n'y a pas d'issue. C'est pourquoi j'ai créé un lieu où l'aide parvient à ceux qui en ont besoin. »",
      de: "„Ich weiß, wie es ist, wenn es scheint, als gäbe es keinen Ausweg. Deshalb habe ich einen Ort geschaffen, an dem Hilfe die erreicht, die sie brauchen.“",
    },
    "founder.p1": {
      ru: "Меня зовут Георгий. Я сам прошёл через зависимость и лечение в клиниках. Я знаю не по рассказам, как тяжело бывает просить о помощи — и как много значит, когда она приходит вовремя.",
      en: "My name is Georgii. I went through addiction and treatment in clinics myself. I know first-hand how hard it can be to ask for help — and how much it means when help comes in time.",
      es: "Me llamo Georgii. Yo mismo pasé por la adicción y por tratamientos en clínicas. Sé de primera mano lo difícil que puede ser pedir ayuda, y lo mucho que significa cuando llega a tiempo.",
      sr: "Zovem se Georgij. I sam sam prošao kroz zavisnost i lečenje u klinikama. Iz prve ruke znam koliko je teško tražiti pomoć — i koliko znači kada ona stigne na vreme.",
      fr: "Je m'appelle Gueorgui. J'ai moi-même traversé l'addiction et des traitements en clinique. Je sais, pour l'avoir vécu, combien il est difficile de demander de l'aide — et combien cela compte quand elle arrive à temps.",
      de: "Ich heiße Georgii. Ich habe selbst eine Sucht und Behandlungen in Kliniken durchgemacht. Ich weiß aus eigener Erfahrung, wie schwer es ist, um Hilfe zu bitten — und wie viel es bedeutet, wenn sie rechtzeitig kommt.",
    },
    "founder.p2": {
      ru: "Я программист, и я видел, как часто пожертвования теряются по дороге или исчезают в непрозрачных отчётах. Поэтому Sacred Heart устроен так, что деньги нельзя увести незаметно: всё делает код, а каждый перевод открыт.",
      en: "I'm a programmer, and I've seen how often donations get lost along the way or vanish into opaque reports. So Sacred Heart is built so that money can't be quietly diverted: the code does the work, and every transfer is public.",
      es: "Soy programador y he visto cuántas veces las donaciones se pierden por el camino o desaparecen en informes opacos. Por eso Sacred Heart está hecho para que el dinero no pueda desviarse sin que se note: todo lo hace el código y cada transferencia es pública.",
      sr: "Programer sam i video sam koliko često se donacije izgube usput ili nestanu u netransparentnim izveštajima. Zato je Sacred Heart napravljen tako da se novac ne može neprimetno preusmeriti: sve radi kod, a svaki transfer je javan.",
      fr: "Je suis programmeur, et j'ai vu combien de dons se perdent en route ou disparaissent dans des rapports opaques. Sacred Heart est donc conçu pour que l'argent ne puisse pas être détourné discrètement : c'est le code qui agit, et chaque transfert est public.",
      de: "Ich bin Programmierer und habe gesehen, wie oft Spenden unterwegs verloren gehen oder in undurchsichtigen Berichten verschwinden. Deshalb ist Sacred Heart so gebaut, dass Geld nicht unbemerkt abgezweigt werden kann: Der Code erledigt alles, und jede Überweisung ist öffentlich.",
    },
    "founder.p3": {
      ru: "Выбраться мне помогли не чудо и не сила воли в одиночку, а люди, которые в нужный момент не прошли мимо. Тогда я понял простую вещь: второй шанс почти никогда не приходит сам. Его кто-то протягивает.",
      en: "What got me out wasn't a miracle or willpower alone — it was people who didn't walk past at the right moment. That's when I understood something simple: a second chance almost never comes on its own. Someone holds it out to you.",
      es: "No salí gracias a un milagro ni solo a la fuerza de voluntad, sino a personas que, en el momento justo, no pasaron de largo. Entonces entendí algo sencillo: una segunda oportunidad casi nunca llega sola. Alguien te la tiende.",
      sr: "Nije me izvuklo čudo niti sama snaga volje, već ljudi koji u pravom trenutku nisu prošli pored mene. Tada sam shvatio jednostavnu stvar: druga šansa skoro nikad ne dolazi sama. Neko vam je pruži.",
      fr: "Ce n'est ni un miracle ni la seule volonté qui m'ont sorti de là, mais des personnes qui, au bon moment, ne sont pas passées à côté. J'ai alors compris une chose simple : une seconde chance ne vient presque jamais seule. Quelqu'un vous la tend.",
      de: "Herausgeholfen hat mir weder ein Wunder noch Willenskraft allein, sondern Menschen, die im richtigen Moment nicht vorbeigegangen sind. Da habe ich etwas Einfaches verstanden: Eine zweite Chance kommt fast nie von selbst. Jemand reicht sie einem.",
    },
    "founder.p4": {
      ru: "Поэтому направлений четыре. Зависимость, потерянные документы в чужой стране, война, болезнь — это разные беды, но в каждой из них человек вдруг остаётся один. Sacred Heart нужен для того, чтобы рядом оказался кто-то ещё.",
      en: "That's why there are four causes. Addiction, lost documents in a foreign country, war, illness — different hardships, but in each of them a person suddenly finds themselves alone. Sacred Heart exists so that someone else is there too.",
      es: "Por eso hay cuatro causas. La adicción, los documentos perdidos en un país extranjero, la guerra, la enfermedad: son desgracias distintas, pero en cada una la persona se queda de repente sola. Sacred Heart existe para que haya alguien más a su lado.",
      sr: "Zato postoje četiri oblasti. Zavisnost, izgubljena dokumenta u stranoj zemlji, rat, bolest — različite nevolje, ali u svakoj od njih čovek odjednom ostaje sam. Sacred Heart postoji da bi pored njega bio još neko.",
      fr: "C'est pourquoi il y a quatre causes. L'addiction, des papiers perdus dans un pays étranger, la guerre, la maladie : des épreuves différentes, mais dans chacune, une personne se retrouve soudain seule. Sacred Heart existe pour que quelqu'un d'autre soit là.",
      de: "Deshalb gibt es vier Bereiche. Sucht, verlorene Papiere im Ausland, Krieg, Krankheit — verschiedene Nöte, aber in jeder steht ein Mensch plötzlich allein da. Sacred Heart ist dafür da, dass noch jemand an seiner Seite ist.",
    },
    "founder.p5": {
      ru: "Я не прячусь за анонимностью: моё лицо, имя и все операции платформы открыты.",
      en: "I don't hide behind anonymity: my face, my name and every operation of the platform are public.",
      es: "No me escondo tras el anonimato: mi cara, mi nombre y todas las operaciones de la plataforma son públicos.",
      sr: "Ne krijem se iza anonimnosti: moje lice, ime i sve operacije platforme su javni.",
      fr: "Je ne me cache pas derrière l'anonymat : mon visage, mon nom et toutes les opérations de la plateforme sont publics.",
      de: "Ich verstecke mich nicht hinter Anonymität: Mein Gesicht, mein Name und alle Vorgänge der Plattform sind öffentlich.",
    },
    "founder.sign": { ru: "Если вы сейчас там, где был я, — вы не одни.", en: "If you're where I once was — you are not alone.", es: "Si ahora estás donde yo estuve, no estás solo.", sr: "Ako ste sada tamo gde sam ja bio — niste sami.", fr: "Si vous êtes là où j'étais — vous n'êtes pas seul.", de: "Wenn Sie gerade dort sind, wo ich war — Sie sind nicht allein." },

    "help.title": { ru: "Если помощь нужна вам", en: "If you need help", es: "Si eres tú quien necesita ayuda", sr: "Ako vama treba pomoć", fr: "Si vous avez besoin d'aide", de: "Wenn Sie Hilfe brauchen" },
    "help.sub": {
      ru: "Мы работаем с фондами, клиниками и напрямую с людьми, оказавшимися в трудной ситуации. Каждую заявку проверяем, чтобы пожертвования доходили до тех, кому они действительно нужны.",
      en: "We work with charities, clinics and directly with people in difficult situations. We check every request so that donations reach those who truly need them.",
      es: "Trabajamos con fundaciones, clínicas y directamente con personas en situaciones difíciles. Revisamos cada solicitud para que las donaciones lleguen a quienes de verdad las necesitan.",
      sr: "Radimo sa fondacijama, klinikama i direktno sa ljudima u teškim situacijama. Proveravamo svaki zahtev kako bi donacije stigle do onih kojima su zaista potrebne.",
      fr: "Nous travaillons avec des associations, des cliniques et directement avec des personnes en difficulté. Nous vérifions chaque demande pour que les dons parviennent à ceux qui en ont vraiment besoin.",
      de: "Wir arbeiten mit Stiftungen, Kliniken und direkt mit Menschen in schwierigen Lagen. Wir prüfen jede Anfrage, damit die Spenden die erreichen, die sie wirklich brauchen.",
    },
    "help.li1": { ru: "Лечение зависимости или помощь психолога и психиатра", en: "Addiction treatment or help from a psychologist or psychiatrist", es: "Tratamiento de adicciones o ayuda de un psicólogo o psiquiatra", sr: "Lečenje zavisnosti ili pomoć psihologa i psihijatra", fr: "Traitement de l'addiction ou aide d'un psychologue ou d'un psychiatre", de: "Suchtbehandlung oder Hilfe durch Psychologen und Psychiater" },
    "help.li2": { ru: "Восстановление документов, если вы застряли за границей", en: "Replacing documents if you're stranded abroad", es: "Recuperar documentos si te has quedado atrapado en el extranjero", sr: "Obnova dokumenata ako ste zaglavili u inostranstvu", fr: "Refaire vos papiers si vous êtes bloqué à l'étranger", de: "Neue Dokumente, wenn Sie im Ausland festsitzen" },
    "help.li3": { ru: "Помощь украинцам, пострадавшим от войны", en: "Help for Ukrainians affected by the war", es: "Ayuda a ucranianos afectados por la guerra", sr: "Pomoć Ukrajincima pogođenim ratom", fr: "Aide aux Ukrainiens touchés par la guerre", de: "Hilfe für vom Krieg betroffene Ukrainer" },
    "help.li4": { ru: "Оплата операции или срочного лечения", en: "Paying for surgery or urgent treatment", es: "Pago de una operación o de un tratamiento urgente", sr: "Plaćanje operacije ili hitnog lečenja", fr: "Financer une opération ou un traitement urgent", de: "Bezahlung einer Operation oder dringenden Behandlung" },
    "help.apply": { ru: "Как подать заявку", en: "How to apply", es: "Cómo solicitar ayuda", sr: "Kako podneti zahtev", fr: "Comment faire une demande", de: "So stellen Sie eine Anfrage" },
    "help.applyp": {
      ru: "Напишите нам: коротко опишите ситуацию и приложите подтверждающие документы — счёт клиники, справку, письмо консульства. Мы ответим и расскажем о следующих шагах.",
      en: "Write to us: briefly describe your situation and attach supporting documents — a clinic invoice, a medical certificate, a letter from the consulate. We'll reply and explain the next steps.",
      es: "Escríbenos: describe brevemente tu situación y adjunta documentos que la acrediten: una factura de la clínica, un certificado, una carta del consulado. Te responderemos y te explicaremos los siguientes pasos.",
      sr: "Pišite nam: ukratko opišite situaciju i priložite dokumenta — račun klinike, potvrdu, pismo konzulata. Odgovorićemo i objasniti sledeće korake.",
      fr: "Écrivez-nous : décrivez brièvement votre situation et joignez des justificatifs — facture de la clinique, certificat, lettre du consulat. Nous vous répondrons et vous expliquerons la suite.",
      de: "Schreiben Sie uns: Beschreiben Sie kurz Ihre Lage und fügen Sie Nachweise bei — Rechnung der Klinik, Bescheinigung, Schreiben des Konsulats. Wir antworten und erklären die nächsten Schritte.",
    },
    "help.privacy": {
      ru: "<b>Ваши личные данные никогда не публикуются.</b> В блокчейне виден только кошелёк получателя, без имени.",
      en: "<b>Your personal data is never published.</b> Only the recipient's wallet is visible on the blockchain, with no name.",
      es: "<b>Tus datos personales nunca se publican.</b> En la blockchain solo se ve la billetera del destinatario, sin nombre.",
      sr: "<b>Vaši lični podaci se nikada ne objavljuju.</b> Na blokčejnu se vidi samo novčanik primaoca, bez imena.",
      fr: "<b>Vos données personnelles ne sont jamais publiées.</b> Sur la blockchain, seul le portefeuille du bénéficiaire est visible, sans nom.",
      de: "<b>Ihre persönlichen Daten werden nie veröffentlicht.</b> Auf der Blockchain ist nur das Wallet des Empfängers sichtbar, ohne Namen.",
    },
    "help.write": { ru: "Написать на georgiihelpii@proton.me", en: "Email georgiihelpii@proton.me", es: "Escribir a georgiihelpii@proton.me", sr: "Pišite na georgiihelpii@proton.me", fr: "Écrire à georgiihelpii@proton.me", de: "E-Mail an georgiihelpii@proton.me" },
    "help.partners": {
      ru: "Фонды и клиники, которые хотят стать партнёрами, тоже пишите нам.",
      en: "Charities and clinics that want to become partners — please write to us too.",
      es: "Fundaciones y clínicas que quieran ser socias: escribidnos también.",
      sr: "Fondacije i klinike koje žele da postanu partneri — takođe nam pišite.",
      fr: "Associations et cliniques souhaitant devenir partenaires : écrivez-nous aussi.",
      de: "Stiftungen und Kliniken, die Partner werden möchten: Schreiben Sie uns ebenfalls.",
    },

    "faq.eyebrow": { ru: "Вопросы", en: "Questions", es: "Preguntas", sr: "Pitanja", fr: "Questions", de: "Fragen" },
    "faq.title": { ru: "Частые вопросы", en: "Frequently asked questions", es: "Preguntas frecuentes", sr: "Česta pitanja", fr: "Questions fréquentes", de: "Häufige Fragen" },
    "faq.q1": { ru: "Почему 15% уходит создателю?", en: "Why does 15% go to the creator?", es: "¿Por qué el 15% va al creador?", sr: "Zašto 15% ide osnivaču?", fr: "Pourquoi 15 % vont-ils au créateur ?", de: "Warum gehen 15 % an den Gründer?" },
    "faq.a1": {
      ru: "Платформу нужно поддерживать, развивать и проверять заявки — это работа на полный день. Вместо скрытых «административных расходов» мы называем долю открыто и фиксируем её в коде. Больше 15% она стать не может.",
      en: "The platform has to be maintained and developed, and requests have to be checked — that's a full-time job. Instead of hidden “administrative costs”, we state the share openly and fix it in the code. It can never exceed 15%.",
      es: "La plataforma hay que mantenerla, desarrollarla y revisar las solicitudes: es un trabajo a tiempo completo. En lugar de «gastos administrativos» ocultos, decimos la parte abiertamente y la fijamos en el código. Nunca puede superar el 15%.",
      sr: "Platformu treba održavati, razvijati i proveravati zahteve — to je posao sa punim radnim vremenom. Umesto skrivenih „administrativnih troškova“, udeo navodimo otvoreno i upisujemo ga u kod. Ne može biti veći od 15%.",
      fr: "La plateforme doit être maintenue, développée, et les demandes vérifiées : c'est un travail à plein temps. Au lieu de « frais administratifs » cachés, nous annonçons la part ouvertement et la fixons dans le code. Elle ne peut jamais dépasser 15 %.",
      de: "Die Plattform muss gepflegt und weiterentwickelt werden, Anfragen müssen geprüft werden — das ist ein Vollzeitjob. Statt versteckter „Verwaltungskosten“ nennen wir den Anteil offen und legen ihn im Code fest. Er kann nie mehr als 15 % betragen.",
    },
    "faq.q2": { ru: "Как убедиться, что деньги дошли?", en: "How can I be sure the money arrived?", es: "¿Cómo sé que el dinero llegó?", sr: "Kako da budem siguran da je novac stigao?", fr: "Comment savoir que l'argent est bien arrivé ?", de: "Wie kann ich sicher sein, dass das Geld angekommen ist?" },
    "faq.a2": {
      ru: "После пожертвования вы получаете ссылку на транзакцию в Solana Explorer. В ней видно два перевода: 85% на кошелёк получателя и 15% на кошелёк создателя. Адрес каждого получателя указан на карточке направления.",
      en: "After donating, you get a link to the transaction in Solana Explorer. It shows two transfers: 85% to the recipient's wallet and 15% to the creator's wallet. Each recipient's address is shown on the cause card.",
      es: "Después de donar recibes un enlace a la transacción en Solana Explorer. En él se ven dos transferencias: el 85% a la billetera del destinatario y el 15% a la del creador. La dirección de cada destinatario aparece en la tarjeta de la causa.",
      sr: "Posle donacije dobijate link ka transakciji u Solana Explorer-u. U njoj se vide dva transfera: 85% na novčanik primaoca i 15% na novčanik osnivača. Adresa svakog primaoca navedena je na kartici oblasti.",
      fr: "Après votre don, vous recevez un lien vers la transaction dans Solana Explorer. On y voit deux transferts : 85 % vers le portefeuille du bénéficiaire et 15 % vers celui du créateur. L'adresse de chaque bénéficiaire figure sur la fiche de la cause.",
      de: "Nach der Spende erhalten Sie einen Link zur Transaktion im Solana Explorer. Dort sehen Sie zwei Überweisungen: 85 % an das Wallet des Empfängers und 15 % an das des Gründers. Die Adresse jedes Empfängers steht auf der Karte des Bereichs.",
    },
    "faq.q3": { ru: "Можно пожертвовать картой, без криптовалюты?", en: "Can I donate by card, without crypto?", es: "¿Puedo donar con tarjeta, sin criptomonedas?", sr: "Mogu li da doniram karticom, bez kriptovalute?", fr: "Puis-je donner par carte, sans crypto ?", de: "Kann ich mit Karte spenden, ohne Krypto?" },
    "faq.a3": {
      ru: "Пока — только через кошелёк Solana (например, Phantom). В Phantom можно купить SOL банковской картой прямо в приложении, а затем пожертвовать.",
      en: "For now, only through a Solana wallet (such as Phantom). In Phantom you can buy SOL with a bank card right in the app and then donate.",
      es: "Por ahora, solo con una billetera de Solana (por ejemplo, Phantom). En Phantom puedes comprar SOL con tarjeta bancaria dentro de la app y luego donar.",
      sr: "Za sada samo preko Solana novčanika (na primer, Phantom). U Phantom-u možete kupiti SOL bankovnom karticom direktno u aplikaciji, a zatim donirati.",
      fr: "Pour l'instant, uniquement via un portefeuille Solana (comme Phantom). Dans Phantom, vous pouvez acheter des SOL par carte bancaire directement dans l'application, puis faire un don.",
      de: "Vorerst nur über ein Solana-Wallet (zum Beispiel Phantom). In Phantom können Sie SOL direkt in der App mit Bankkarte kaufen und dann spenden.",
    },
    "faq.q4": { ru: "Кто получает деньги?", en: "Who receives the money?", es: "¿Quién recibe el dinero?", sr: "Ko dobija novac?", fr: "Qui reçoit l'argent ?", de: "Wer erhält das Geld?" },
    "faq.a4": {
      ru: "Проверенные фонды, клиники и люди, чьи заявки мы проверили. Список партнёров публикуется на сайте по мере подключения.",
      en: "Verified charities, clinics and people whose requests we have checked. The list of partners is published on the site as they join.",
      es: "Fundaciones y clínicas verificadas, y personas cuyas solicitudes hemos revisado. La lista de socios se publica en el sitio a medida que se incorporan.",
      sr: "Proverene fondacije, klinike i ljudi čije smo zahteve proverili. Spisak partnera objavljuje se na sajtu kako se priključuju.",
      fr: "Des associations et cliniques vérifiées, et des personnes dont nous avons vérifié la demande. La liste des partenaires est publiée sur le site au fur et à mesure.",
      de: "Geprüfte Stiftungen, Kliniken und Menschen, deren Anfragen wir geprüft haben. Die Liste der Partner wird auf der Website veröffentlicht, sobald sie dazukommen.",
    },
    "faq.q5": { ru: "Что будет, если сбор закрыт?", en: "What happens when a cause is closed?", es: "¿Qué pasa si una causa se cierra?", sr: "Šta se dešava kada se oblast zatvori?", fr: "Que se passe-t-il quand une cause est fermée ?", de: "Was passiert, wenn ein Bereich geschlossen wird?" },
    "faq.a5": {
      ru: "Закрытое направление перестаёт принимать пожертвования — контракт просто не даст отправить перевод. История сбора остаётся в блокчейне навсегда.",
      en: "A closed cause stops accepting donations — the contract simply won't let a transfer through. Its history stays on the blockchain forever.",
      es: "Una causa cerrada deja de aceptar donaciones: el contrato simplemente no permite enviar la transferencia. Su historial queda en la blockchain para siempre.",
      sr: "Zatvorena oblast prestaje da prima donacije — ugovor jednostavno neće propustiti transfer. Njena istorija zauvek ostaje na blokčejnu.",
      fr: "Une cause fermée n'accepte plus de dons — le contrat refuse tout simplement le transfert. Son historique reste pour toujours sur la blockchain.",
      de: "Ein geschlossener Bereich nimmt keine Spenden mehr an — der Vertrag lässt die Überweisung einfach nicht zu. Seine Geschichte bleibt für immer auf der Blockchain.",
    },

    "foot.tagline": {
      ru: "Прозрачная благотворительность на Solana. Каждое сердце заслуживает второй шанс.",
      en: "Transparent giving on Solana. Every heart deserves a second chance.",
      es: "Solidaridad transparente en Solana. Todo corazón merece una segunda oportunidad.",
      sr: "Transparentna humanitarnost na Solani. Svako srce zaslužuje drugu šansu.",
      fr: "Des dons transparents sur Solana. Chaque cœur mérite une seconde chance.",
      de: "Transparentes Spenden auf Solana. Jedes Herz verdient eine zweite Chance.",
    },
    "foot.sections": { ru: "Разделы", en: "Sections", es: "Secciones", sr: "Odeljci", fr: "Rubriques", de: "Bereiche" },
    "foot.contact": { ru: "Связь", en: "Contact", es: "Contacto", sr: "Kontakt", fr: "Contact", de: "Kontakt" },
    "foot.net": { ru: "Сеть:", en: "Network:", es: "Red:", sr: "Mreža:", fr: "Réseau :", de: "Netzwerk:" },
    "foot.crisis": {
      ru: "<b>Если вам или близкому человеку сейчас угрожает опасность</b> — позвоните в экстренную службу: 112 в Европе (включая Черногорию и Сербию), 911 в США. Sacred Heart — платформа для пожертвований, а не экстренная помощь.",
      en: "<b>If you or someone close to you is in danger right now</b>, call emergency services: 112 in Europe (including Montenegro and Serbia), 911 in the US, or your local emergency number. Sacred Heart is a donation platform, not an emergency service.",
      es: "<b>Si tú o alguien cercano estáis en peligro ahora mismo</b>, llama a emergencias: 112 en Europa, 911 en EE. UU. y en muchos países de América, o al número de emergencias de tu país. Sacred Heart es una plataforma de donaciones, no un servicio de emergencias.",
      sr: "<b>Ako ste vi ili neko blizak trenutno u opasnosti</b>, pozovite hitnu službu: 112 u Evropi (uključujući Crnu Goru i Srbiju), 911 u SAD. Sacred Heart je platforma za donacije, a ne hitna pomoć.",
      fr: "<b>Si vous ou un proche êtes en danger en ce moment</b>, appelez les secours : 112 en Europe, 911 aux États-Unis, ou le numéro d'urgence de votre pays. Sacred Heart est une plateforme de dons, pas un service d'urgence.",
      de: "<b>Wenn Sie oder ein nahestehender Mensch gerade in Gefahr sind</b>, rufen Sie den Notruf: 112 in Europa, 911 in den USA oder die Notrufnummer Ihres Landes. Sacred Heart ist eine Spendenplattform, kein Notdienst.",
    },
    "foot.legal": {
      ru: "Платформа не является финансовым продуктом. Пожертвования не возвращаются.",
      en: "The platform is not a financial product. Donations are non-refundable.",
      es: "La plataforma no es un producto financiero. Las donaciones no son reembolsables.",
      sr: "Platforma nije finansijski proizvod. Donacije se ne vraćaju.",
      fr: "La plateforme n'est pas un produit financier. Les dons ne sont pas remboursables.",
      de: "Die Plattform ist kein Finanzprodukt. Spenden werden nicht erstattet.",
    },

    /* --- строки, которые подставляет скрипт --- */
    "cause.0.tag": { ru: "Зависимости и психическое здоровье", en: "Addiction & mental health", es: "Adicciones y salud mental", sr: "Zavisnosti i mentalno zdravlje", fr: "Addictions et santé mentale", de: "Sucht & psychische Gesundheit" },
    "cause.0.title": { ru: "Лечение зависимостей и психическое здоровье", en: "Addiction treatment and mental health", es: "Tratamiento de adicciones y salud mental", sr: "Lečenje zavisnosti i mentalno zdravlje", fr: "Soigner l'addiction et la santé mentale", de: "Suchtbehandlung und psychische Gesundheit" },
    "cause.0.desc": {
      ru: "Оплата лечения в реабилитационных центрах, консультаций психологов и психиатров, поддержка после выписки — чтобы человек не остался один на пути восстановления.",
      en: "Paying for rehab treatment, sessions with psychologists and psychiatrists, and support after discharge — so no one is left alone on the road to recovery.",
      es: "Pago de tratamientos en centros de rehabilitación, consultas con psicólogos y psiquiatras y apoyo tras el alta, para que nadie se quede solo en el camino de la recuperación.",
      sr: "Plaćanje lečenja u rehabilitacionim centrima, konsultacija sa psiholozima i psihijatrima i podrška posle otpusta — da niko ne ostane sam na putu oporavka.",
      fr: "Financer les cures en centre de réhabilitation, les consultations de psychologues et de psychiatres, et le soutien après la sortie — pour que personne ne reste seul sur le chemin du rétablissement.",
      de: "Bezahlung von Reha-Behandlungen, Sitzungen bei Psychologen und Psychiatern und Unterstützung nach der Entlassung — damit niemand auf dem Weg der Genesung allein bleibt.",
    },
    "cause.1.tag": { ru: "Документы за границей", en: "Documents abroad", es: "Documentos en el extranjero", sr: "Dokumenta u inostranstvu", fr: "Papiers à l'étranger", de: "Dokumente im Ausland" },
    "cause.1.title": { ru: "Восстановление документов за границей", en: "Replacing lost documents abroad", es: "Recuperar documentos en el extranjero", sr: "Obnova dokumenata u inostranstvu", fr: "Refaire ses papiers à l'étranger", de: "Neue Dokumente im Ausland" },
    "cause.1.desc": {
      ru: "Помощь людям, которые потеряли паспорт или документы в чужой стране: консульские сборы, переводы, временное жильё и дорога домой.",
      en: "Help for people who have lost their passport or documents in a foreign country: consular fees, translations, temporary housing and the journey home.",
      es: "Ayuda a personas que han perdido el pasaporte o sus documentos en otro país: tasas consulares, traducciones, alojamiento temporal y el viaje de vuelta a casa.",
      sr: "Pomoć ljudima koji su izgubili pasoš ili dokumenta u stranoj zemlji: konzularne takse, prevodi, privremeni smeštaj i put kući.",
      fr: "Aider les personnes qui ont perdu leur passeport ou leurs papiers dans un pays étranger : frais consulaires, traductions, hébergement temporaire et retour chez elles.",
      de: "Hilfe für Menschen, die im Ausland Pass oder Dokumente verloren haben: Konsulatsgebühren, Übersetzungen, vorübergehende Unterkunft und die Heimreise.",
    },
    "cause.2.tag": { ru: "Помощь украинцам", en: "Help for Ukrainians", es: "Ayuda a Ucrania", sr: "Pomoć Ukrajincima", fr: "Aide aux Ukrainiens", de: "Hilfe für Ukrainer" },
    "cause.2.title": { ru: "Помощь украинцам, пострадавшим от войны", en: "Help for Ukrainians affected by the war", es: "Ayuda a ucranianos afectados por la guerra", sr: "Pomoć Ukrajincima pogođenim ratom", fr: "Aide aux Ukrainiens touchés par la guerre", de: "Hilfe für vom Krieg betroffene Ukrainer" },
    "cause.2.desc": {
      ru: "Поддержка украинцев, пострадавших от войны: жильё, еда, лекарства, восстановление документов и помощь в новом месте.",
      en: "Support for Ukrainians affected by the war: housing, food, medicine, replacing documents and help settling in a new place.",
      es: "Apoyo a ucranianos afectados por la guerra: vivienda, comida, medicinas, recuperación de documentos y ayuda para empezar en un lugar nuevo.",
      sr: "Podrška Ukrajincima pogođenim ratom: smeštaj, hrana, lekovi, obnova dokumenata i pomoć na novom mestu.",
      fr: "Soutenir les Ukrainiens touchés par la guerre : logement, nourriture, médicaments, papiers et aide pour s'installer dans un nouveau lieu.",
      de: "Unterstützung für vom Krieg betroffene Ukrainer: Unterkunft, Essen, Medikamente, neue Dokumente und Hilfe beim Ankommen an einem neuen Ort.",
    },
    "cause.3.tag": { ru: "Операции", en: "Surgery", es: "Operaciones", sr: "Operacije", fr: "Opérations", de: "Operationen" },
    "cause.3.title": { ru: "Сборы на операции", en: "Funding surgeries", es: "Financiar operaciones", sr: "Prikupljanje za operacije", fr: "Financer des opérations", de: "Spenden für Operationen" },
    "cause.3.desc": {
      ru: "Сборы на операции и срочное лечение для тех, кто не может оплатить их сам. Деньги идут напрямую клиникам и проверенным получателям.",
      en: "Funding surgery and urgent treatment for those who can't pay for it themselves. The money goes directly to clinics and verified recipients.",
      es: "Recaudación para operaciones y tratamientos urgentes de quienes no pueden pagarlos. El dinero va directamente a clínicas y destinatarios verificados.",
      sr: "Prikupljanje za operacije i hitno lečenje onih koji ne mogu sami da ih plate. Novac ide direktno klinikama i proverenim primaocima.",
      fr: "Financer des opérations et des soins urgents pour ceux qui ne peuvent pas les payer. L'argent va directement aux cliniques et aux bénéficiaires vérifiés.",
      de: "Spenden für Operationen und dringende Behandlungen für Menschen, die sie nicht selbst bezahlen können. Das Geld geht direkt an Kliniken und geprüfte Empfänger.",
    },

    "ui.closed": { ru: "сбор закрыт", en: "closed", es: "cerrada", sr: "zatvoreno", fr: "fermée", de: "geschlossen" },
    "ui.quick": { ru: "Быстрый выбор суммы", en: "Quick amount", es: "Cantidad rápida", sr: "Brzi izbor iznosa", fr: "Montant rapide", de: "Schnellauswahl" },
    "ui.amount": { ru: "Сумма в SOL", en: "Amount in SOL", es: "Cantidad en SOL", sr: "Iznos u SOL", fr: "Montant en SOL", de: "Betrag in SOL" },
    "ui.give": { ru: "Помочь", en: "Donate", es: "Donar", sr: "Doniraj", fr: "Donner", de: "Spenden" },
    "ui.confirm": { ru: "Подтвердите…", en: "Confirm…", es: "Confirma…", sr: "Potvrdite…", fr: "Confirmez…", de: "Bestätigen…" },
    "ui.sending": { ru: "Отправка…", en: "Sending…", es: "Enviando…", sr: "Slanje…", fr: "Envoi…", de: "Wird gesendet…" },
    "ui.sent": { ru: "Передано", en: "Delivered", es: "Entregado", sr: "Predato", fr: "Versé", de: "Übergeben" },
    "ui.donations": { ru: "Пожертвований", en: "Donations", es: "Donaciones", sr: "Donacija", fr: "Dons", de: "Spenden" },
    "ui.recipient": { ru: "Получатель", en: "Recipient", es: "Destinatario", sr: "Primalac", fr: "Bénéficiaire", de: "Empfänger" },
    "ui.loading": { ru: "загрузка…", en: "loading…", es: "cargando…", sr: "učitavanje…", fr: "chargement…", de: "wird geladen…" },
    "ui.notDeployed": { ru: "Контракт ещё не запущен в этой сети.", en: "The contract is not deployed on this network yet.", es: "El contrato aún no está desplegado en esta red.", sr: "Ugovor još nije pokrenut na ovoj mreži.", fr: "Le contrat n'est pas encore déployé sur ce réseau.", de: "Der Vertrag ist in diesem Netzwerk noch nicht aktiv." },
    "ui.noCauses": { ru: "Направлений пока нет.", en: "No causes yet.", es: "Todavía no hay causas.", sr: "Još nema oblasti pomoći.", fr: "Aucune cause pour l'instant.", de: "Noch keine Bereiche." },
    "ui.loadFail": { ru: "Не удалось загрузить данные из блокчейна. Обновите страницу.", en: "Couldn't load data from the blockchain. Please refresh the page.", es: "No se pudieron cargar los datos de la blockchain. Actualiza la página.", sr: "Podaci sa blokčejna nisu učitani. Osvežite stranicu.", fr: "Impossible de charger les données de la blockchain. Actualisez la page.", de: "Daten aus der Blockchain konnten nicht geladen werden. Bitte Seite neu laden." },
    "ui.min": { ru: "Укажите сумму — минимум 0.001 SOL.", en: "Enter an amount — at least 0.001 SOL.", es: "Indica una cantidad: mínimo 0.001 SOL.", sr: "Unesite iznos — najmanje 0.001 SOL.", fr: "Indiquez un montant — au moins 0.001 SOL.", de: "Betrag eingeben — mindestens 0.001 SOL." },
    "ui.thanks": { ru: "Спасибо! Ваше пожертвование дошло.", en: "Thank you! Your donation has arrived.", es: "¡Gracias! Tu donación ha llegado.", sr: "Hvala! Vaša donacija je stigla.", fr: "Merci ! Votre don est bien arrivé.", de: "Danke! Ihre Spende ist angekommen." },
    "ui.viewTx": { ru: "Посмотреть в блокчейне", en: "View on the blockchain", es: "Ver en la blockchain", sr: "Pogledaj na blokčejnu", fr: "Voir sur la blockchain", de: "Auf der Blockchain ansehen" },
    "ui.cancelled": { ru: "Перевод отменён.", en: "Transfer cancelled.", es: "Transferencia cancelada.", sr: "Transfer je otkazan.", fr: "Transfert annulé.", de: "Überweisung abgebrochen." },
    "ui.insufficient": { ru: "Недостаточно SOL на кошельке.", en: "Not enough SOL in your wallet.", es: "No hay suficiente SOL en tu billetera.", sr: "Nema dovoljno SOL-a u novčaniku.", fr: "Pas assez de SOL dans votre portefeuille.", de: "Nicht genug SOL im Wallet." },
    "ui.failed": { ru: "Не получилось отправить:", en: "Couldn't send:", es: "No se pudo enviar:", sr: "Slanje nije uspelo:", fr: "Échec de l'envoi :", de: "Senden fehlgeschlagen:" },
    "ui.installPhantom": {
      ru: 'Чтобы помочь, установите кошелёк <a href="https://phantom.com/download" target="_blank" rel="noopener">Phantom</a> и обновите страницу.',
      en: 'To donate, install the <a href="https://phantom.com/download" target="_blank" rel="noopener">Phantom</a> wallet and refresh the page.',
      es: 'Para donar, instala la billetera <a href="https://phantom.com/download" target="_blank" rel="noopener">Phantom</a> y actualiza la página.',
      sr: 'Da biste donirali, instalirajte <a href="https://phantom.com/download" target="_blank" rel="noopener">Phantom</a> novčanik i osvežite stranicu.',
      fr: 'Pour faire un don, installez le portefeuille <a href="https://phantom.com/download" target="_blank" rel="noopener">Phantom</a> puis actualisez la page.',
      de: 'Um zu spenden, installieren Sie das <a href="https://phantom.com/download" target="_blank" rel="noopener">Phantom</a>-Wallet und laden Sie die Seite neu.',
    },
  };

  const LOCALE = { ru: "ru-RU", en: "en-US", es: "es-ES", sr: "sr-Latn-RS", fr: "fr-FR", de: "de-DE" };
  const codes = LANGS.map((l) => l.code);

  function detect() {
    try {
      const q = new URLSearchParams(location.search).get("lang");
      if (q && codes.includes(q)) return q;
    } catch (e) {}
    try {
      const s = localStorage.getItem("sh-lang");
      if (s && codes.includes(s)) return s;
    } catch (e) {}
    const prefs = navigator.languages || [navigator.language || "en"];
    for (const p of prefs) {
      const base = String(p).toLowerCase().split("-")[0];
      if (codes.includes(base)) return base;
      if (["hr", "bs", "cnr", "sh"].includes(base)) return "sr"; // хорватский, боснийский, черногорский
      if (["uk", "be", "kk"].includes(base)) return "ru";
    }
    return "en";
  }

  let lang = detect();
  const listeners = [];

  function t(key) {
    const e = T[key];
    if (!e) return key;
    return e[lang] ?? e.en ?? e.ru ?? key;
  }

  function apply() {
    document.documentElement.lang = lang === "sr" ? "sr-Latn" : lang;
    document.title = t("meta.title");
    const md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute("content", t("meta.desc"));
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => el.setAttribute("alt", t(el.dataset.i18nAlt)));
    const sel = document.getElementById("langSel");
    if (sel) sel.value = lang;
    listeners.forEach((fn) => { try { fn(lang); } catch (e) { console.error(e); } });
  }

  function setLang(code) {
    if (!codes.includes(code)) return;
    lang = code;
    try { localStorage.setItem("sh-lang", code); } catch (e) {}
    apply();
  }

  window.SH_I18N = {
    t, setLang, apply, LANGS,
    get lang() { return lang; },
    get locale() { return LOCALE[lang]; },
    onChange(fn) { listeners.push(fn); },
  };

  function init() {
    const sel = document.getElementById("langSel");
    if (sel) {
      sel.innerHTML = LANGS.map((l) => `<option value="${l.code}">${l.name}</option>`).join("");
      sel.addEventListener("change", () => setLang(sel.value));
    }
    apply();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

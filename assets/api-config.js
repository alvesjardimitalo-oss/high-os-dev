// Endereço do bot High OS no PC (opcional desde a V17).
// Os dados do painel moram no Firestore; o bot, quando ligado, ainda
// fornece métricas da Paradise, a agenda do diário e a cópia do anúncio
// de facção livre. Com o PC desligado o painel funciona normalmente.
window.HIGH_OS_API_URL = 'https://desktop-a2oor0c.taile5cb57.ts.net';
// Onde o painel lê e grava: 'auto' (segue o marcador highos/fonte_dados,
// gravado por tools/migrar-bot-firestore.html), 'firestore' ou 'bot'.
window.HIGH_OS_FONTE = 'auto';

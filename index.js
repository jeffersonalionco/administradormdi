const wa = require('@open-wa/wa-automate');
const msgHandler = require('./msgHandler')
const fs = require('fs-extra')
const data = new Date()
const horaAtual = `${data.getHours()}:${data.getMinutes()}`











const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5562533378:AAErIn2uilKLLZ8oE7bPV_Zo20EaHmd0od8';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
  console.log(msg)
});













wa.create({
  sessionId: "COVID_HELPER",
  multiDevice: true, //required to enable multiDevice support
  authTimeout: 60, //wait only 60 seconds to get a connection with the host account device
  blockCrashLogs: true,
  disableSpins: true,
  headless: true,
  hostNotificationLang: 'PT_BR',
  logConsole: false,
  popup: true,
  qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
}).then(client => start(client));

function start(client, bot) {


  client.onIncomingCall(async (callData) => {
    await client.sendText(callData.peerJid, 'Este numero é apenas para moderação dos Chats MDI.\n\nNão aceita Ligações -bot')
    .then(async () => {
        // bot akan memblock nomor itu
       //** */ await client.contactBlock(callData.peerJid)
    })
})

    client.onGlobalParticipantsChanged(async (event, message) => {
        console.log(event)
        const host = await client.getHostNumber() + '@c.us'

        if (event.action === 'add' && event.who !== host) {
            client.sendText(event.chat, `[ATT] - _Novo Membro no grupo_ \n\n Bem vindo(a) *!! @${event.who.replace('@c.us','')}* \n\n*Hora Atual:* ${horaAtual}`)
        }
        if (event.action === 'remove' && event.who !== host) {
            client.sendText(event.chat, `[ATT] - O _Ex-Membro_ *!! @${event.who.replace('@c.us','')}*, Saiu do grupo! \n\n*Hora Atual:* ${horaAtual}`)
        }
        if (event.action === 'promote' && event.who !== host) {
            client.sendText(event.chat, `*[ATT]* - Este usuario foi Promovido(a) *!! @${event.who.replace('@c.us','')}* \n\n*Hora Atual:* ${horaAtual}`)
        }
        if (event.action === 'demote' && event.who !== host) {
            client.sendText(event.chat, `*[ATT]* - Este Usuario perdeu algumas permissões *!! @${event.who.replace('@c.us','')}* \n\n*Hora Atual:* ${horaAtual}`)
        }
    })


  client.onMessage(async message => {
    msgHandler(client, message, horaAtual)
   

    let msg = message.body
    if (msg.toLowerCase() === 'bot') {
      await client.sendText(message.from, '👋 Hello!');
    }
  });
}

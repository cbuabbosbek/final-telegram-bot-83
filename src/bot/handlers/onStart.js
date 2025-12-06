import { bot } from "../bot.js";

function onStart(msg) {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;

  bot.sendMessage(chatId, `Assalomu aleykum, ${firstname}`);
}

export default onStart;

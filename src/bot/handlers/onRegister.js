import User from "../../models/User.js";
import { bot } from "../bot.js";

async function onRegister(msg) {
  const chatId = msg.chat.id;

  let user = await User.findOne({ chatId });

  if (!user) return;

  user = await User.findOneAndUpdate({ chatId }, { action: "awaiting_name" });

  return bot.sendMessage(chatId, `Ismingiz kiriting`);
}

export default onRegister;

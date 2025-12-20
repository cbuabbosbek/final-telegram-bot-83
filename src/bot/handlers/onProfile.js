import User from "../../models/User.js";
import { bot } from "../bot.js";

async function onProfile(msg) {
  const chatId = msg.chat.id;

  let user = await User.findOne({ chatId });

  if (!user) return;

  user = await User.findOneAndUpdate({ chatId }, { action: "profile" });

  bot.sendMessage(
    chatId,
    `
  SHAXSIY PROFIL:

- CHAT-ID: ???
- ISMI: ????
- USERNAME: ????
- ACTIVE: ???
- BALANCE: ???  
`
  );
}

export default onProfile;

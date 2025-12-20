import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import onStart from "./handlers/onStart.js";
import onProfile from "./handlers/onProfile.js";
import onError from "./handlers/onError.js";
import onCourses from "./handlers/onCourses.js";
import User from "../models/User.js";
import onRegister from "./handlers/onRegister.js";
config();

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const CHANNEL_ID = "@academy_100x_uz";
// check if user is subscribed to channel
const checkIfUserSubscribed = async (chatId) => {
  try {
    const chatMember = await bot.getChatMember(CHANNEL_ID, chatId);
    console.log(chatMember.status);

    if (chatMember.status == "left" || chatMember.status == "kicked") {
      return false;
    } else {
      return true;
    }
  } catch {
    console.log("error: chatMember checking");
  }
};

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;
  const text = msg.text;

  let user = await User.findOne({ chatId });

  // status
  // creator - yaratuvchi
  // member - a'zo
  // admin - adminstrator
  // left - tark etgan
  // kicked - chiqarib yuborilgan

  const user_subscribed = await checkIfUserSubscribed(chatId);

  console.log(user_subscribed);

  if (user_subscribed == false) {
    return bot.sendMessage(
      chatId,
      `Hurmatli ${firstname}, \nSiz botimizdan foydalanishingiz uchun oldin quyidagi kanalga obuna bo'lishing garak... 👇`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `100x Academy Xiva`,
                url: "https://t.me/academy_100x_uz",
              },
            ],
            [
              {
                text: `Obunani tekshirish ✅`,
                callback_data: "confirm_subscribtion",
              },
            ],
          ],
        },
      }
    );
  }

  if (text == "/start") {
    return onStart(msg);
  }

  if (text == "/profile") {
    return onProfile(msg);
  }

  if (text == "📚 Kurslar") {
    return onCourses(msg);
  }

  if (text == "✍️ Ro‘yxatdan o‘tish") {
    return onRegister(msg);
  }

  if (user.action == "awaiting_name") {
    user = await User.findOneAndUpdate(
      { chatId },
      {
        name: text,
        action: "awaiting_phone",
      }
    );

    return bot.sendMessage(chatId, `Telefon Raqamizni kiriting`);
  }

  if (user.action == "awaiting_phone") {
    user = await User.findOneAndUpdate(
      { chatId },
      {
        phone: text,
        action: "finish_registration",
      }
    );


    bot.sendMessage(chatId, `Tabriklaymiz, siz ro'yhatdan o'tdingiz 🎉`)

    return bot.sendMessage(875072364, `🔔 Yangi Xabar:\n🔘FIO; ${user.name}\n🔘Telefon: ${text}`)


  }
  
  
  return onError(msg);
});

bot.on("callback_query", async (query) => {
  const msg = query.message;
  const data = query.data;
  const queryId = query.id;

  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;

  if (data == "confirm_subscribtion") {
    let user = await User.findOne({ chatId });

    if (!user) return;

    user = await User.findOneAndUpdate(
      { chatId },
      { action: "confirm_subscribtion" }
    );

    console.log("TUGMA BOSILDIII");
    const user_subscribed = await checkIfUserSubscribed(chatId);

    if (user_subscribed == false) {
      return bot.answerCallbackQuery(queryId, {
        text: "Siz hali obuna bo'lmadingiz... ❌",
      });
    } else {
      bot.deleteMessage(chatId, msg.message_id);
      return onStart(msg);
    }
  }

  if (data == "course_english") {
    let user = await User.findOne({ chatId });

    if (!user) return;

    user = await User.findOneAndUpdate(
      { chatId },
      { action: "course_english" }
    );

    bot.sendMessage(chatId, `Enlish course is selected`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: `Ro'yhatdan o'tish`, callback_data: "register:english" }],
        ],
      },
    });

    bot.deleteMessage(chatId, msg.message_id);
  }
});

console.log("Bot ishga tushdi...");

// export { bot };

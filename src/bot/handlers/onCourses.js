import { bot } from "../bot.js";

function onCourses(msg) {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `
      🎓 Bizning o‘quv markazimizda quyidagi kurslar mavjud:
    
    1️⃣ Ingliz tili  
    2️⃣ Rus tili  
    3️⃣ Matematika  
    4️⃣ Dasturlash (Python, Web)  
    5️⃣ Grafik dizayn  
    
    👇 Quyidagi kurslardan birini tanlang va batafsil ma’lumot oling:
    
      `,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🇬🇧 Ingliz tili", callback_data: "course_english" }],
          [{ text: "🇷🇺 Rus tili", callback_data: "course_russian" }],
          [{ text: "🧮 Matematika", callback_data: "course_math" }],
          [{ text: "💻 Dasturlash", callback_data: "course_programming" }],
          [{ text: "🎨 Grafik dizayn", callback_data: "course_design" }],
        ],
      },
    }
  );
}

export default onCourses;

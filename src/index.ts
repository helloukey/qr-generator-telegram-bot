import dotenv from "dotenv";
dotenv.config();
import { Telegraf } from "telegraf";

const TOKEN = process.env.TOKEN!;
const bot = new Telegraf(TOKEN);

// Help message
const message = `
<b>Welcome To QR-Generator 😎</b>

/start : To start the bot
/generate (text) : To generate QR
/help : To enter help menu
`;

// Empty generate
const empty = `
<b>☹ Error:</b> Text is empty!
`;

// Empty Text and Size
let text: string = "";
let size: string = "";

// start command
bot.start((ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, message, {
    parse_mode: "HTML",
  });
});

// help command
bot.command("help", (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, message, {
    parse_mode: "HTML",
  });
});

// generate command
bot.command("generate", (ctx) => {
  let texts = ctx.message.text.split(" ");
  if (texts.length < 2) {
    ctx.telegram.sendMessage(ctx.chat.id, empty, {
      parse_mode: "HTML"
    });
  } else {
    texts.shift();
    text = texts.join(" ");
    ctx.telegram.sendMessage(ctx.chat.id, "Please select the image size.", {
      reply_markup: {
        inline_keyboard: [
          [
            {text: "100x100", callback_data: "100x100"},
            {text: "250x250", callback_data: "250x250"}
          ],
          [
            {text: "500x500", callback_data: "500x500"},
            {text: "1000x1000", callback_data: "1000x1000"}
          ]
        ]
      }
    })
  }
});

// Bot action
const actionList = ["100x100", "250x250", "500x500", "1000x1000"];
bot.action(actionList, ctx => {
  ctx.deleteMessage();
  size = ctx.match["input"];
  ctx.replyWithPhoto(`http://api.qrserver.com/v1/create-qr-code/?data=${text}&size=${size}`, {
    caption: "Congratulations! You've got your QR 😍"
  })
})

// Launch bot
bot.launch();

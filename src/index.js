require("dotenv/config");
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require("node-telegram-bot-api");
const logger = require("js-logger");
const { v4 } = require("uuid");

logger.useDefaults();

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, { polling: true });

const baseUrl =
  "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=";

bot.onText(/\/generate (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  logger.info(`Generate new qr code ${resp}...`);

  bot.sendPhoto(chatId, baseUrl + resp);
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  logger.info(`Starting new convrsation...`);

  bot.sendMessage(
    chatId,
    "Para começar envie /generate com a url, numero ou o que deseja codificar, como por exemplo: /generate https://google.com.br"
  );
});

bot.on("inline_query", ({ query, id }) => {
  const url = baseUrl + query;
  const result = [{ type: "photo", id: v4(), photo_url: url, thumb_url: url }];

  logger.info(`Inline query for text ${query}...`);

  bot.answerInlineQuery(id, result);
});

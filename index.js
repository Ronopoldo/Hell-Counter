const TelegramBot = require('node-telegram-bot-api')

const token = '5468851871:AAE9lBfufLXb7LnjeQAIR6b3eYTXc1fqiOo'

const bot = new TelegramBot(token, { polling: true })


console.log('READY')





bot.onText(/\/echo (.+)/, (msg, match) => {

	const chatId = msg.chat.id
	const resp = match[1]
	bot.sendMessage(chatId, resp)
})


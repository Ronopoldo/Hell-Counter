const TelegramBot = require('node-telegram-bot-api');
const { format } = require('path');
const { start } = require('repl');

const token = ''

const bot = new TelegramBot(token, { polling: true })


console.log('READY')
let holidays = ['2022-07-11'];
let holidaysCount = 0
    let startDate = new Date();
    console.log(startDate)
    let endDate = new Date('07/13/2022');
    let numOfDates = getBusinessDatesCount(startDate, endDate);
    


function getBusinessDatesCount(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        let formattedDate = curDate.toISOString().slice(0,10)
        console.log(formattedDate)
        // console.log()
        if (holidays.includes(formattedDate))
        {
            console.log('t')
            holidaysCount = holidaysCount + 1
        }
        if(dayOfWeek !== 0 && dayOfWeek !== 6) count++;
        curDate.setDate(curDate.getDate() + 1);
        
    }
    console.log(count - holidaysCount);
    return count;
}


bot.onText(/\/echo (.+)/, (msg, match) => {

	const chatId = msg.chat.id
	const resp = match[1]
	bot.sendMessage(chatId, resp)
})


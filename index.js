const TelegramBot = require('node-telegram-bot-api');
const { format } = require('path');
const { start } = require('repl');

const token = '5468851871:AAHTmWbryFXtMogAIqecx2znizfRBNQOztM'

const bot = new TelegramBot(token, { polling: true })


console.log('READY')
let holidays = ['2022-03-09'];
let holidaysCount = 0

    


function getBusinessDatesCount(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        let formattedDate = curDate.toISOString().slice(0,10)
        // console.log(formattedDate)
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


function getDatesCount(startDate, endDate)
{
	let difference = endDate.getTime() - startDate.getTime();
	let days = Math.ceil(difference / (1000 * 3600 * 24));
	console.log(days + ' обычных дней');
	return days;
}

function getDatesBeforeHolidays(startDate)
{
	return holidays[0] < startDate
}


bot.on('message', function (msg) {
    var chatId = msg.chat.id; // Берем ID чата (не отправителя)
	let startDate = new Date();
    console.log(startDate)
    let endDate = new Date('09/13/2023');
    bot.sendMessage(chatId, getBusinessDatesCount(startDate, endDate) + ' = ' + getDatesCount(startDate, endDate) + '-=' + getDatesBeforeHolidays(startDate));
});
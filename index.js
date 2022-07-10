const TelegramBot = require('node-telegram-bot-api');
const { format } = require('path');
const { start } = require('repl');
const fs = require('fs')

const token = '5468851871:AAHTmWbryFXtMogAIqecx2znizfRBNQOztM'

const bot = new TelegramBot(token, { polling: true })


console.log('READY')
// let holidays = ['2022-07-09'];
function holidaysService()
{
let holidaysCount = 0
let holidaysNotFormatted = JSON.parse(fs.readFileSync('holidays.json'))
console.log(holidaysNotFormatted)
let holidays = []
let reasons = []
let counter = 0

while (counter < holidaysNotFormatted.days.length)
{
	console.log('123')
	reasons[counter] = holidaysNotFormatted.days[counter][1]
	holidays[counter] = holidaysNotFormatted.days[counter][0]
	counter = counter + 1
}


console.log(holidays)
console.log(reasons)
return [holidays, reasons, holidaysCount]

}


function getBusinessDatesCount(startDate, endDate) {
    let holidays = holidaysService()[0]
    let holidaysCount = holidaysService()[2]
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
    let holidays = holidaysService()[0]
	let counter2 = 0
	let looper = true
	while (looper == true)
	{
		looper = new Date(holidays[counter2]) < startDate
		counter2 = counter2 + 1
		console.log('LOOPER' + looper)
	}

    console.log('before - ' + counter2 - 1)
	let BHDays = getDatesCount(startDate, new Date(holidays[counter2-1]))
	let BHBuisnessDays = getBusinessDatesCount(startDate, new Date(holidays[counter2-1]))
	return [BHDays, BHBuisnessDays]
}


bot.on('message', function (msg) {
    var chatId = msg.chat.id; // Берем ID чата (не отправителя)
	let startDate = new Date();
    console.log(startDate)
    let endDate = new Date('09/13/2023');
    bot.sendMessage(chatId, getBusinessDatesCount(startDate, endDate) + ' = ' + getDatesCount(startDate, endDate) + '-=' + getDatesBeforeHolidays(startDate));
});
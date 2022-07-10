const TelegramBot = require('node-telegram-bot-api');
const { format } = require('path');
const { start } = require('repl');
const fs = require('fs');
const { includes } = require('lodash');

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


// console.log(holidays)
// console.log(reasons)
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
    console.log('OTDIX' + holidaysCount)
    console.log(count - holidaysCount);
    return count - holidaysCount;
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

function getAfterworks()
{
    let counter3 = 0
    let awNotFormated = JSON.parse(fs.readFileSync('afterworks.json'))
    let aw = awNotFormated.days
    let amountOfAW = 0
    
    while (counter3 < aw.length)
    {
        if (new Date(aw[counter3]) > new Date())
        {
            amountOfAW = amountOfAW + 1
        }
        counter3 = counter3 + 1
    }
    return amountOfAW;
}


bot.on('message', function (msg) {
    var chatId = msg.chat.id; // Берем ID чата (не отправителя)
	let startDate = new Date();
    console.log(startDate)
    let endDate = new Date('09/13/2023');
    bot.sendMessage('925304597', getBusinessDatesCount(startDate, endDate) + ' = ' + getDatesCount(startDate, endDate) + '-=' + getDatesBeforeHolidays(startDate));
});

setInterval(function(){
	let startDate = new Date();
    console.log(startDate)
    let endDate = new Date('09/13/2023');
    let formattedDate2 = startDate.toISOString().slice(0,10)
    if ((startDate.getHours() == 0) && (startDate.getDay() !== 6)  && (startDate.getDay() !== 0) && (holidaysService()[0].includes(formattedDate2) == false)) // && (startDate.getMinutes() == 0)
    {
        console.log('E')
        let month = startDate.getMonth()
        let date = startDate.getDate()
        let weekday = startDate.getDay()

        let weekFormat = 'пн'
        switch(weekday)
     {
        case 0: weekFormat = 'воскресенье'
        break;
        case 1: weekFormat = 'понедельник'
        break;
        case 2: weekFormat = 'вторник'
        break;
        case 3: weekFormat = 'среда'
        break;
        case 4: weekFormat = 'четверг'
        break;
        case 5: weekFormat = 'пятница'
        break;
        case 6: weekFormat = 'суббота'
        break;
    }

        let monthFormat = 'июля'
        switch(month) {
        case 0: monthFormat = " января"
        break
        case 1: monthFormat = " февраля"
        break;
        case 2: monthFormat = " марта"
        break;
        case 3: monthFormat = " апреля"
        break;
        case 4: monthFormat = " мая"
        break;
        case 5: monthFormat = " июня"
        break;
        case 6: monthFormat = " июля"
        break;
        case 7: monthFormat = " августа"
        break;
        case 8: monthFormat = " сентября"
        break;
        case 9: monthFormat = " октября"
        break;
        case 10: monthFormat = " ноября"
        break;
        case 11: monthFormat = " декабря"
        break;
        
    }

    let normalDays =  getDatesCount(startDate, endDate) 
    let buisnessdays = getBusinessDatesCount(startDate, endDate)
    let daysToHolidays =  getDatesBeforeHolidays(startDate)
    let passedDays = getBusinessDatesCount(new Date('2021-12-13'), startDate)
    let percentage = (passedDays/417*100).toFixed(2)
    let service = holidaysService()
    bot.sendMessage('925304597', date + monthFormat + ' - ' + weekFormat + '. День ' + passedDays + ' ( ' + percentage + '% )\n\n≫Основное\nОсталось дней: ' + normalDays + '\nИз них рабочих: ' + buisnessdays + '\nС учётом доп. работы:' + (getAfterworks()+buisnessdays) + '\n\n≫Праздники и отпуск\nСледующее событие: ' + service[1][service[2]] + ' (' + service[0][service[2]] + ')\nОсталось дней:' + daysToHolidays[0] + '\nИз них рабочих: ' + daysToHolidays[1]);
}

  }, 5000);

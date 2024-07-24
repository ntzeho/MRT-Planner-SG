const {timings, SBS_LINES} = require('../constants/timings.js')
const {genericPublicHolidays, publicHolidays, dayDict} = require('../constants/publicHolidays.js')

function getCategories(stationsDictKey, type = 'Last') {
    /*
    stationsDictKey - 'sbs_times', 'smrt_times'
    type - 'Firts', 'Last'
    */
    const stns = Object.keys(timings)
    let relevantTimings = []
    for (const stn of stns) {
        const timing = timings[stn][stationsDictKey]
        const timingKeys = Object.keys(timing)
        for (const timingKey of timingKeys) {
            const headers = timing[timingKey]
            const headerKeys = Object.keys(headers)
            for (const headerKey of headerKeys) {
                if (headerKey.includes(type) && !relevantTimings.includes(headerKey)) relevantTimings.push(headerKey)
            }
        }
    }
    return relevantTimings
}

const categoriesNEL = getCategories('sbs_times')
const categoriesSMRT = getCategories('smrt_times')

/*
[
  'Last Trains',
  'Last Trains | Weekdays',
  'Last Trains | Weekends/Public Holidays'
]
[
  'Last Train | Monday - Thursday',
  'Last Train | Friday',
  'Last Train | Saturday',
  'Last Train | Sunday',
  'Last Train | Public Holidays',
  'Last Train | Sundays'
]
*/

// console.log(categoriesNEL)
// console.log(categoriesSMRT)

function dayChecker(type) {
    /* 
    type - 'smrt_times' or 'sbs_times'
    returns array of all possible entries for timings
    */
    const categories = type === 'smrt_times' ? categoriesSMRT : categoriesNEL

    //obtain today's day (1 to 7) based on time when checking for last train
    const now = new Date()
    //const now = new Date("July 27, 2024 11:13:00")
    //console.log(now)
    const yesterday = new Date(Date.now() - 86400000) //24 * 60 * 60 * 1000

    const hour = now.getHours()

    // go to day before if its past midnight
    const date = hour < 3 ? yesterday : now 

    const dayOfWeek = date.getDay()
    //const dayOfWeek = 6
    const year = date.getFullYear()
    const month = date.getMonth() + 1 //returns 0 to 11 so add 1
    const day = date.getDate()
    
    const formatDay = day < 10 ? ('0' + day.toString()) : day.toString()
    const formatMonth = month < 10 ? ('0' + month.toString()) : month.toString()
    const formatDate = formatDay + '/' + formatMonth
    // const formatDate = '28/07'
    const formatDateYear = formatDate + '/' + year.toString()

    const isPubHol = (genericPublicHolidays.includes(formatDate) | publicHolidays.includes(formatDateYear))

    if (isPubHol) { //return key immediately if day is public holiday
        for (const key of categories) {
            if (key.includes('Public Holiday')) return [key]
        }
    }

    let relevantEntries = []

    for (const cat of categories) {
        if (!cat.includes('|')) {
            relevantEntries.push(cat) //only 1 timing regardless of day
        } else if (cat.includes('-')) { //has range of applicable days
            const [startDay, endDay] = cat.split(' | ')[1].split(' - ')
            const [startDayNo, endDayNo] = [dayDict[startDay], dayDict[endDay]]
            if (startDayNo <= dayOfWeek && dayOfWeek <= endDayNo) {
                relevantEntries.push(cat) //dayOfWeek must be in range
            }
        } else {
            const dayNo = dayDict[cat.split(' | ')[1].trim()]
            if (dayOfWeek === dayNo) relevantEntries.push(cat) //single day

            //'weekday' or 'weekend', multiple possible days
            else if (dayNo.length >= 2) if (dayNo.includes(dayOfWeek)) relevantEntries.push(cat)
        }
    }

    return relevantEntries
}


module.exports = {
    dayChecker
}
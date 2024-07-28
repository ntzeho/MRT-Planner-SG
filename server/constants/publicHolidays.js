const genericPublicHolidays = ['01/01', '01/05', '09/08', '25/12']
const publicHolidays = ['31/10/2024']

const dayDict = {
    'Monday': 1,
    'Mondays': 1,
    'Tuesday': 2,
    'Tuesdays': 2,
    'Wednesday': 3,
    'Wednesdays': 3,
    'Thursday': 4,
    'Thursdays': 4,
    'Friday': 5,
    'Fridays': 5,
    'Saturday': 6,
    'Saturdays': 6,
    'Sunday': 0,
    'Sundays': 0,
    'Public Holiday': 8,
    'Public Holidays': 8,
    'Weekday': [1,2,3,4,5],
    'Weekdays': [1,2,3,4,5],
    'Weekend': [6,0],
    'Weekends': [6,0],
    'Weekend/Public Holiday': [6,0],
    'Weekends/Public Holiday': [6,0],
    'Weekend/Public Holidays': [6,0],
    'Weekends/Public Holidays': [6,0],
}

module.exports = {
    genericPublicHolidays,
    publicHolidays,
    dayDict
}
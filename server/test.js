const stationType = {
    'smrt': ['Jurong East', 'Bukit Batok', 'Bukit Gombak', 'Choa Chu Kang', 'Yew Tee', 'Kranji', 'Marsiling', 'Woodlands', 'Admiralty', 'Sembawang', 'Canberra', 'Yishun', 'Khatib', 'Yio Chu Kang', 'Ang Mo Kio', 'Bishan', 'Braddell', 'Toa Payoh', 'Novena', 'Newton', 'Orchard', 'Somerset', 'Dhoby Ghaut', 'City Hall', 'Raffles Place', 'Marina Bay', 'Marina South Pier', 'Pasir Ris', 'Tampines', 'Simei', 'Tanah Merah', 'Bedok', 'Kembangan', 'Eunos', 'Paya Lebar', 'Aljunied', 'Kallang', 'Lavender', 'Bugis', 'Tanjong Pagar', 'Outram Park', 'Tiong Bahru', 'Redhill', 'Queenstown', 'Commonwealth', 'Buona Vista', 'Dover', 'Clementi', 'Chinese Garden', 'Lakeside', 'Boon Lay', 'Pioneer', 'Joo Koon', 'Gul Circle', 'Tuas Crescent', 'Tuas West Road', 'Tuas Link', 'Expo', 'Changi Airport', 'HarbourFront', 'Serangoon', 'Bras Basah', 'Esplanade', 'Promenade', 'Nicoll Highway', 'Stadium', 'Mountbatten', 'Dakota', 'MacPherson', 'Tai Seng', 'Bartley', 'Lorong Chuan', 'Marymount', 'Caldecott', 'Botanic Gardens', 'Farrer Road', 'Holland Village', 'one-north', 'Kent Ridge', 'Haw Par Villa', 'Pasir Panjang', 'Labrador Park', 'Telok Blangah', 'Bayfront', 'Bukit Panjang', 'Stevens', 'South View', 'Keat Hong', 'Teck Whye', 'Phoenix', 'Petir', 'Pending', 'Bangkit', 'Fajar', 'Segar', 'Jelapang', 'Senja', 'Woodlands North ', 'Woodlands ', 'Woodlands South ', 'Springleaf', 'Lentor', 'Mayflower', 'Bright Hill', 'Upper Thomson', 'Napier', 'Orchard Boulevard', 'Great World', 'Havelock', 'Maxwell', 'Shenton Way', 'Gardens by the Bay'], 
    'sbs': ['Newton', 'Dhoby Ghaut', 'Tampines', 'Bugis', 'Outram Park', 'Expo', 'HarbourFront', 'Chinatown', 'Clarke Quay', 'Little India', 'Farrer Park', 'Boon Keng', 'Potong Pasir', 'Woodleigh', 'Serangoon', 'Kovan', 'Hougang', 'Buangkok', 'Sengkang', 'Punggol', 'Promenade', 'MacPherson', 'Botanic Gardens', 'Bayfront', 'Bukit Panjang', 'Cashew', 'Hillview', 'Beauty World', 'King Albert Park', 'Sixth Avenue', 'Tan Kah Kee', 'Stevens', 'Rochor', 'Downtown', 'Telok Ayer', 'Fort Canning', 'Bencoolen', 'Jalan Besar', 'Bendemeer', 'Geylang Bahru', 'Mattar', 'Ubi', 'Kaki Bukit', 'Bedok North', 'Bedok Reservoir', 'Tampines West', 'Tampines East', 'Upper Changi', 'Compassvale', 'Rumbia', 'Bakau', 'Kangkar', 'Ranggung', 'Cheng Lim', 'Farmway', 'Kupang', 'Thanggam', 'Fernvale', 'Layar', 'Tongkang', 'Renjong', 'Cove', 'Meridian', 'Coral Edge', 'Riviera', 'Kadaloor', 'Oasis', 'Damai', 'Sam Kee', 'Punggol Point', 'Samudera', 'Nibong', 'Sumang', 'Soo Teck']
}

const {outputJourney, getTimings} = require("./solver.js")
const {timings} = require("./constants/timings.js")
const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, convertTo24hTime} = require("./utils/utils.js")
const {dayChecker} = require("./utils/solver_utils.js")
const sengkangPunggolCodes = ['STC', 'SE', 'SW', 'PTC', 'PE', 'PW']

//console.log(outputJourney('Bedok Reservoir', 'Yishun'))
//getTimings(1)

// console.log(arrayStringsInText(sengkangPunggolCodes, 'EW2'))

//console.log(timings['Promenade'])

//prime example of having walking + bp lrt
//const paths = outputJourney('Choa Chu Kang', 'Esplanade')

//console.log(convertTo24hTime('11.57pm'))
//process.exit()

//console.log(dayChecker('sbs_times'))
// process.exit()

const paths = outputJourney('Choa Chu Kang', 'Bishan')
//const paths = outputJourney('Woodlands' ,'Raffles Place')
console.log(paths)
console.log(' ')
console.log(getTimings(paths[0]))

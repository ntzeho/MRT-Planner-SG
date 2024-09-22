const stationType = {
    'smrt': ['Jurong East', 'Bukit Batok', 'Bukit Gombak', 'Choa Chu Kang', 'Yew Tee', 'Kranji', 'Marsiling', 'Woodlands', 'Admiralty', 'Sembawang', 'Canberra', 'Yishun', 'Khatib', 'Yio Chu Kang', 'Ang Mo Kio', 'Bishan', 'Braddell', 'Toa Payoh', 'Novena', 'Newton', 'Orchard', 'Somerset', 'Dhoby Ghaut', 'City Hall', 'Raffles Place', 'Marina Bay', 'Marina South Pier', 'Pasir Ris', 'Tampines', 'Simei', 'Tanah Merah', 'Bedok', 'Kembangan', 'Eunos', 'Paya Lebar', 'Aljunied', 'Kallang', 'Lavender', 'Bugis', 'Tanjong Pagar', 'Outram Park', 'Tiong Bahru', 'Redhill', 'Queenstown', 'Commonwealth', 'Buona Vista', 'Dover', 'Clementi', 'Chinese Garden', 'Lakeside', 'Boon Lay', 'Pioneer', 'Joo Koon', 'Gul Circle', 'Tuas Crescent', 'Tuas West Road', 'Tuas Link', 'Expo', 'Changi Airport', 'HarbourFront', 'Serangoon', 'Bras Basah', 'Esplanade', 'Promenade', 'Nicoll Highway', 'Stadium', 'Mountbatten', 'Dakota', 'MacPherson', 'Tai Seng', 'Bartley', 'Lorong Chuan', 'Marymount', 'Caldecott', 'Botanic Gardens', 'Farrer Road', 'Holland Village', 'one-north', 'Kent Ridge', 'Haw Par Villa', 'Pasir Panjang', 'Labrador Park', 'Telok Blangah', 'Bayfront', 'Bukit Panjang', 'Stevens', 'South View', 'Keat Hong', 'Teck Whye', 'Phoenix', 'Petir', 'Pending', 'Bangkit', 'Fajar', 'Segar', 'Jelapang', 'Senja', 'Woodlands North ', 'Woodlands ', 'Woodlands South ', 'Springleaf', 'Lentor', 'Mayflower', 'Bright Hill', 'Upper Thomson', 'Napier', 'Orchard Boulevard', 'Great World', 'Havelock', 'Maxwell', 'Shenton Way', 'Gardens by the Bay'], 
    'sbs': ['Newton', 'Dhoby Ghaut', 'Tampines', 'Bugis', 'Outram Park', 'Expo', 'HarbourFront', 'Chinatown', 'Clarke Quay', 'Little India', 'Farrer Park', 'Boon Keng', 'Potong Pasir', 'Woodleigh', 'Serangoon', 'Kovan', 'Hougang', 'Buangkok', 'Sengkang', 'Punggol', 'Promenade', 'MacPherson', 'Botanic Gardens', 'Bayfront', 'Bukit Panjang', 'Cashew', 'Hillview', 'Beauty World', 'King Albert Park', 'Sixth Avenue', 'Tan Kah Kee', 'Stevens', 'Rochor', 'Downtown', 'Telok Ayer', 'Fort Canning', 'Bencoolen', 'Jalan Besar', 'Bendemeer', 'Geylang Bahru', 'Mattar', 'Ubi', 'Kaki Bukit', 'Bedok North', 'Bedok Reservoir', 'Tampines West', 'Tampines East', 'Upper Changi', 'Compassvale', 'Rumbia', 'Bakau', 'Kangkar', 'Ranggung', 'Cheng Lim', 'Farmway', 'Kupang', 'Thanggam', 'Fernvale', 'Layar', 'Tongkang', 'Renjong', 'Cove', 'Meridian', 'Coral Edge', 'Riviera', 'Kadaloor', 'Oasis', 'Damai', 'Sam Kee', 'Punggol Point', 'Samudera', 'Nibong', 'Sumang', 'Soo Teck']
}

const {outputJourney, getTimings} = require("./solver.js")
const {timings} = require("./constants/timings.js")
const {travelTime, walkingTime, specialStations ,transferTime} = require("./constants/edges.js")

const {arraysEqual, objectInArray, arrayStringsInText, textInStringsArray, convertTo24hTime, editTime, differenceTime} = require("./utils/utils.js")
const {directPathTimings} = require("./utils/solverUtils.js")
const sengkangPunggolCodes = ['STC', 'SE', 'SW', 'PTC', 'PE', 'PW']
const {redundantTransfer, getStationFromCode, commonLines, checkDirect, totalTime, convertPathToStations, checkLineInPaths, astar} = require("./utils/solverUtils.js")

function editEdges(exclude) {
    //remove excluded edges from travelTime
    let newEdges = JSON.parse(JSON.stringify(travelTime))
    for (const toExclude of exclude) delete newEdges[toExclude]
    return newEdges
}

const fs = require('fs')

// console.log(editEdges(['BP6,BP13']))

//console.log(outputJourney('Bedok Reservoir', 'Yishun'))
//getTimings(1)

// console.log(arrayStringsInText(sengkangPunggolCodes, 'EW2'))

//console.log(timings['Promenade'])

//prime example of having walking + bp lrt
// const paths = outputJourney('Tongkang', 'Sam Kee')

// console.log(addTime('00:03', 7))
// process.exit()

//console.log(convertTo24hTime('11.57pm'))
//process.exit()

// console.log(convertTimeToMinutes('00:42'))
// process.exit()

// const paths = outputJourney('Yew Tee', 'Hillview')
// const BP_STNS = ['Choa Chu Kang', 'South View', 'Keat Hong', 'Teck Whye', 'Phoenix', 'Bukit Panjang', 'Petir', 'Pending', 'Bangkit', 'Fajar', 'Segar', 'Jelapang', 'Senja']
// let ALL = []

/* 
1. install node (https://nodejs.org/en) and git
2. clone the repo into ur desired folder using "git clone <link to repo, click on the green code button to see>"
3. use "npm install" command in both server and client folder to get the dependencies
4. use "git checkout -b <branchName>" to make new branch
5. inside the server folder theres a file called config.env.sample, duplicate file, rename to config.env and replace <password> with cdchacx
6. to start the server, use "node ./server.js"
7. to start app, use "npm start"
*/

const paths = outputJourney('Changi Airport', 'Bayfront')
// const paths = outputJourney('Bedok', 'Kembangan')
for (const path of paths) {
    console.log(path)
    console.log(' ')
    console.log(getTimings(path))
}
// console.log('-----------------')
// paths = outputJourney('Bedok Reservoir', 'Bras Basah')
// for (const path of paths) {
//     console.log(path)
//     console.log(' ')
//     // console.log(getTimings(path))
// }

// let nonWalkingPath = JSON.parse(JSON.stringify(path))
// const walkingTime = nonWalkingPath.time - totalTime(path.codes)
// if (pathAttributes.length === 5) {
//     if (path.walk.includes(path.names[0])) { //walking is at start
//         nonWalkingPath.time = totalTime(path.codes)
//     }
// }
//const paths = outputJourney('Woodlands' ,'Raffles Place')


/*
async function scrapeTimings(req, res) {
    //scrape train timings from sbs and smrt websites
    //scrapper.py


}

async function writeStations(req, res) {
    //write stations.js
    //stations.py

}

async function editEdges(req, res) {
    //edit edges.csv file
    //stations.py
}

async function writeEdges(req, res) {
    //write edges.js
    //stations.py

}

// router.get('/timings', scrapeTimings);
// router.get('/stations', writeStations);
// router.put('/edges', editEdges);
// router.get('/edges', writeEdges);
// router.get('/user', getUsers);
// router.post('/user/login', getUser);
// router.post('/user', createUser);

[
    {
        "path": {
            "codes": [
                "SW7",
                "SW8",
                "STC_A",
                "NE16",
                "NE15",
                "NE14",
                "NE13",
                "NE12",
                "NE11",
                "NE10",
                "NE9",
                "NE8",
                "NE7",
                "DT12",
                "DT11",
                "DT10",
                "DT9",
                "DT8",
                "DT7",
                "DT6",
                "DT5",
                "DT3",
                "DT2",
                "DT1",
                "BP6_a",
                "BP13"
            ],
            "names": [
                "Tongkang",
                "Renjong",
                "Sengkang",
                "Buangkok",
                "Hougang",
                "Kovan",
                "Serangoon",
                "Woodleigh",
                "Potong Pasir",
                "Boon Keng",
                "Farrer Park",
                "Little India",
                "Newton",
                "Stevens",
                "Botanic Gardens",
                "Tan Kah Kee",
                "Sixth Avenue",
                "King Albert Park",
                "Beauty World",
                "Hillview",
                "Cashew",
                "Bukit Panjang",
                "Senja"
            ],
            "transfer": [
                "Sengkang",
                "Little India",
                "Bukit Panjang"
            ],
            "time": 64
        },
        "timings": {
            "firstTrain": {},
            "lastTrain": {
                "terminate": [
                    "STC Sengkang",
                    "NE1 HarbourFront",
                    "DT1 Bukit Panjang",
                    "BP6 Bukit Panjang"
                ],
                "entry": [
                    "Last Trains",
                    "Last Trains | Weekends/Public Holidays",
                    "Last Trains",
                    "Last Train | Saturday"
                ],
                "leaveTime": [
                    "22:29",
                    "22:40",
                    "23:06",
                    "23:37"
                ],
                "eta": [
                    "22:33",
                    "22:59",
                    "23:31",
                    "23:38"
                ],
                "finalLeaveTime": "22:29",
                "finalETA": "23:33"
            }
        }
    },
    {
        "path": {
            "codes": [
                "SW7",
                "SW6",
                "SW5",
                "SW4",
                "SW3",
                "SW2",
                "SW1",
                "STC_B",
                "NE16",
                "NE15",
                "NE14",
                "NE13",
                "NE12",
                "NE11",
                "NE10",
                "NE9",
                "NE8",
                "NE7",
                "DT12",
                "DT11",
                "DT10",
                "DT9",
                "DT8",
                "DT7",
                "DT6",
                "DT5",
                "DT3",
                "DT2",
                "DT1",
                "BP6_a",
                "BP13"
            ],
            "names": [
                "Tongkang",
                "Layar",
                "Fernvale",
                "Thanggam",
                "Kupang",
                "Farmway",
                "Cheng Lim",
                "Sengkang",
                "Buangkok",
                "Hougang",
                "Kovan",
                "Serangoon",
                "Woodleigh",
                "Potong Pasir",
                "Boon Keng",
                "Farrer Park",
                "Little India",
                "Newton",
                "Stevens",
                "Botanic Gardens",
                "Tan Kah Kee",
                "Sixth Avenue",
                "King Albert Park",
                "Beauty World",
                "Hillview",
                "Cashew",
                "Bukit Panjang",
                "Senja"
            ],
            "transfer": [
                "Sengkang",
                "Little India",
                "Bukit Panjang"
            ],
            "time": 68
        },
        "timings": {
            "firstTrain": {},
            "lastTrain": {
                "terminate": [
                    "STC Sengkang",
                    "NE1 HarbourFront",
                    "DT1 Bukit Panjang",
                    "BP6 Bukit Panjang"
                ],
                "entry": [
                    "Last Trains",
                    "Last Trains | Weekends/Public Holidays",
                    "Last Trains",
                    "Last Train | Saturday"
                ],
                "leaveTime": [
                    "22:25",
                    "22:40",
                    "23:06",
                    "23:37"
                ],
                "eta": [
                    "22:33",
                    "22:59",
                    "23:31",
                    "23:38"
                ],
                "finalLeaveTime": "22:25",
                "finalETA": "23:33"
            }
        }
    },
    {
        "path": {
            "codes": [
                "SW7",
                "SW8",
                "STC_A",
                "NE16",
                "NE15",
                "NE14",
                "NE13",
                "NE12",
                "NE11",
                "NE10",
                "NE9",
                "NE8",
                "NE7",
                "DT12",
                "DT11",
                "DT10",
                "DT9",
                "DT8",
                "DT7",
                "DT6",
                "DT5",
                "DT3",
                "DT2",
                "DT1",
                "BP6_b",
                "BP7",
                "BP8",
                "BP9",
                "BP10",
                "BP11",
                "BP12",
                "BP13"
            ],
            "names": [
                "Tongkang",
                "Renjong",
                "Sengkang",
                "Buangkok",
                "Hougang",
                "Kovan",
                "Serangoon",
                "Woodleigh",
                "Potong Pasir",
                "Boon Keng",
                "Farrer Park",
                "Little India",
                "Newton",
                "Stevens",
                "Botanic Gardens",
                "Tan Kah Kee",
                "Sixth Avenue",
                "King Albert Park",
                "Beauty World",
                "Hillview",
                "Cashew",
                "Bukit Panjang",
                "Petir",
                "Pending",
                "Bangkit",
                "Fajar",
                "Segar",
                "Jelapang",
                "Senja"
            ],
            "transfer": [
                "Sengkang",
                "Little India",
                "Bukit Panjang"
            ],
            "time": 73
        },
        "timings": {
            "firstTrain": {},
            "lastTrain": {
                "terminate": [
                    "STC Sengkang",
                    "NE1 HarbourFront",
                    "DT1 Bukit Panjang",
                    "BP6 Bukit Panjang"
                ],
                "entry": [
                    "Last Trains",
                    "Last Trains | Weekends/Public Holidays",
                    "Last Trains",
                    "Last Train | Saturday"
                ],
                "leaveTime": [
                    "22:29",
                    "22:40",
                    "23:06",
                    "23:37"
                ],
                "eta": [
                    "22:33",
                    "22:59",
                    "23:31",
                    "23:47"
                ],
                "finalLeaveTime": "22:29",
                "finalETA": "23:42"
            }
        }
    },
    {
        "path": {
            "codes": [
                "SW7",
                "SW6",
                "SW5",
                "SW4",
                "SW3",
                "SW2",
                "SW1",
                "STC_B",
                "NE16",
                "NE15",
                "NE14",
                "NE13",
                "NE12",
                "NE11",
                "NE10",
                "NE9",
                "NE8",
                "NE7",
                "DT12",
                "DT11",
                "DT10",
                "DT9",
                "DT8",
                "DT7",
                "DT6",
                "DT5",
                "DT3",
                "DT2",
                "DT1",
                "BP6_b",
                "BP7",
                "BP8",
                "BP9",
                "BP10",
                "BP11",
                "BP12",
                "BP13"
            ],
            "names": [
                "Tongkang",
                "Layar",
                "Fernvale",
                "Thanggam",
                "Kupang",
                "Farmway",
                "Cheng Lim",
                "Sengkang",
                "Buangkok",
                "Hougang",
                "Kovan",
                "Serangoon",
                "Woodleigh",
                "Potong Pasir",
                "Boon Keng",
                "Farrer Park",
                "Little India",
                "Newton",
                "Stevens",
                "Botanic Gardens",
                "Tan Kah Kee",
                "Sixth Avenue",
                "King Albert Park",
                "Beauty World",
                "Hillview",
                "Cashew",
                "Bukit Panjang",
                "Petir",
                "Pending",
                "Bangkit",
                "Fajar",
                "Segar",
                "Jelapang",
                "Senja"
            ],
            "transfer": [
                "Sengkang",
                "Little India",
                "Bukit Panjang"
            ],
            "time": 77
        },
        "timings": {
            "firstTrain": {},
            "lastTrain": {
                "terminate": [
                    "STC Sengkang",
                    "NE1 HarbourFront",
                    "DT1 Bukit Panjang",
                    "BP6 Bukit Panjang"
                ],
                "entry": [
                    "Last Trains",
                    "Last Trains | Weekends/Public Holidays",
                    "Last Trains",
                    "Last Train | Saturday"
                ],
                "leaveTime": [
                    "22:25",
                    "22:40",
                    "23:06",
                    "23:37"
                ],
                "eta": [
                    "22:33",
                    "22:59",
                    "23:31",
                    "23:47"
                ],
                "finalLeaveTime": "22:25",
                "finalETA": "23:42"
            }
        }
    }
]
*/
const {walkingTime} = require("../constants/edges.js")

function walkingStatusInPath(path) {
    if (!path.walk) return 0
    if (path.walk.length === 2) return 2
    if (path.walk[0].includes(path.names[0])) return 'start'
    return 'end'
}

function addSectionsToPath(path) {
    if (!path.codes) { //pure walking path
        path.sections = [[['WALK', path.names[0]], ['WALK', path.names[1]]]]
    } else {
        const walkTimeKeys = Object.keys(walkingTime)
        const sections = [];
        let currentSection = [];

        if (['start', 2].includes(walkingStatusInPath(path))) {
            for (const key of walkTimeKeys) {
                if (key.includes(path.names[0])) {
                    const [first, second] = key.split(',')
                    if (path.names[0] === first) sections.push([['WALK', second], ['WALK', first]])
                    else sections.push([['WALK', first], ['WALK', second]])
                    break
                }
            }
        }

        let codeCount = 0
        let stationCount = 0
        while (codeCount < path.codes.length) { 
            const stationCode = path.codes[codeCount]
            const stationName = path.names[stationCount]

            currentSection.push([stationCode, stationName])

            if (path.transfer.includes(stationName) || codeCount === path.codes.length - 1) {
                sections.push(currentSection);
                //start a new section from the transfer station if not the last station
                if (codeCount !== path.codes.length - 1) {
                    codeCount += 1
                    currentSection = [[path.codes[codeCount], stationName]];
                }
            }
            codeCount += 1
            stationCount += 1
        }

        if (['end', 2].includes(walkingStatusInPath(path))) {
            for (const key of walkTimeKeys) {
                if (key.includes(path.names[path.names.length - 1])) {
                    const [first, second] = key.split(',')
                    if (path.names[path.names.length - 1] === first) sections.push([['WALK', first], ['WALK', second]])
                    else sections.push([['WALK', second], ['WALK', first]])
                    break
                }
            }
        }
    
        //add sections to the path object
        path.sections = sections;
    }
}

module.exports = {
    addSectionsToPath
}
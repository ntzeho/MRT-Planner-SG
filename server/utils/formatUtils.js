const {walkingTime, transferTime} = require("../constants/edges.js")
const {totalTime} = require("./solverUtils.js")

function walkingStatusInPath(path) {
    if (!path.walk) return 0
    if (path.walk.length === 2) return 2
    if (path.walk[0].includes(path.names[0])) return 'start'
    return 'end'
}

function getOriginalCode(code) {
    if (code.includes('_')) return code.split('_')[0]
    else if (code === 'CE') return 'CC4'
    else if (code === 'CG') return 'EW4'
    return code
}

function addSectionsToPath(path) {
    if (!path.codes) { //pure walking path
        const [walkTime, description] = path.walk[0].split(' minutes walk | ')
        path.sections = [['Walk', walkTime, ['', path.names[0]], ['', path.names[1]], description]]
    } else {
        const walkTimeKeys = Object.keys(walkingTime)
        const sections = [];
        let currentSection = ['Train'];
        let currentCodeSection = [];
        let currentCodesOnly = []

        if (['start', 2].includes(walkingStatusInPath(path))) {
            for (const key of walkTimeKeys) {
                if (key.includes(path.names[0])) {
                    const [first, second] = key.split(',')
                    const [walkTime, description] = path.walk[0].split(' minutes walk | ')
                    if (path.names[0] === first) sections.push(['Walk', walkTime, ['', second], ['', first], description])
                    else sections.push(['Walk', walkTime, ['', first], ['', second], description])
                    break
                }
            }
        }

        let codeCount = 0
        let stationCount = 0
        while (codeCount < path.codes.length) { 
            const stationCodeOriginal = path.codes[codeCount]
            const stationName = path.names[stationCount]
            const stationCode = getOriginalCode(stationCodeOriginal)

            currentCodeSection.push([stationCode, stationName])
            currentCodesOnly.push(stationCodeOriginal)

            if (path.transfer.includes(stationName) || codeCount === path.codes.length - 1) {
                currentSection.push(totalTime(currentCodesOnly), currentCodeSection[0], currentCodeSection[currentCodeSection.length - 1], currentCodeSection)
                sections.push(currentSection)
                //start a new section from the transfer station if not the last station
                if (codeCount !== path.codes.length - 1) {
                    codeCount += 1
                    sections.push(['Transfer', transferTime, [stationCode, stationName], [getOriginalCode(path.codes[codeCount]), stationName], 'Alight to transfer train'])
                    currentSection = ['Train'];
                    currentCodeSection = [[getOriginalCode(path.codes[codeCount]), stationName]]
                    currentCodesOnly = [path.codes[codeCount]]
                }
            }
            codeCount += 1
            stationCount += 1
        }

        if (['end', 2].includes(walkingStatusInPath(path))) {
            for (const key of walkTimeKeys) {
                if (key.includes(path.names[path.names.length - 1])) {
                    const [first, second] = key.split(',')
                    const [walkTime, description] = walkingStatusInPath(path) === 2? path.walk[1].split(' minutes walk | ') : path.walk[0].split(' minutes walk | ')
                    if (path.names[path.names.length - 1] === first) sections.push(['Walk', walkTime, ['', first], ['', second], description])
                    else sections.push(['Walk', walkTime, ['', second], ['', first], description])
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
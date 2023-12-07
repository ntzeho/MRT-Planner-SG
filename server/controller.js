const TimeModel = require("./timings.js")
const {outputJourney, getTimings} = require("./solver.js")

async function solve(req, res) {

}

async function scrapeTimings(req, res) {
    //run python script to scrape train timings from sbs and smrt websites
    //scrapper.py


}

async function updateStations(req, res) {
    //run python script to edit the values of constants in stations.js
    //stations.py

}

module.exports = {
    solve,
    scrapeTimings,
    updateStations
}
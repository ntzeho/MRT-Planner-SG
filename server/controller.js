const {outputJourney, getTimings} = require("./solver.js")

async function solve(req, res) {

}

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

module.exports = {
    solve,
    scrapeTimings,
    writeStations,
    editEdges,
    writeEdges
}
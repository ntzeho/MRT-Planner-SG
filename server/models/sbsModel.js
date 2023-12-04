const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SBSModelSchema = new Schema({
    station: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: Number,
        required: true,
    },
    times: { //store timings for station
        type: Object,
        required: true,
        default: {},
    }
    
})

module.exports = mongoose.model('SBS', SBSModelSchema);
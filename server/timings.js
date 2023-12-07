const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TimingModelSchema = new Schema({
    station: {
        type: String,
        required: true,
        unique: true,
    },
    codes: {
        type: Array,
        required: true,
    },
    sbs_times: { //store timings for station
        type: Object,
        required: true,
        default: {},
    },
    smrt_times: { //store timings for station
        type: Object,
        required: true,
        default: {},
    }
})

module.exports = mongoose.model('Timing', TimingModelSchema);
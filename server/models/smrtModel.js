const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SMRTModelSchema = new Schema({
    station: {
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: Array,
        required: true,
    },
    times: { //store timings for station
        type: Object,
        required: true,
        default: {},
    }
    
})

module.exports = mongoose.model('SMRT', SMRTModelSchema);
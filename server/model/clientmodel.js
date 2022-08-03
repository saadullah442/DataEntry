const mongoose = require('mongoose')


const clientSchema = mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    City: {
        type: String,
        required: true
    },
    Country: {
        type: String,
        required: true
    },
    Number: {
        type: Number,
        required: true
    },
    File: {
        type: String,
        required: true,
        default: 'no path provided'
    }
})


const Client = mongoose.model('client',clientSchema)


module.exports = Client
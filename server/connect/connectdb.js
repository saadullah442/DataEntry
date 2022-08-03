const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/DataEntry', (err) => {
    if (err) return err

    console.log('connected to DB..')
})
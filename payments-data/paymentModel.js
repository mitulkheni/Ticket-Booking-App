const { default: mongoose } = require('mongoose')

require('../Users/db/mongoose')

const Payment = new mongoose.Schema({
    
},{
    timestamps: true
})
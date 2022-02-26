const mongoose = require('mongoose');

const Pharma_IncSchema = new mongoose.Schema({
  
    email: {
        type:String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
   
    Location: {
        type: String
    },



},
{timestamps: true}
)

module.exports = mongoose.model('Pharma_Inc', Pharma_IncSchema);
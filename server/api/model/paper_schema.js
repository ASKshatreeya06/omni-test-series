const mongoose = require('mongoose');

const paperModel = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    answer: {
        type: Number,
        required: true
    }
}, { timestamps: true });

mongoose.model('paperModel', paperModel)
module.exports=paperModel

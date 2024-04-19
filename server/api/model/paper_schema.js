const mongoose = require('mongoose');

const paperModel = mongoose.Schema({
    question: {
        type: String,
        require: true
    },
    options: [{
        type: String,
        require: true
    }],
    answer: {
        type: Number,
        require: true
    },
    level:{
        type:String,
        require:true
    }
}, { timestamps: true });

mongoose.model('paperModel', paperModel)
module.exports=paperModel

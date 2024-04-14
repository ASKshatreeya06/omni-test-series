const { default: mongoose, ObjectId } = require('mongoose');

const answerModel = mongoose.Schema({

    questionId: { type: mongoose.Schema.Types.ObjectId,ref:'paperModel', required: true },
    answer: { type: String, required: true },
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'userModel' ,
    require:true}
}, { timestamps: true });

mongoose.model('answerModel', answerModel)
module.exports = answerModel

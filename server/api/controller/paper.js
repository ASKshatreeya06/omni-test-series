const express = require('express');
const mongoose = require('mongoose'); 


const paperModel = mongoose.model('paperModel'); 
const userModel = mongoose.model('userModel')
const answerModel = mongoose.model('answerModel')
const question = async (req, res) => {
    try {
        const paper = await paperModel.find().limit(9); // Retrieves up to 9 documents
        if (!paper.length) { // Check if the array is empty
            return res.status(404).json({ message: "Data not found" }); // 404 Not Found if no documents
        }
        res.status(200).json({ paper });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" }); // Send a 500 response on error
    }
}

const answer = async (req, res) => {
    const { answers } = req.body;
    const userId = req.user._id;
    // Example: save answers to MongoDB
    // Assuming you have a Question model defined
    answers.forEach(async ({ id, answer }) => {
      try {
        const newAnswer = new answerModel({ questionId: id, answer, userId: userId });
        await newAnswer.save();
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    });
  
    res.status(200).send('Answers submitted successfully');
  }
  

module.exports = { question,answer };

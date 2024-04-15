import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import { apiurl } from '../apiurl';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Questionnaire = () => {
    const [paperData, setPaperData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false)
    const token = sessionStorage.getItem("token")

    useEffect(() => {
        const fetchQuestions = async () => {
            try {

                const response = await axios.get(apiurl + `paper`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token
                    },
                });


                setPaperData(response.data.paper || []);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

       
        fetchQuestions();
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        var result = answers


        const q_indx = result.findIndex(x => x.id === questionId)
        if (q_indx === -1) {
            result.push({
                id: questionId, answer: answer
            })
        } else {
            result[q_indx] = {
                id: questionId, answer: answer
            }
        }
        setAnswers([...result]);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < paperData.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            // debugger
            const response = await axios.post(apiurl + `answer_submit`, { answers }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            });

            setSuccessMessage('Thank you for submitting your answers');
            toast.success(response?.data)
            setIsSubmit(true)
        } catch (err) {
            console.error('Error submitting answers:', err);
        }
    };

    return (
        <div className='h-[80%] justify-center flex flex-col '>

            {isSubmit ? <div className='flex h-[80%] items-center flex-col justify-center font-bold text-6xl'>{successMessage}</div>
                : <div className='flex h-[80%] items-center flex-col justify-center'>
                    <h1 className='font-bold text-3xl'>Question</h1>
                    {paperData.length > 0 && (
                        <div>
                            <p>( {paperData[currentQuestionIndex].id} )  {paperData[currentQuestionIndex].question}</p>
                            {paperData[currentQuestionIndex].options.map((option, index) => (
                                <div key={index}>
                                    <input
                                        type="radio"
                                        id={`option${index}`}
                                        name={`question${currentQuestionIndex}`}
                                        checked={answers.find(x => x.id === paperData[currentQuestionIndex]._id)?.answer === option ? true : false}
                                        onChange={(e) =>
                                            handleAnswerChange(
                                                paperData[currentQuestionIndex]._id,
                                                option
                                            )
                                        }
                                    />
                                    <label htmlFor={`option${index}`}>{option}</label>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='flex justify-around w-screen p-5'>
                        {currentQuestionIndex !== 0 && (<button className='active:bg-[#1D9BF0] border-none px-4 rounded-full flex items-center' onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                            <div><FaArrowLeft /></div> Previous
                        </button>)}
                        {currentQuestionIndex !== paperData.length - 1 && (<button className='active:bg-[#1D9BF0] border-none px-4 rounded-full flex items-center'
                            disabled={answers.find(x => x.id === paperData[currentQuestionIndex]._id) ? false : true}
                            onClick={handleNextQuestion}

                        >
                            Next <div> <FaArrowRight /></div>
                        </button>)}
                    </div>

                    <button className='active:bg-[#1D9BF0] border-none px-4 rounded-full ' onClick={handleSubmit} disabled={answers.length !== paperData.length}>
                        Submit
                    </button>
                    {successMessage && <p>{successMessage}</p>}
                </div>}
            <ToastContainer />
        </div>
    );
};

export default Questionnaire;

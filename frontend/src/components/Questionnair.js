import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import { apiurl } from '../apiurl';

const Questionnaire = () => {
    const [paperData, setPaperData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmit,setIsSubmit] = useState(false)
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
                console.log('q_list', response.data);

                setPaperData(response.data.paper || []);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    const handleAnswerChange = (questionId, answer) => {
        var result = answers

        debugger
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



        // alert("hit me");
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

            await axios.post(apiurl+`answer_submit`, { answers },{
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            });
            setSuccessMessage('Thank you for submitting your answers');
            setIsSubmit(true)
        } catch (err) {
            console.error('Error submitting answers:', err);
        }
    };

    return (
        <div className='w-screen h-screen flex items-center flex-col '>
            <Header />
            {isSubmit?<div className='flex h-screen items-center flex-col justify-center font-bold text-6xl'>{successMessage}</div>:<div className='flex h-screen items-center flex-col justify-center'>
                <h1 className='font-bold text-3xl'>Question</h1>
                {paperData.length > 0 && (
                    <div>
                        <p> {paperData[currentQuestionIndex].question}</p>
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
                    {currentQuestionIndex !== 0 && (<button className='bg-[#1D9BF0] border-none px-4 rounded-full' onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
                        Previous
                    </button>)}
                    {currentQuestionIndex !== paperData.length - 1 && (<button className='bg-[#1D9BF0] border-none px-4 rounded-full'
                        disabled={answers.find(x => x.id === paperData[currentQuestionIndex]._id) ? false : true}
                        onClick={handleNextQuestion}
                    >
                        Next
                    </button>)}
                </div>

                <button className='bg-[#1D9BF0] border-none px-4 rounded-full hover:bg-violet-600' onClick={handleSubmit} disabled={answers.length !== paperData.length}>
                    Submit
                </button>
                {successMessage && <p>{successMessage}</p>}
            </div>}
        </div>
    );
};

export default Questionnaire;

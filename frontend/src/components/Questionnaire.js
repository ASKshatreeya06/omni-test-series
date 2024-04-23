import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { apiurl } from '../apiurl';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { PieChart } from 'react-minimal-pie-chart';

const Questionnaire = () => {
    const [paperData, setPaperData] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const token = sessionStorage.getItem('token');
    const [levelCounts, setLevelCounts] = useState({ easy: 0, medium: 0, hard: 0 });


    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(apiurl + 'paper', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + token,
                    },
                });

                setPaperData(response.data.paper || []);

            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);
    useEffect(() => {
        buildChatData()
    }, [paperData, currentQuestionIndex])
    const buildChatData = () => {
        const questions = paperData.slice(0, currentQuestionIndex + 1);

        const counts = { easy: 0, medium: 0, hard: 0 };

        questions.forEach(question => {
            counts[question.level]++;
        });
        setLevelCounts(counts);
    }

    const handleAnswerChange = (questionId, answer) => {
        var result = answers;

        const q_indx = result.findIndex(x => x.id === questionId);
        if (q_indx === -1) {
            result.push({ id: questionId, answer: answer });
        } else {
            result[q_indx] = { id: questionId, answer: answer };
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
            const response = await axios.post(apiurl + 'answer_submit', { answers }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
            });

            setSuccessMessage('Thank you for submitting your answers');
            toast.success(response?.data);
            setIsSubmit(true);
        } catch (err) {
            console.error('Error submitting answers:', err);
        }
    };

    return (
        <div className="h-[80%] justify-center flex flex-col">
            {isSubmit ? (
                <div className="flex h-[80%] items-center flex-col justify-center font-bold text-6xl">
                    {successMessage}
                </div>
            ) : (
                <div className='flex h-[80%]  items-center flex-row justify-center' style={{ width: '90vw' }}>
                    <div className="flex h-[80%] w-[70%] items-center flex-col justify-center">
                        <h1 className="font-bold text-3xl">Question</h1>
                        {paperData.length > 0 && (
                            <div>
                                <p>
                                    ( {paperData[currentQuestionIndex].id} ){' '}
                                    {paperData[currentQuestionIndex].question}
                                </p>
                                {paperData[currentQuestionIndex].options.map((option, index) => (
                                    <div key={index}>
                                        <input
                                            type="radio"
                                            id={`option${index}`}
                                            name={`question${currentQuestionIndex}`}
                                            checked={
                                                answers.find(
                                                    x => x.id === paperData[currentQuestionIndex]._id
                                                )?.answer === option
                                            }
                                            onChange={e =>
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

                        <div className="flex justify-around w-screen p-5">
                            {currentQuestionIndex !== 0 && (
                                <button
                                    className="active:bg-[#1D9BF0] border-none px-4 rounded-full flex items-center"
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    <div>
                                        <FaArrowLeft />
                                    </div>{' '}
                                    Previous
                                </button>
                            )}
                            {currentQuestionIndex !== paperData.length - 1 && (
                                <button
                                    className="active:bg-[#1D9BF0] border-none px-4 rounded-full flex items-center"
                                    disabled={
                                        answers.find(
                                            x => x.id === paperData[currentQuestionIndex]._id
                                        )
                                            ? false
                                            : true
                                    }
                                    onClick={handleNextQuestion}
                                >
                                    Next{' '}
                                    <div>
                                        <FaArrowRight />
                                    </div>
                                </button>
                            )}
                        </div>

                        <button
                            className="active:bg-[#1D9BF0] border-none px-4 rounded-full "
                            onClick={handleSubmit}
                            disabled={answers.length !== paperData.length}
                        >
                            Submit
                        </button>
                        {successMessage && <p>{successMessage}</p>}
                    </div>
                    <div className=" flex items-center flex-col h-[50%]">
                        <div style={{ marginBottom: '1rem' }}>
                            <span className='bg-[#B76EE1] mx-4 px-2' >easy</span><span className='bg-[#F4E873] mx-4 px-2'>medium</span><span className='bg-[#FF5733] mx-4  px-2'>hard</span>
                        </div>
                        <PieChart
                            data={[
                                { title: `easy ${((levelCounts.easy * 100) / (levelCounts.easy + levelCounts.medium + levelCounts.hard)).toFixed(2)}%`, value: levelCounts.easy, color: '#B76EE1', lineWidth: 30 },
                                { title: `medium ${((levelCounts.medium * 100) / (levelCounts.easy + levelCounts.medium + levelCounts.hard)).toFixed(2)}%`, value: levelCounts.medium, color: '#F4E873', lineWidth: 30 },
                                { title: `hard ${((levelCounts.hard * 100) / (levelCounts.easy + levelCounts.medium + levelCounts.hard)).toFixed(2)}%`, value: levelCounts.hard, color: '#FF5733', lineWidth: 30 },
                            ]}
                            lineWidth={50}
                            totalValue={levelCounts.easy + levelCounts.medium + levelCounts.hard}
                        />
                        <div> Total number of questions : {levelCounts.easy + levelCounts.medium + levelCounts.hard}</div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Questionnaire;

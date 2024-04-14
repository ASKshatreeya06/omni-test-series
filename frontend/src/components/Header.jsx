import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiurl } from '../apiurl';
import { toast } from 'react-toastify';

const Header = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const response = await axios.get(apiurl + `logout`, {
                headers: {
                    // "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
            });
            sessionStorage.removeItem("token");
            toast.success(response?.data?.message)
            navigate('/');
        } catch (error) {
            console.error(error.response?.data?.error?.message);
        }
    }

    return (
        <div className='flex justify-between w-screen pt-3 font-bold' style={{backgroundColor:"#808080", color:'white', border: '1px solid black', height: '50px', justifyItems: 'center' }}>
            <div style={{ marginLeft: '2rem' }}> <Link to='/profile'>Profile</Link></div>
            <button onClick={logoutHandler} style={{ marginRight: '2rem', cursor: 'pointer' }}>Log Out</button>
        </div>
    );
}

export default Header;

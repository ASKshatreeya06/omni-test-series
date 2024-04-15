import React, { useEffect, useState } from 'react';
import { apiurl } from '../apiurl';
import axios from 'axios';

const Profile = () => {
    const token = sessionStorage.getItem("token")
    const [user, setUser] = useState([])
    const fetchProfile = async () => {
        const response = await axios.get(apiurl + `getmyprofile`, {
            headers: {
                "Authorization": "Bearer " + token
            },
        });
        console.log(response?.data?.user);
        setUser(response?.data?.user)
    }
useEffect(()=>{
    fetchProfile()
},[])

    return (
        <div className='flex justify-center flex-col w-screen items-center'>
            {/* Render the user's fullName if user data is available and valid */}
            <div className='border-2 p-5'>
            <h1><b>Full Name =&gt; </b>{user.fullName} </h1>
            <h1><b>User Name =&gt; </b>{user.userName} </h1>
            <h1><b>Email  =&gt; </b>{user.email} </h1>
            <h1><b>Phone Number =&gt; </b>{user.phone} </h1>
            </div>
        </div>
    );
}

export default Profile;

import React, { useEffect, useState } from "react";
import { auth, provider } from './config';
import { signInWithPopup } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import Home from "../MainPage/Home";

function Signin() {
    const [value, setValue] = useState('');

    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        if (userEmail) {
            setValue(userEmail);
        }
    }, []);

    const handleClick = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                const userEmail = data.user.email;
                const uid = data.user.uid;

                setValue(userEmail);
                localStorage.setItem("email", userEmail);

                // Save user UID to the Firebase Realtime Database
                const db = getDatabase();
                set(ref(db, 'UserAccount/' + uid), {
                    email: userEmail,
                    // You can add more user information here if needed
                });
            })
            .catch((error) => {
                console.error('로그인 실패:', error);
            });
    }

    return (
        <div>
            {value ? <Home /> : <button onClick={handleClick}>구글로 로그인</button>}
        </div>
    );
}

export default Signin;

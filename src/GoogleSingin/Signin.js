import React, { useEffect, useState } from "react";
import { auth, provider } from './config';
import { signInWithPopup } from "firebase/auth";
import Home from "../MainPage/Home";

function Signin() {
    const [value, setValue] = useState('');

    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        if (userEmail) {
            setValue(userEmail);
        }
    }, []); // 빈 배열을 넘겨 의존성 배열로 사용하여, 초기 한 번만 실행되도록 설정

    const handleClick = () => {
        signInWithPopup(auth, provider)
            .then((data) => {
                const userEmail = data.user.email;
                setValue(userEmail);
                localStorage.setItem("email", userEmail);
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

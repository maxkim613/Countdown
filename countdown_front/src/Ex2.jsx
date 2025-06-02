
import React from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux'

const Ex2 = ({isLogin, name}) => {
    const navigate = useNavigate();

    const user= useSelector((state)=> state.user.user);
    return (
        <p>
        {
            isLogin?
            name+"님 안녕하세요"
            :"로그인을 해주세요"
        }
        <button onClick={() => navigate('/Ex3')}>ex3</button>
        </p>
    );
}

export default Ex2;
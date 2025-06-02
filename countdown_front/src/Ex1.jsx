
import React from "react";
import { useNavigate } from "react-router-dom";


import { useSelector} from 'react-redux'

const Ex1 = (props) => {
    const navigate = useNavigate();


    const user= useSelector((state)=> state.user.user);
    console.log(user);
    return (
        <>
            {props.ex1}:{props.ex2}
            <button onClick={() => navigate('/Ex2')}>ex2</button>
            <br/>
            {user?.username}: {user?.userId}
        </>
    );
}

export default Ex1;
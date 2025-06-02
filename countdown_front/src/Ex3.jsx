
import React from "react";
import { useNavigate } from "react-router-dom";
const Ex3 = () => {
    const array = ["1","2","3"];
    const navigate = useNavigate();
    return (
        <>
        <ul>
        {array.map((item,index)=> (
            <li key={index}>{item}</li>
        ))
        }
        
        </ul>
        <button onClick={() => navigate('/Ex4')}>ex4</button>
        </>
    );
}

export default Ex3;
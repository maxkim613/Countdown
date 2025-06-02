
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Ex4 = () => {
    const [time, setTime] = useState(0);
    console.log(time);
    useEffect(()=> {
        console.log("in"+time);
    },[time]);
    const navigate = useNavigate();
    return (
        <>
            시간: {time}
            <br/>
            <input
             type="text" 
             value={time} 
             onChange={(e)=>setTime(e.target.value)}/>
             <button onClick={() => navigate('/Ex4')}>ex4</button>
             
        </>
    );
}

export default Ex4;
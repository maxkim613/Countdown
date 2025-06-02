import { useEffect, useMemo, useRef, useState } from "react";

const Ex9 = () => {

    const [number, setNumber] = useState(0);

    const slowSquare = useMemo(() => {
        console.log("무거운 계산 시작...");
        for (let i = 0; i < 200000000; i++) {}
        return number * number;
    }, [number])

    const [time, setTime] = useState(0);
    useEffect(()=> {
        console.log("안 time",time);
    },[time]);

    return (
        <>
        <input type="number" value={number}
        onChange={(e) => 
            setNumber(Number(e.target.value))
        } />결과{slowSquare}<br/>
        
        <input 
        type="text"
        value={time}
        onChange={(e)=>setTime(e.target.value)} />
        시간: {time}<br/>
        </>
    );
}
export default Ex9;
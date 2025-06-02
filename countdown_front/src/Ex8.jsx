import { useRef } from "react";

const Ex8 = () => {

    const inputRef = useRef(null);

    return (
        <>
        <input type="text" ref={inputRef} />
        <button type="button" onClick={()=>inputRef.current.focus()}>foucs</button>
        </>
    );
}
export default Ex8;
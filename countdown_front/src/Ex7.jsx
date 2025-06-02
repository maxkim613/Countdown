import { useReducer } from "react";
function reducer(state, action) {
    switch (action.type) {
        case "p":
            return {count: state.count +1};
        case "m":
            return {count: state.count -1};
        case "r":
            return {count: 0};
        default:
            return state;
    }
}

export const Ex7 = () => {
    const [state,dispatch] = useReducer(reducer, {count: 0});

    return (
        <>
        count : {state.count} <br/>
        <button onClick={()=> dispatch({type:"p"})}>증가</button>
        <button onClick={()=> dispatch({type:"m"})}>감소</button>
        <button onClick={()=> dispatch({type:"r"})}>리셋</button>
        </>
    );
}
export default Ex7;
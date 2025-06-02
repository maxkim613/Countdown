import { useDispatch } from 'react-redux';
import { useLoginMutation, userLoginMutation } from './features/user/UserApi'
import { setUser } from './features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
const Ex10 = () => {

    const [userId, setUserId] = useState("");
    const userIdRef = useRef(null);
    const [password, setPassword] = useState("");
    const passwordRef = useRef(null);
    

    const [login] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLoginClick = async () => {
        try{
            if(!userId || userId === ""){
                alert("ID를 입력해주세요.");
                userIdRef.current?.focus();
                return;
            }
            if(!password || password === ""){
                alert("비밀번호를 입력해주세요.");
                passwordRef.current?.focus();
                return;
            }
            const response = await login({userId,password}).unwrap();
            if(response.success) {
                alert("로그인 성공 홈으로 이동합니다.");
                dispatch(setUser(response.data));
                navigate("/");
            } else {

                alert("1로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
            }
         } catch {
             alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
         }
    };
    return (
        <>
        ID: <input 
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        ref={userIdRef}/>
        <br/>
        PASSWORD: <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ref={passwordRef}/>
        <br/>
            <button type='button'
            onClick={handleLoginClick}>
                로그인
            </button>
        </>
    );
}
export default Ex10;
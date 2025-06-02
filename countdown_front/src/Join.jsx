import { useDispatch } from 'react-redux';
import { useRegisterMutation } from './features/user/UserApi'
import { setUser } from './features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
const Join = () => {

    const [userId, setUserId] = useState("");
    const userIdRef = useRef(null);
    const [password, setPassword] = useState("");
    const passwordRef = useRef(null);
    const [username, setUsername] = useState("");
    const usernameRef = useRef(null);
    const [email, setEmail] = useState("");
    const emailRef = useRef(null);
    

    const [register] = useRegisterMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleRegisterClick = async () => {
        try{
            
            const response = await register({userId,password,username,email}).unwrap();
            if(response.success) {
                alert("성공 홈으로 이동합니다.");
                dispatch(setUser(response.data));
                navigate("/");
            } else {

                alert("실패했습니다. 아이디와 비밀번호를 확인해주세요.");
            }
         } catch {
             alert("실패했습니다. 아이디와 비밀번호를 확인해주세요.");
         }
    };
    return (
        <>
        ID: <input 
        type="text"
        onChange={(e) => setUserId(e.target.value)}
        ref={userIdRef}/>
        <br/>
        PASSWORD: <input 
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        ref={passwordRef}/>
        <br/>
        이름: <input 
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        ref={usernameRef}/>
        <br/>
        EMAIL: <input 
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}/>
        <br/>
            <button type='button'
            onClick={handleRegisterClick}>
                회원가입
            </button>
        </>
    );
}
export default Join;
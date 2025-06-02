import { useViewQuery} from './features/user/UserApi'
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const View = () => {
    const {data, isLoading, error, isSuccess} = useViewQuery({});
    const [userInfo, setUserInfo] = useState(null);
   const navigate = useNavigate();

    useEffect(() => {
        if(isSuccess) {
            setUserInfo(data?.data);
        }
    }, [isSuccess, data]);
    return (
        <>
        아이디 : {userInfo?.userId} <br/>
        이름 : {userInfo?.username} <br/>
        이메일 : {userInfo?.email} <br/>
        <button onClick={() => navigate('/Update')}>회원정보수정</button>
        </>
    );
}
export default View;
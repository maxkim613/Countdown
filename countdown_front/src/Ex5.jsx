
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
const Ex5 = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const id2 = searchParams.getAll('id');
    return (
        <>
            파라미터 넘기는 예제 : id: {id} id2: {id2} 
        </>
    );
}

export default Ex5;
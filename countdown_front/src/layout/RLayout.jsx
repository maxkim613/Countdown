import React from 'react';
import Header from './H'
import Footer from './F'
import { Outlet } from 'react-router-dom';

const RLayout = ({ children }) => {

    return (
        <div>
            <Header/>
            RLayout
            <Outlet/>            
            <Footer/>
        </div>
    );
};

export default RLayout;
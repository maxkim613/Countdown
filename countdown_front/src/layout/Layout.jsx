import React from 'react';
import Header from './H'
import Footer from './F'

const Layout = ({ children }) => {

    return (
        <div>
            <Header/>
            <div>{children}</div>
            <Footer/>
        </div>
    );
};

export default Layout;
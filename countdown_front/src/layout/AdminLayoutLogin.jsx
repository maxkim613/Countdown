// src/components/Layout.jsx
import React from 'react';
import Header from './AdminHeader';
import Footer from './AdminFooter';
import { useCmDialog } from '../cm/CmDialogUtil';  

const AdminLayoutLogin = ({ children }) => {
     const { DialogComponent } = useCmDialog();
  return (
    <div className="layout">
      <Header />
      <main style={{ padding: '0px'}}>{children}</main>
      <Footer />
      {DialogComponent}
    </div>
  );
};

export default AdminLayoutLogin;

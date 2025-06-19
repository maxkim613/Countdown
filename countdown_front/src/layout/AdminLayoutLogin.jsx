// src/components/Layout.jsx
import React from 'react';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import { useCmDialog } from '../cm/CmDialogUtil';  

const AdminLayoutLogin = ({ children }) => {
     const { DialogComponent } = useCmDialog();
  return (
    <div className="layout">
      <AdminHeader />
      <main style={{ padding: '0px'}}>{children}</main>
      <AdminFooter />
      {DialogComponent}
    </div>
  );
};

export default AdminLayoutLogin;

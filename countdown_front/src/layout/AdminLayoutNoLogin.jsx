// src/components/Layout.jsx
import React from 'react';
import { useCmDialog } from '../cm/CmDialogUtil';  

const AdminLayoutNoLogin = ({ children }) => {
     const { DialogComponent } = useCmDialog();
  return (
    <div className="layout">
      <main style={{ padding: '0px' }}>{children}{DialogComponent}</main>
    </div>
  );
};

export default AdminLayoutNoLogin;

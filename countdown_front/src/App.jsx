import './App.css';

import React, { useEffect } from 'react';
import {  Routes, Route, useNavigate } from 'react-router-dom';
import Login from './page/user/Login';
import Register from './page/user/Register';
import UserUpdate from './page/user/UserUpdate';
import UserView from './page/user/UserView';
import BoardList from './page/board/BoardList';
import BoardView from './page/board/BoardView';
import BoardCreate from './page/board/BoardCreate';
import BoardUpdate from './page/board/BoardUpdate';

import AuctionList from './page/auction/AuctionList';
import AuctionMyList from './page/auction/AuctionMyList';
import AuctionCreate from './page/auction/AuctionCreate';
import AuctionUpdate from './page/auction/AuctionUpdate';
import AuctionView from './page/auction/AuctionView';
import AuctionAdminList from './page/auction/AuctionAdminList';
import AuctionAdminView from './page/auction/AuctionAdminView';

import AnnouncementList from './page/announcement/AnnouncementList';
import AnnouncementCreate from './page/announcement/AnnouncementCreate';
import AnnouncementUpdate from './page/announcement/AnnouncementUpdate';
import AnnouncementView from './page/announcement/AnnouncementView';
import UserAnnList from './page/announcement/UserAnnList';
import UserAnnView from './page/announcement/UserAnnView';

import Home from './page/Home';
import { setNavigate } from './cm/CmNavigateUtil';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';
import AdminLayoutLogin from './layout/AdminLayoutLogin';
import AdminLayoutNoLogin from './layout/AdminLayoutNoLogin';

import NewBoardList from './page/newBoard/NewBoardList';
import NewBoardCreate from './page/newBoard/NewBoardCreate';
import UserList from './page/user/UserList';
import CmRouteChangeNotifier from './cm/CmRouteChangeNotifier';

import FindId from './page/user/FindId';
import ResetPassword from './page/user/ResetPassword';

import AdminDashboard from './page/manager/AdminDashboard';
import AdminUserList from './page/manager/AdminUserList';
import AdminUserview from './page/manager/AdminUserview';
import AuctionBid from './page/auction/AuctionBid';
import AuctionBuynow from './page/auction/AuctionBuynow';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <>
      <Routes>
         <Route path="/user/login.do" element={<LayoutNoLogin><Login /></LayoutNoLogin>} />
         <Route path="/" element={<LayoutLogin><Home /></LayoutLogin>} />
         <Route path="/user/join.do" element={<LayoutNoLogin><Register /></LayoutNoLogin>} />
         <Route path="/user/update.do" element={<LayoutLogin><UserUpdate /></LayoutLogin>} />
         <Route path="/user/view.do" element={<LayoutLogin><UserView /></LayoutLogin>} />
         <Route path="/user/list.do" element={<LayoutLogin><UserList /></LayoutLogin>} />

        <Route path="/user/findId.do" element={<LayoutNoLogin><FindId /></LayoutNoLogin>} />
        <Route path="/user/rpassword.do" element={<LayoutNoLogin><ResetPassword /></LayoutNoLogin>} />


        <Route path="/board/list.do" element={<LayoutLogin><BoardList /></LayoutLogin>} />
        <Route path="/board/view.do" element={<LayoutLogin><BoardView /></LayoutLogin>} />
        <Route path="/board/create.do" element={<LayoutLogin><BoardCreate /></LayoutLogin>} />
        <Route path="/board/update.do" element={<LayoutLogin><BoardUpdate /></LayoutLogin>} />


        <Route path="/newBoard/create.do" element={<LayoutLogin><NewBoardCreate /></LayoutLogin>} />
        <Route path="/newBoard/list.do" element={<LayoutLogin><NewBoardList /></LayoutLogin>} />
        
        <Route path="/user/list.do" element={<LayoutLogin><UserList /></LayoutLogin>} />
        
        <Route path="/auc/auclist.do" element={<LayoutLogin><AuctionList /></LayoutLogin>} />
        <Route path="/auc/aucmylist.do" element={<LayoutLogin><AuctionList /></LayoutLogin>} />
        <Route path="/auc/auccreate.do" element={<LayoutLogin><AuctionCreate /></LayoutLogin>} />
        <Route path="/auc/aucview.do" element={<LayoutLogin><AuctionView /></LayoutLogin>} />
        <Route path="/auc/aucupdate.do" element={<LayoutLogin><AuctionUpdate /></LayoutLogin>} />
        <Route path="/auc/aucbid.do" element={<LayoutLogin><AuctionBid /></LayoutLogin>} />
        <Route path="/auc/aucbuynow.do" element={<LayoutLogin><AuctionBuynow /></LayoutLogin>} />
        <Route path="/auc/aucmybidlist.do" element={<LayoutLogin><AuctionMyBidList/></LayoutLogin>} />
        <Route path="/auc/aucmyselllist.do" element={<LayoutLogin><AuctionMySellList/></LayoutLogin>} />
        <Route path="/auc/admauclist.do" element={<LayoutLogin><AuctionAdminList /></LayoutLogin>} />
        <Route path="/auc/admaucview.do" element={<LayoutLogin><AuctionAdminView /></LayoutLogin>} />

        
        <Route path="/ann/annview.do" element={<AdminLayoutNoLogin><AnnouncementView /></AdminLayoutNoLogin>} />
        <Route path="/ann/anncreate.do" element={<AdminLayoutNoLogin><AnnouncementCreate /></AdminLayoutNoLogin>} />
        <Route path="/ann/annupdate.do" element={<AdminLayoutNoLogin><AnnouncementUpdate /></AdminLayoutNoLogin>} />
        <Route path="/ann/annlist.do" element={<AdminLayoutNoLogin><AnnouncementList /></AdminLayoutNoLogin>} />
        <Route path="/ann/userannlist.do" element={<AdminLayoutNoLogin><UserAnnList /></AdminLayoutNoLogin>} />
        <Route path="/ann/userannview.do" element={<AdminLayoutNoLogin><UserAnnView /></AdminLayoutNoLogin>} />

        <Route path="/user/findId.do" element={<LayoutNoLogin><FindId /></LayoutNoLogin>} />
        <Route path="/user/rpassword.do" element={<LayoutNoLogin><ResetPassword /></LayoutNoLogin>} />

         <Route path="/manager/admin" element={<AdminLayoutNoLogin><AdminDashboard /></AdminLayoutNoLogin>} />
        <Route path="/manager/alist" element={<AdminLayoutLogin><AdminUserList /></AdminLayoutLogin>} />
       <Route path="/manager/user/:userId" element={<AdminLayoutNoLogin><AdminUserview /></AdminLayoutNoLogin>} />

      </Routes>
      <CmRouteChangeNotifier />
    </>
      
      
  );
};

export default App;

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
import AuctionCreate from './page/auction/AuctionCreate';
import AuctionUpdate from './page/auction/AuctionUpdate';
import AuctionView from './page/auction/AuctionView';

import AnnouncementList from './page/announcement/AnnouncementList';
import AnnouncementCreate from './page/announcement/AnnouncementCreate';
import AnnouncementUpdate from './page/announcement/AnnouncementUpdate';
import AnnouncementDelete from './page/announcement/AnnouncementDelete';
import AnnouncementView from './page/announcement/AnnouncementView';

import Home from './page/Home';
import { setNavigate } from './cm/CmNavigateUtil';
import LayoutLogin from './layout/LayoutLogin';
import LayoutNoLogin from './layout/LayoutNoLogin';

import NewBoardList from './page/newBoard/NewBoardList';
import NewBoardCreate from './page/newBoard/NewBoardCreate';
import UserList from './page/user/UserList';
import CmRouteChangeNotifier from './cm/CmRouteChangeNotifier';

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
        <Route path="/board/list.do" element={<LayoutLogin><BoardList /></LayoutLogin>} />
        <Route path="/board/view.do" element={<LayoutLogin><BoardView /></LayoutLogin>} />
        <Route path="/board/create.do" element={<LayoutLogin><BoardCreate /></LayoutLogin>} />
        <Route path="/board/update.do" element={<LayoutLogin><BoardUpdate /></LayoutLogin>} />
        <Route path="/newBoard/create.do" element={<LayoutLogin><NewBoardCreate /></LayoutLogin>} />
        <Route path="/newBoard/list.do" element={<LayoutLogin><NewBoardList /></LayoutLogin>} />
        <Route path="/user/list.do" element={<LayoutLogin><UserList /></LayoutLogin>} />
        <Route path="/auc/auclist.do" element={<LayoutLogin><AuctionList /></LayoutLogin>} />
        <Route path="/auc/auccreate.do" element={<LayoutLogin><AuctionCreate /></LayoutLogin>} />
        <Route path="/auc/aucview.do" element={<LayoutLogin><AuctionView /></LayoutLogin>} />
        <Route path="/ann/annview.do" element={<LayoutLogin><AnnouncementView /></LayoutLogin>} />
        <Route path="/ann/anncreate.do" element={<LayoutLogin><AnnouncementCreate /></LayoutLogin>} />
        <Route path="/ann/annupdate.do" element={<LayoutLogin><AnnouncementUpdate /></LayoutLogin>} />
        <Route path="/ann/anndelete.do" element={<LayoutLogin><AnnouncementDelete /></LayoutLogin>} />
        <Route path="/ann/annlist.do" element={<LayoutLogin><AnnouncementList /></LayoutLogin>} />
      </Routes>
      <CmRouteChangeNotifier />
    </>
      
      
  );
};

export default App;

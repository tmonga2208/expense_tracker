import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import DashboardPage from './pages/dashboard';
import SignUpPage from './pages/SignupPage';
import FriendsPage from './pages/friends';
import UserProfile from './pages/userPage';
import ExpenseDetails from './components/detailspage';
import ExpenseCategories from './pages/categories';
import TransactionsPage from './pages/transactionPage';


const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
          <Routes>
              <Route index element={<HomePage />} />
              <Route path='/' element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard' element={<DashboardPage/>} />
        <Route path="/signup" element={<SignUpPage />} />  
        <Route path='/friends' element={<FriendsPage />} />
        <Route path='/account' element={<UserProfile />} />
        <Route path='/history' element={<ExpenseDetails />} />
        <Route path='/categories' element={<ExpenseCategories />} />
        <Route path='/viewall' element={<TransactionsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
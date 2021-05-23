import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import AdminLogin from '../components/Admin/AdminLogin/AdminLogin';
import AdminPanel from '../components/Admin/AdminPanel/AdminPanel';
import UserLogin from '../components/User/UserLogin/UserLogin';
import UserPanel from '../components/User/UserPanel/UserPanel';
import UserSignUp from '../components/User/UserSignUp/UserSignUp';

const Routes = () => {
	return (
		<BrowserRouter>
			<Route path="/" exact>
				<UserLogin />
			</Route>
			<Route path="/usersignup">
				<UserSignUp />
			</Route>
			<Route path="/userdashboard">
				<UserPanel />
			</Route>
			<Route path="/adminsignin">
				<AdminLogin />
			</Route>
			<Route path="/admindashboard">
				<AdminPanel />
			</Route>
		</BrowserRouter>
	);
};

export default Routes;

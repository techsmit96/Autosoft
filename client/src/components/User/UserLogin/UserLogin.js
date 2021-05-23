import React from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
} from 'react-bootstrap';
import useForm from './UserLoginForm';
import styles from './UserLogin.module.css';

const UserLogin = () => {
	const { handleChange, data, handleSubmit } = useForm();

	return (
		<Form className={styles.login_form}>
			<h1>
				<span className="font-weight-bold">LogIn</span>Page
			</h1>
			<h2 className="text-center">Welcome</h2>
			<FormGroup>
				<FormLabel>Email</FormLabel>
				<FormControl
					type="email"
					name="email"
					value={data.email}
					onChange={handleChange}
					placeholder="Enter Email"
				/>
			</FormGroup>
			<FormGroup>
				<FormLabel>Password</FormLabel>
				<FormControl
					type="password"
					name="password"
					value={data.password}
					onChange={handleChange}
					placeholder="Enter Password"
				/>
			</FormGroup>
			<Button
				type="submit"
				className="mt-2 btn-lg btn-dark col-12"
				onClick={handleSubmit}
			>
				Login
			</Button>
			<div className="text-center">
				<Link to="/usersignup">SignUp</Link>
				{/* <span className="p-2">|</span>
				<Link to="/forgot-password">Forgot Password</Link> */}
			</div>
		</Form>
	);
};

export default UserLogin;

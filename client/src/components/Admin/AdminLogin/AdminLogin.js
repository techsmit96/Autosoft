import React from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
} from 'react-bootstrap';
import useForm from './AdminLoginForm';
import styles from './AdminLogin.module.css';
const AdminLogin = () => {
	const { handleChange, data, handleSubmit } = useForm();
	return (
		<Form className={styles.login_form}>
			<h1>
				<span className="font-weight-bold">AdminLogin</span>Page
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
		</Form>
	);
};

export default AdminLogin;

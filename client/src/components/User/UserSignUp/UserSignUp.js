import React from 'react';
import { Link } from 'react-router-dom';
import {
	Button,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
} from 'react-bootstrap';
import useForm from './useFormSignUp';
import styles from './UserSignUp.module.css';

const UserSignUp = () => {
	const { handleChange, data, handleSubmit } = useForm();
	return (
		<Form className={styles.signup_form}>
			<h1>User SignUp</h1>
			<FormGroup>
				<FormLabel>Email</FormLabel>
				<FormControl
					type="email"
					name="email"
					value={data.email}
					onChange={handleChange}
					placeholder="Enter Email or username"
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
			<FormGroup>
				<FormLabel>Confirm Password</FormLabel>
				<FormControl
					type="password"
					name="cpassword"
					value={data.cpassword}
					onChange={handleChange}
					placeholder="Enter Password Again"
				/>
			</FormGroup>
			<Button
				type="submit"
				onClick={handleSubmit}
				className="mt-2 btn-lg btn-dark col-12"
			>
				SignUp
			</Button>
			<div className="text-center">
				<Link to="/">Login</Link>
			</div>
		</Form>
	);
};

export default UserSignUp;

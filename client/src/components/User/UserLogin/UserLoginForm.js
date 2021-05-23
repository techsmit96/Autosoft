import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const UserLoginForm = () => {
	const [data, setData] = useState({
		email: '',
		password: '',
	});
	let history = useHistory();
	const redirect = () => {
		history.push('/userdashboard');
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setData({ ...data, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		const { email, password } = data;

		const res = await fetch('/usersignin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		});
		if (res.status === 422 || !data) {
			window.alert('Please filled all the fields');
			console.log('Please filled all the fields');
		} else {
			window.alert('User Login Successfully');
			redirect();
			console.log('Login Successfully');
		}
	};

	return { handleChange, data, handleSubmit };
};

export default UserLoginForm;

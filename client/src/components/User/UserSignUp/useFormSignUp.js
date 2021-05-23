import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
const useFormSignUp = () => {
	const [data, setData] = useState({
		email: '',
		passsword: '',
		cpassword: '',
	});
	let history = useHistory();
	const redirect = () => {
		history.push('/');
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		setData({ ...data, [name]: value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		const { email, password, cpassword } = data;

		const res = await fetch('/usersignup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
				cpassword,
			}),
		});
		if (res.status === 422 || !data) {
			window.alert('Please filled all the fields');
			console.log('Please filled all the fields');
		} else {
			window.alert('Register Successfully');
			redirect();
			console.log('Register Successfully');
		}
	};

	return { handleChange, data, handleSubmit };
};

export default useFormSignUp;

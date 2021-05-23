import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const UserPanelForm = () => {
	const [data, setData] = useState({
		name: '',
		email: '',
		mobile: '',
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

		const { name, email, mobile } = data;

		const res = await fetch('/addmember', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				mobile,
			}),
		});
		if (res.status === 422 || !data) {
			window.alert('Please filled all the fields');
			console.log('Please filled all the fields');
		} else {
			window.alert('Register Successfully');
			const info = await res.json();
			console.log(info);
			redirect();
			console.log('Register Successfully');
		}
	};

	return { handleChange, data, handleSubmit };
};

export default UserPanelForm;

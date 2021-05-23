import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import {
	Button,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
	Modal,
	Table,
} from 'react-bootstrap';
import useForm from './UserPanelForm';
import styles from './UserPanel.module.css';

const UserPanel = () => {
	//for update model
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const { handleChange, data, handleSubmit } = useForm();
	const [members, setMembers] = useState([]);
	const [info, setInfo] = useState([]);

	const history = useHistory();
	const { id } = useParams();

	const callUserPanel = async () => {
		try {
			const res = await fetch('/userpanel', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const result = await res.json();
			// console.log(result);
			setMembers(result);
			if (!res.status === 200) {
				const error = new Error(res.error);
				throw error;
			}
		} catch (err) {
			console.log(err);
			history.push('/');
		}
	};

	//update member
	const handleUpdateChange = (e) => {
		const { name, value } = e.target;

		setInfo({ ...info, [name]: value });
	};
	const getMember = async (id) => {
		try {
			handleShow();
			const res = await fetch(`/member/${id}`, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const result = await res.json();
			console.log(result);
			setInfo(result);
			if (!res.status === 200) {
				const error = new Error(res.error);
				throw error;
			}
		} catch (err) {
			console.log(err);
			// history.push('/');
		}
	};

	const handleUpdate = async (e, id) => {
		e.preventDefault();

		const { name, email, mobile } = info;
		console.log(id);
		console.log(info);
		const res = await fetch(`/member/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				mobile,
			}),
		});
		if (res.status === 422 || !info) {
			window.alert('Please filled all the fields');
			console.log('Please filled all the fields');
		} else {
			window.alert('Update Successfully');
			const info = await res.json();
			console.log(info);
			console.log('Register Successfully');
		}
	};

	//delete member
	const deleteMember = async (id) => {
		try {
			const res = await fetch(`/member/${id}`, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const result = await res.json();

			setMembers(result);
			if (!res.status === 200) {
				const error = new Error(res.error);
				throw error;
			}
		} catch (err) {
			console.log(err);
			// history.push('/');
		}
	};

	useEffect(() => {
		callUserPanel();
	});

	return (
		<>
			<Form className={styles.approved_form}>
				<h1>
					<span className="font-weight-bold">Approval </span>Page
				</h1>
				<h2 className="text-center">Welcome</h2>
				<FormGroup>
					<FormLabel>Name</FormLabel>
					<FormControl
						type="text"
						name="name"
						value={data.name}
						onChange={handleChange}
						placeholder="Enter Your Name"
					/>
				</FormGroup>
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
					<FormLabel>Mobile</FormLabel>
					<FormControl
						type="text"
						name="mobile"
						value={data.mobile}
						onChange={handleChange}
						maxLength="10"
						placeholder="Enter Mobile Number"
					/>
				</FormGroup>
				<Button
					type="submit"
					onClick={handleSubmit}
					className="mt-2 btn-lg btn-dark col-12"
				>
					Submit
				</Button>
			</Form>
			{/* table data */}
			<Table className={styles.table_area} striped bordered hover>
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Email</th>
						<th>Mobile</th>
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{members.map((member, index) => (
						<tr key={index}>
							<td key={member._id}>{index + 1}</td>
							<td>{member.name}</td>
							<td>{member.email}</td>
							<td>{member.mobile}</td>
							<td>
								{member.verified ? (
									<span className="badge bg-success">Approved</span>
								) : (
									<span className="badge bg-primary">Pending</span>
								)}
							</td>
							<td>
								<Button
									type="submit"
									className="btn-sm"
									onClick={() => getMember(member._id)}
								>
									<PencilSquare />
								</Button>
								<Button
									variant="danger"
									type="submit"
									className="btn-sm m-2"
									onClick={() => deleteMember(member._id)}
								>
									<Trash />
								</Button>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
			{/* update modal part */}
			<Modal animation={false} show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Update Member</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form className={styles.approved_form}>
						<FormGroup>
							<FormLabel>Name</FormLabel>
							<FormControl
								type="text"
								name="name"
								defaultValue={info.name}
								onChange={handleUpdateChange}
								placeholder="Enter Your Name"
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>Email</FormLabel>
							<FormControl
								type="email"
								name="email"
								defaultValue={info.email}
								onChange={handleUpdateChange}
								placeholder="Enter Email"
							/>
						</FormGroup>
						<FormGroup>
							<FormLabel>Mobile</FormLabel>
							<FormControl
								type="text"
								name="mobile"
								defaultValue={info.mobile}
								onChange={handleUpdateChange}
								maxLength="10"
								placeholder="Enter Mobile Number"
							/>
						</FormGroup>
						<Button
							type="submit"
							onClick={(e) => handleUpdate(e, info._id)}
							className="mt-2 btn-lg btn-dark col-12"
						>
							Update
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default UserPanel;

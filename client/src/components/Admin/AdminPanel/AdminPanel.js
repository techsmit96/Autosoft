import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { PencilSquare, Trash } from 'react-bootstrap-icons';
import {
	Button,
	Col,
	Card,
	CardDeck,
	Form,
	FormControl,
	FormGroup,
	FormLabel,
	Table,
	Modal,
	Row,
} from 'react-bootstrap';
import styles from './AdminPanel.module.css';
const AdminPanel = () => {
	//for update model
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [members, setMembers] = useState([]);
	const [verified, setVerified] = useState();
	const [request, setRequest] = useState();
	const [info, setInfo] = useState([]);
	const { id } = useParams();

	const getMember = async (id) => {
		try {
			handleShow();
			const res = await fetch(`/adminmember/${id}`, {
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

	//delete member
	const deleteMember = async (id) => {
		try {
			const res = await fetch(`/adminmember/${id}`, {
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

	const history = useHistory();
	const callAdminPanel = async () => {
		try {
			const res = await fetch('/adminpanel', {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});
			const result = await res.json();

			//save members and verfied count
			setMembers(result[0]);
			setRequest(result[1]);
			setVerified(result[2]);
			if (!res.status === 200) {
				const error = new Error(res.error);
				throw error;
			}
		} catch (err) {
			console.log(err);
			history.push('/adminsignin');
		}
	};
	//update member
	//update member
	const handleUpdateChange = (e) => {
		const { name, value } = e.target;

		setInfo({ ...info, [name]: value });
	};

	const handleUpdate = async (e, id) => {
		e.preventDefault();

		const { verified } = info;
		console.log(id);
		console.log(info);
		const res = await fetch(`/adminmember/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				verified,
			}),
		});
		if (res.status === 422 || !info) {
			window.alert('Please filled all the fields');
			console.log('Please filled all the fields');
		} else {
			window.alert('Update Successfully');
			const info = await res.json();
			console.log(info);
			console.log('Update Successfully');
		}
	};

	useEffect(() => {
		callAdminPanel();
	});

	return (
		<>
			<CardDeck className={styles.cardgroup}>
				<Row>
					<Card as={Col} md={6}>
						<Card.Body>
							<Card.Title>Approved</Card.Title>
							<Card.Text className="text-center">{verified}</Card.Text>
						</Card.Body>
					</Card>
					<Card as={Col} md={6}>
						<Card.Body>
							<Card.Title>Request</Card.Title>
							<Card.Text className="text-center">{request}</Card.Text>
						</Card.Body>
					</Card>
				</Row>
			</CardDeck>
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
					<Form>
						<FormGroup>
							<FormLabel>Verification</FormLabel>
							<Form.Control
								as="select"
								name="verified"
								defaultValue={info.verified}
								onChange={handleUpdateChange}
							>
								<option value="true">Approved</option>
								<option value="false">Not Approved</option>
							</Form.Control>
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

export default AdminPanel;

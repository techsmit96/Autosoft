const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const AdminAuth = require('../middlewares/adminAuthenticate');
const UserAuth = require('../middlewares/userAuthenticate');
const cookieParser = require('cookie-parser');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

router.use(cookieParser());
//load model
const User = require('../model/userSchema');
const Admin = require('../model/adminSchema');
const Member = require('../model/memberSchema');

router.get('/', (req, res) => {
	res.send('Hiii');
});

//Users route

router.post(
	'/usersignup',
	[
		check('email', 'Please enter valid email id').trim().isEmail(),
		check('password', 'Password must be in 6 character')
			.trim()
			.isLength({ min: 6 }),
		check('cpassword').custom((value, { req }) => {
			if (value !== req.body.cpassword) {
				throw new Error('Password confirmation does not match password');
			}

			return true;
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		console.log(errors.mapped());
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: 'Please field all the field' });
		}
		const { email, password, cpassword } = req.body;
		try {
			const userExist = await User.findOne({ email: email });
			if (userExist) {
				return res.status(422).json({ error: 'Email Already Exist' });
			} else if (password !== cpassword) {
				return res.status(400).json({ error: 'Password not matched' });
			} else {
				const user = new User({ email, password, cpassword });
				await user.save();
				res.status(200).json({ message: 'User Registered Successfully' });
			}
		} catch (err) {
			console.log(err);
		}
	}
);

router.post(
	'/usersignin',
	[
		check('email', 'Please enter valid email id').trim().isEmail(),
		check('password', 'Password must be in 6 character')
			.trim()
			.isLength({ min: 6 }),
	],
	async (req, res) => {
		try {
			const { email, password } = req.body;
			const errors = validationResult(req);
			console.log(errors.mapped());
			if (!errors.isEmpty()) {
				return res.status(422).json({ error: 'Please field all the field' });
			}
			const userLogin = await User.findOne({ email: email });
			if (userLogin) {
				const isMatch = await bcrypt.compare(password, userLogin.password);

				if (!isMatch) {
					return res.status(400).json({ error: 'Invalid Credentials ' });
				} else {
					const token = await userLogin.generateAuthToken();
					console.log(token);
					res.cookie('userjwttoken', token, {
						expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
						httpOnly: true,
					});
					return res.json({ message: 'User SignIn Successfully' });
				}
			} else {
				return res.status(400).json({ error: 'Invalid Credentials ' });
			}
		} catch (err) {
			console.log(err);
		}
	}
);

//Admin route
router.post(
	'/adminsignup',
	[
		check('email', 'Please enter valid email id').trim().isEmail(),
		check('password', 'Password must be in 6 character')
			.trim()
			.isLength({ min: 3 }),
		check('cpassword').custom((value, { req }) => {
			if (value !== req.body.cpassword) {
				throw new Error('Password confirmation does not match password');
			}

			return true;
		}),
	],
	async (req, res) => {
		const { email, password, cpassword } = req.body;
		const errors = validationResult(req);
		console.log(errors.mapped());
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: 'Please field all the field' });
		}
		try {
			const adminExist = await Admin.findOne({ email: email });
			if (adminExist) {
				return res.status(422).json({ error: 'Email Already Exist' });
			} else {
				const admin = new Admin({ email, password, cpassword });
				await admin.save();
				res.status(200).json({ message: 'Admin Registered Successfully' });
			}
		} catch (err) {
			console.log(err);
		}
	}
);

router.post(
	'/adminsignin',
	[
		check('email', 'Please enter valid email id').trim().isEmail(),
		check('password', 'Password must be in 6 character')
			.trim()
			.isLength({ min: 3 }),
	],
	async (req, res) => {
		try {
			const { email, password } = req.body;
			const errors = validationResult(req);
			console.log(errors.mapped());
			if (!errors.isEmpty()) {
				return res.status(422).json({ error: 'Please field all the field' });
			}
			const adminLogin = await Admin.findOne({ email: email });
			if (adminLogin) {
				const isMatch = await bcrypt.compare(password, adminLogin.password);

				if (!isMatch) {
					return res.status(400).json({ error: 'Invalid Credentials ' });
				} else {
					const token = await adminLogin.generateAuthToken();
					console.log(token);
					res.cookie('adminjwttoken', token, {
						expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
						httpOnly: true,
					});
					return res.json({ message: 'Admin SignIn Successfully' });
				}
			} else {
				return res.status(400).json({ error: 'Invalid Credentials ' });
			}
		} catch (err) {
			console.log(err);
		}
	}
);

router.patch('/updateadmin/:id', async (req, res) => {
	try {
		const id = req.params.id;
		const adminUpdate = await Admin.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.send(adminUpdate);
	} catch (err) {
		return res.status(400).send(err);
	}
});

//User Dashboard with authorization
router.get('/userpanel', UserAuth, async (req, res) => {
	try {
		const memberExist = await Member.find();
		res.send(memberExist);
	} catch (error) {
		console.log('No data');
	}
	// res.send(req.rootUser);
});

router.post(
	'/addmember',
	[
		check('email', 'Please enter valid email id').trim().isEmail(),
		check('name', 'Please enter valid email id').notEmpty(),
		check('mobile', 'Please enter valid mobile').isInt(),
	],
	UserAuth,
	async (req, res) => {
		const { name, email, mobile } = req.body;
		const errors = validationResult(req);
		console.log(errors.mapped());
		if (!errors.isEmpty()) {
			return res.status(422).json({ error: 'Please field all the field' });
		}

		try {
			const memberExist = await Member.findOne({ email: email });
			if (memberExist) {
				return res.status(422).json({ error: 'Email Already Exist' });
			} else {
				const member = new Member({ name, email, mobile });
				await member.save();
				res.status(200).json({ message: 'Member send for approval' });
			}
		} catch (err) {
			console.log(err);
		}
	}
);

router.get('/member/:id', UserAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const memberExist = await Member.findById(id);
		res.send(memberExist);
	} catch (error) {
		console.log('No data');
	}
	// res.send(req.rootUser);
});

router.patch('/member/:id', UserAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const memberUpdate = await Member.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.send(memberUpdate);
	} catch (err) {
		return res.status(400).send(err);
	}
});
router.delete('/member/:id', UserAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const memberDelete = await Member.findByIdAndDelete(id);
		res.send('Member Delete Successfully');
	} catch (err) {
		return res.status(400).send('Wrong ID ');
	}
});

//Admin Dashboard with authorization
router.get('/adminpanel', AdminAuth, async (req, res) => {
	try {
		const memberExist = await Member.find();
		const v = await Member.count({ verified: false });
		const r = await Member.count({ verified: true });
		res.send([memberExist, v, r]);
	} catch (error) {
		console.log(error);
	}
});
router.get('/adminmember/:id', AdminAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const memberExist = await Member.findById(id);
		res.send(memberExist);
	} catch (error) {
		console.log('No data');
	}
	// res.send(req.rootUser);
});
router.patch('/adminmember/:id', AdminAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const memberUpdate = await Member.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		if (memberUpdate.verified) {
			let testAccount = await nodemailer.createTestAccount();

			// create reusable transporter object using the default SMTP transport
			let transporter = nodemailer.createTransport({
				host: 'smtp.ethereal.email',
				port: 587,
				secure: false, // true for 465, false for other ports
				auth: {
					user: testAccount.user, // generated ethereal user
					pass: testAccount.pass, // generated ethereal password
				},
			});

			// send mail with defined transport object
			let info = await transporter.sendMail({
				from: '<info@autosoft.com>', // sender address
				to: [memberUpdate.email], // list of receivers
				subject: 'regarding Verfication ✔', // Subject line
				html: '<b>You are verified</b>', // html body
			});
			if (info.messageId) {
				console.log('email sent');
			} else {
				console.log('Email not sent');
			}
			console.log('Message sent: %s', info.messageId);

			console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
		} else {
			console.log('User Not Verified');
		}

		res.send(memberUpdate);
	} catch (err) {
		return res.status(400).send(err);
	}
});
router.delete('/adminmember/:id', AdminAuth, async (req, res) => {
	try {
		const id = req.params.id;
		const memberDelete = await Member.findByIdAndDelete(id);
		res.send('Member Delete Successfully');
	} catch (err) {
		return res.status(400).send('Wrong ID ');
	}
});
module.exports = router;

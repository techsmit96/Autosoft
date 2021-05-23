const jwt = require('jsonwebtoken');
const Admin = require('../model/adminSchema');

const AdminAuthenticate = async (req, res, next) => {
	try {
		const token = req.cookies.adminjwttoken;
		const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

		const rootAdmin = await Admin.findOne({
			_id: verifyToken._id,
			'tokens.token': token,
		});
		if (!rootAdmin) {
			throw new Error('Admin Not Found');
		}

		req.token = token;
		req.rootAdmin = rootAdmin;
		req.userID = rootAdmin._id;

		next();
	} catch (err) {
		res.status(401).send('Unauthorized:No token provided');
		console.log(err);
	}
};

module.exports = AdminAuthenticate;

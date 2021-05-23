const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	mobile: {
		type: Number,
		required: true,
	},
	verified: {
		type: Boolean,
		required: true,
		default: false,
	},
});

const memberDB = mongoose.model('MEMBER', memberSchema);
module.exports = memberDB;

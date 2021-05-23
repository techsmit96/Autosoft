const mongoose = require('mongoose');

const connectDB = async () => {
	try {
		//mongodb connection string
		const con = await mongoose.connect(process.env.DATABASE, {
			useCreateIndex: true,
			useFindAndModify: false,
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connection Successfull');
	} catch (e) {
		console.log('No Connection');
	}
};

module.exports = connectDB;

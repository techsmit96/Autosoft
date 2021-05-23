const dotenv = require('dotenv');
const express = require('express');
const app = express();
const connectDB = require('./db/conn');
//env variable
dotenv.config({ path: './config.env' });
//mongoDB connection
connectDB();

app.use(express.json());

//load routers
app.use(require('./router/auth'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log('Server is running port no 3001');
});

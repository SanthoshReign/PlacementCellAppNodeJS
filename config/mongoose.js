const mongoose = require('mongoose');
const dotenv  = require('dotenv');
dotenv.config();

const DB = process.env.MONGODB_URL;

mongoose.connect(DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	console.log('Mongodb Connected Established')
}).catch((err) => {
	console.log("connection problem ", err)
})

const db = mongoose.connection;

module.exports = mongoose;

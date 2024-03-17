const User = require('../models/userSchema');
const Student = require('../models/studentSchema');
const fs = require('fs');
const fastcsv = require('fast-csv');

//render function is used to include dynamic content-- ejs(html file)
// render sign up page
module.exports.signup = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('back');
	}
	res.render('signup');
};

// render sign in page
module.exports.signin = (req, res) => {
	if (req.isAuthenticated()) {
		return res.redirect('back');
	}
	res.render('signin');
};

// create session
module.exports.createSession =  (req, res) => {
	console.log('Session created successfully');
	return res.redirect('/');
};

// signout
module.exports.signout = (req, res) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
	});
	return res.redirect('/users/signin');
};

// create user
module.exports.createUser = async  (req, res) => {
	const { name, email, password, confirmPassword } = req.body;
	try {
		if (password !== confirmPassword) {
			console.log(`Password not matched`);
			return res.redirect('back');
		}
		const user = await User.findOne({ email });

		//Each user can have only one email(Email id is unique)
		if (user) {
			console.log(`Email already exists`);
			return res.redirect('back');
		}

		const newUser = await User.create({
			name,
			email,
			password,
		});

		await newUser.save();

		if (!newUser) {
			console.log(`Error in creating user`);
			return res.redirect('back');
		}

		return res.redirect('/users/signin');
	} catch (error) {
		console.log(`Error in creating user: ${error}`);
		res.redirect('back');
	}
};

// download report
module.exports.downloadCsv = async function (req, res) {
	try {
		const students = await Student.find({});

		let data = '';
		let no = 1;
		let csv = 'S.No, Name, Email, College, Placemnt, Contact Number, Batch, DSA Score, WebDev Score, React Score, Interview, Date, Result';

		for (let student of students) {
			data =
				no + 
				',' + "	" +
				student.name +
				',' + " " +
				student.email +
				',' + " " +
				student.college +
				',' + " " +
				student.placement +
				',' + " " +
				student.contactNumber +
				',' + " " +
				student.batch +
				',' + " " +
				student.dsa +
				',' + " " +
				student.webd +
				',' + " " +
				student.react;

			if (student.interviews.length > 0) {
				for (let interview of student.interviews) {
					data += ','  + interview.company + ',' + interview.date.toString() + ',' + interview.result;
				}
			}
			no++;
			csv += '\n' + data;
		}

		const dataFile = fs.writeFile('report/data.csv', csv, function (error, data) {
			if (error) {
				console.log(error);
				return res.redirect('back');
			}
			console.log('Report generated successfully');
			return res.download('report/data.csv');
		});
	} catch (error) {
		console.log(`Error in downloading file: ${error}`);
		return res.redirect('back');
	}
};

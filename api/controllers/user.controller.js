const userService = require('../services/user.service');


exports.createUser = async function (req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if(!username || !password) {
		return res.status(400).json({
			message: 'Invalid username or password.',
			status: false
		})
	}

	try {
		let result = await userService.createUser(username, password);
		return res.status(201).json({
			message: result,
			status: true
		})
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: false
		})
	}
}

exports.auth = async function (req, res) {
	let username = req.body.username;
	let password = req.body.password;

	if(!username || !password) {
		return res.status(400).json({
			message: 'Invalid username or password.',
			status: false
		})
	}

	try {
		let result = await userService.auth(username, password);
		return res.status(200).json({
			message: result,
			status: true
		})
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: false
		})
	}
}
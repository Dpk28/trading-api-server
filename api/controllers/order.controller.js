const orderService = require('../services/order.service');

exports.createOrder = async function(req, res) {
	let side = req.body.side;
	let price = req.body.price;
	let amount = req.body.amount;
	let username = req.body.username;

	if(!side || !price || !amount || !username) {
		return res.status(400).json({
			message: 'Invalid parameters.',
			status: false
		})
	}

	try {
		let result = await orderService.createOrder(side, price, amount, username);
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

exports.getAllOrders = async function (req, res) {
	try {
		let orders = await orderService.getAllOrders();
		return res.status(200).json({
			message: orders,
			status: true
		})
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: false
		})
	}
}

exports.getOrderCounts = async function (req, res) {
	try {
		let result = await orderService.getOrderCounts();
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
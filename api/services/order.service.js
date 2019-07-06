const orderModel = require('../models/order');
const tradeService = require('./trade.service');

const ShortUniqueId = require('short-unique-id');
const uid = new ShortUniqueId();

//Add new order to the database
exports.createOrder = function (side, price, amount, username) {
	return new Promise(async (resolve, reject) => {
		let order = new orderModel({
			timestamp: new Date().getTime(),
			orderID: uid.randomUUID(8),
			side: side,
			price: price,
			amount: amount,
			username: username,
		});

		order.save((err, savedOrder) => {
			if(err) {
				reject(err.message);
			} else {
				resolve('Order placed successfully.');
			}
		})

		try {
			let orders = await tradeService.matchMarketOrder();
			console.log(orders);
		} catch(err) {
			console.log(err)
		}
	})
}

//Get all the orders from the database
exports.getAllOrders = function () {
	return new Promise((resolve, reject) => {
		orderModel.find({}, (err, orders) => {
			if(err) {
				reject(err);
			} else {
				resolve(orders);
			}
		})
	})
}

//Delete order from the system
exports.deleteOrderById = function (orderID) {
	return new Promise((resolve, reject) => {
		orderModel.deleteOne({orderID: orderID}, (err) => {
			if(err) {
				reject(err.message);
			} else {
				resolve('Order deleted successfully.');
			}
		})
	})
}

//Get order details from the database by id
exports.getOrderById = function (orderID) {
	return new Promise((resolve, reject) => {
		orderModel.find({orderID: orderID}, (err, order) => {
			if(err) {
				reject(err.message);
			} else {
				resolve(order);
			}
		})
	})
}

//Get counts of sell and buy orders
exports.getOrderCounts = function (orderID) {
	return new Promise((resolve, reject) => {
		orderModel.countDocuments({side: 'buy'}, ( err, buyCount) => {
		    if(err) {
		    	reject(err);
		    } 

		    orderModel.count({side: 'sell'}, ( err, sellCount) => {
			    if(err) {
			    	reject(err);
			    } 

			    resolve({buyOrders: buyCount, sellOrders: sellCount});
			})

		})
	})
}
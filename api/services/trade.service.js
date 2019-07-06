const orderModel = require('../models/order');
const tradeModel = require('../models/trade');
const orderService = require('./order.service');
const socket = require('../../socket.js');
const mongoose = require('mongoose');

const side = {
	BUY: 'buy',
	SELL: 'sell'
}

const status = {
	COMPLETED: 'completed',
	PENDING: 'pending',
	PARTIALLY: 'partially completed'
}

exports.matchMarketOrder = function () {
	return new Promise((resolve, reject) => {
		orderModel.find({}).sort({
			price: -1,
			timestamp: 1
		}).exec((err, docs) => {
			if (err) {
				reject(err);
			}

			//get all the buy and sell orders by its type(sell or buy)
			Promise.all([getOrdersBySide(side.BUY), getOrdersBySide(side.SELL)]).then(async(orders) => {
				let buyOrders = orders[0];
				let sellOrders = orders[1];
				let buyIndex = 0;
				let sellIndex = 0;

				//Start mongodb transaction session 
				const session = await mongoose.startSession();
				session.startTransaction();

				if(buyOrders.length > 0) {
					let remaining = buyOrders[buyIndex].amount;
				}

				while (buyIndex < buyOrders.length && sellIndex < sellOrders.length) {
					remaining = remaining - sellOrders[sellIndex].amount;
					try {
						if (remaining > 0) {
							await Promise.all([
								updateOrder(sellOrders[sellIndex].orderID, status.COMPLETED, 0),
								updateOrder(buyOrders[buyIndex].orderID, status.PARTIALLY, remaining)
							]);

							await saveTrade(buyOrders[buyIndex].orderID, sellOrders[sellIndex].orderID, sellOrders[sellIndex].amount, sellOrders[sellIndex].price);
							++sellIndex;

						} else if (remaining < 0) {
							await Promise.all([
								updateOrder(sellOrders[sellIndex].orderID, status.PARTIALLY, Math.abs(remaining)),
								updateOrder(buyOrders[buyIndex].orderID, status.COMPLETED, 0)
							]);

							await saveTrade(buyOrders[buyIndex].orderID, sellOrders[sellIndex].orderID, buyOrders[buyIndex].amount, sellOrders[sellIndex].price);
							sellOrders[sellIndex].amount = Math.abs(remaining);

							++buyIndex;
							if(buyIndex === buyOrders.length) { break; }
							remaining = buyOrders[buyIndex].amount;

							continue;

						} else {
							await Promise.all([
								updateOrder(sellOrders[sellIndex].orderID, status.COMPLETED, 0),
								updateOrder(buyOrders[buyIndex].orderID, status.COMPLETED, 0)
							]);

							await saveTrade(buyOrders[buyIndex].orderID, sellOrders[sellIndex].orderID, buyOrders[buyIndex].amount, sellOrders[sellIndex].price);
							++sellIndex;
							++buyIndex;
							if(buyIndex === buyOrders.length) { break; }
							remaining = buyOrders[buyIndex].amount;

							continue;
						}
					} catch (err) {
						//Rollback database state changes.
						await session.abortTransaction();
						session.endSession();

						reject(err);
					}
				}

				//Commit the transaction when all the database operations performed successfully.
				await session.commitTransaction();
				session.endSession();

				//Send updated order book as an event using socket
				let ordersDetails = await Promise.all([
					orderService.getAllOrders(),
					orderService.getOrderCounts(),
					exports.getTradeHistory()
				]);

				socket.ioObj.emit('order_book', ordersDetails);

			});

		})
	})
}

//Get order by side(Buy or Sell)
function getOrdersBySide(side) {
	return new Promise((resolve, reject) => {
		orderModel.find({
			side: side,
			status: {
				$ne: status.COMPLETED
			}
		}).sort({
			price: -1,
			timestamp: 1
		}).exec((err, orders) => {
			if (err) {
				reject(err);
			}

			resolve(orders);
		});
	});
}

//Update order amount and status by order id
function updateOrder(orderID, status, amount) {
	return new Promise((resolve, reject) => {
		orderModel.updateOne({
			orderID: orderID
		}, {
			$set: {
				status: status,
				amount: amount
			}
		}, {
			upsert: true
		}, (err, order) => {
			if (err) {
				reject(false);
			} else {
				resolve(true);
			}
		});
	});
}

//Update order amount and status by order id
function saveTrade(buyerOrderID, sellerOrderID, amount, price) {
	return new Promise((resolve, reject) => {
		let trade = new tradeModel({
			timestamp: new Date().getTime(),
			taker_order_id: buyerOrderID,
			maker_order_id: sellerOrderID,
			amount: amount,
			price: price
		});

		trade.save((err, savedTrade) => {
			if (err) {
				reject(err);
			} else {
				resolve(savedTrade);
			}
		});
	})
}

//Get all trades from database 
exports.getTradeHistory = function () {
	return new Promise((resolve, reject) => {
		tradeModel.find({}, (err, trades) => {
			if (err) {
				reject(err);
			} else {
				resolve(trades);
			}
		})
	})
}
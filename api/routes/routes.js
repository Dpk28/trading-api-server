module.exports = function(app) {
	const userController = require('../controllers/user.controller');
	const orderController = require('../controllers/order.controller');
	const tradeController = require('../controllers/trade.controller');

    //User api end points
	app.route('/api/v1/user/auth')
	   .post(userController.auth);

	app.route('/api/v1/user/register')
	   .post(userController.createUser);

	//Order api end points   
	app.route('/api/v1/order/create')
	   .post(orderController.createOrder);

	app.route('/api/v1/orders')
	   .get(orderController.getAllOrders);

	app.route('/api/v1/orders/counts')
	   .get(orderController.getOrderCounts);

	app.route('/api/v1/trades')
	   .get(tradeController.getTradeHistory);
}
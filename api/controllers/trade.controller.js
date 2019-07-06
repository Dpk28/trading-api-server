const tradeService = require('../services/trade.service');

exports.getTradeHistory = async function (req, res) {
	try {
		let trades = await tradeService.getTradeHistory();
		return res.status(200).json({
			message: trades,
			status: true
		})
	} catch (err) {
		return res.status(400).json({
			message: err,
			status: false
		})
	}
}
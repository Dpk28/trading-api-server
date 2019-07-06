const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const tradeSchema = new Schema({
	timestamp: {
		type:Number, 
		required: true
	},
	taker_order_id: {
		type: String,
		required: true
	},
	maker_order_id: {
		type: String,
		required: true
	},
	amount: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	} 
})

module.exports = mongoose.model('trade', tradeSchema)
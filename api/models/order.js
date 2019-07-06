const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	orderID: {
		type:String, 
		required: true
	},
	timestamp: {
		type:Number, 
		required: true,
		default: new Date().getTime()
	},
	amount: {
		type: Number,
		required: true
	},
	price: {
		type: Number,
		required: true
	}, 
	side: {
		type: String,
        required: true
	}, 
	status: {
		type: String,
		required: true,
		default: "pending"
	},
	username: {
		type: String,
		required: true
	}
})

module.exports = mongoose.model('order', orderSchema)
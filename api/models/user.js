const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}, 
	crypto_keys: {
		ethereum: {
	        public_key: {
	        	type: String
	        }
		},
	    bitcoin: {
			public_key: {
				type: String
			},
			private_key: {
				type: String
			}
		}
	}
})

module.exports = mongoose.model('user', userSchema)
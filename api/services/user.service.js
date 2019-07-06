const userModel = require('../models/user');
const bcrypt = require('bcrypt');
const web3 = require('../../eth-connect.js').getWeb3();
const bitcore = require('bitcore-lib');

//Add user in the database if not exists
exports.createUser = function (username, password) {
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, async (err, user) => {
			if(err) {
				reject(err.message);
			} else if(!user) {
				//Generate keys for ethereum and bitcoinn
				let ethPublicKey = await web3.eth.personal.newAccount("");
				let bitcoinPrivateKey = new bitcore.PrivateKey();
				let bitcoinPublicKey = bitcoinPrivateKey.toAddress();

				let hash = await bcrypt.hash(password, 10);
				let user = new userModel({
					username: username,
					password: hash,
					crypto_keys: {
						ethereum:  {
							public_key: ethPublicKey
						},
						bitcoin: {
							public_key: bitcoinPublicKey,
							private_key: bitcoinPrivateKey
						}
					}
				})

				user.save((err, savedUser) => {
					if(err) {
						reject(err.message);
					} else {
						resolve('User registed successfully.')
					}
				})
			} else {
				reject('User with this username already exists in the system.')
			}
		})
	})
}

//Authentication of user against database
exports.auth = function (username, password) {
	return new Promise((resolve, reject) => {
		userModel.findOne({username: username}, async (err, user) => {
			if(err) {
				reject(err.message);
			} else if(user) {
				let result = await bcrypt.compare(password, user.password);
				if(result) {
					resolve({user_id: user._id, username: user.username});
				} else {
					reject('Incorrect password!');
				}
			} else {
				reject('Invalid username.')
			}
		})
	})
}
const mongoose = require("mongoose");
const validator = require("validator");

const User = mongoose.model("User", {
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("email is invalid");
			}
		},
	},
	age: {
		type: Number,
		validate(value) {
			if (value < 0) {
				throw new Error("age must be a positive number");
			}
		},
		default: 0,
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minlength: 7,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("password is not safe");
			}
		},
	},
});

module.exports = User;

require("../src/db/mongoose");
const User = require("../src/models/user");
const Task = require("../src/models/task");

// User.findByIdAndUpdate("63c2325c0e0a601b2c41fcdd", { age: 3 })
// 	.then((user) => {
// 		console.log(user);
// 		return User.countDocuments({ age: 3 });
// 	})
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});

// const updateAgeAndCount = async (id, age) => {
// 	const user = await User.findByIdAndUpdate(id, { age });
// 	const count = await User.countDocuments({ age });
// 	return count;
// };

// updateAgeAndCount("63c2325c0e0a601b2c41fcdd", 6)
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});

// Task.findByIdAndRemove("63c23600296ae467b8f45e90")
// 	.then((task) => {
// 		console.log(task);
// 		return Task.countDocuments({});
// 	})
// 	.then((result) => {
// 		console.log(result);
// 	})
// 	.catch((e) => {
// 		console.log(e);
// 	});

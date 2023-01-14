const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
[];
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log("server is up on port " + port);
});

const bcrypt = require("bcrypt");

const myfunc = async () => {
	const password = "joska123";
	const hashedPassword = await bcrypt.hash(password, 80);

	console.log(password);
	console.log(hashedPassword);
};

myfunc();

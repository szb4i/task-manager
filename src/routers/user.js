const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		return res.status(201).send({ user, token });
	} catch (e) {
		return res.status(400).send(e);
	}
});

router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		return res.send({ user, token });
	} catch (e) {
		return res.status(400).send();
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();
		return res.send();
	} catch (e) {
		return res.status(500).send();
	}
});

router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		return res.send();
	} catch (e) {
		return res.status(500).send();
	}
});

router.get("/users/me", auth, async (req, res) => {
	return res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "password", "email", "age"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation) {
		console.log("not valid");
		return res.status(400).send({ error: "invalid updates" });
	}
	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		return res.send(req.user);
	} catch (e) {
		return res.status(400).send(e);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		return res.send(req.user);
	} catch (e) {
		return res.send(500);
	}
});

module.exports = router;

const User = require("../models/user");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
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

const upload = multer({
	limits: {
		fileSize: 1e6,
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			return cb(new Error("File must be jpg, jpeg or png"));
		}
		cb(undefined, true);
	},
});

router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		return res.send(200);
	},
	(error, req, res, next) => {
		return res.status(400).send({ error: error.message });
	}
);

router.delete("/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	return res.send(200);
});

router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) {
			throw new Error();
		}
		res.set("Content-Type", "image/png");
		return res.send(user.avatar);
	} catch (e) {
		return res.status(404).send();
	}
});

module.exports = router;

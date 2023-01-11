import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt } from "../../../utils";

type Data =
	| {
			message: string;
	  }
	| { user: { email: string; role: string; name: string }; token: string };

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "POST":
			return loginUser(req, res);
		default:
			return res.status(400).json({
				message: "Bad request",
			});
	}
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const { email = "", password = "" } = req.body;

	await db.connect();
	const user = await User.findOne({ email });
	await db.disconnect();

	if (!user) {
		return res.status(400).json({
			message: "Correo o contraseña no válidos - EMAIL",
		});
	}

	if (!bcrypt.compareSync(password, user.password)) {
		return res.status(400).json({
			message: "Correo o contraseña no válidos - CONTRASEÑA",
		});
	}

	const { role, name } = user;

	const token: string = jwt.signToken(user._id, email);

	return res.status(200).json({
		token,
		user: {
			email,
			role,
			name,
		},
	});
};

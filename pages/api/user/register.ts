import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { jwt, validations } from "../../../utils";

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
			return registerUser(req, res);
		default:
			return res.status(400).json({
				message: "Bad request",
			});
	}
}

const registerUser = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
	const {
		email = "",
		password = "",
		name = "",
	} = req.body as { email: string; password: string; name: string };

	await db.connect();
	const user = await User.findOne({ email });
	await db.disconnect();

	if (user) {
		return res.status(400).json({
			message: "Ese correo ya está registrado",
		});
	}

	if (password.length < 6) {
		return res.status(400).json({
			message: "La contraseña debe ser de 6 caracteres",
		});
	}

	if (name.length < 3) {
		return res.status(400).json({
			message: "El nombre debe de ser mayor de 2 carateres",
		});
	}

	if (validations.isEmail(email)) {
		return res.status(400).json({
			message: "El email no es válido",
		});
	}

	const newUser = new User({
		email: email.toLocaleLowerCase(),
		password: bcrypt.hashSync(password),
		role: "client",
		name,
	});

	try {
		await newUser.save({ validateBeforeSave: true });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Revisar logs del servidor",
		});
	}

	const { _id, role } = newUser;

	const token: string = jwt.signToken(_id, email);

	return res.status(200).json({
		token,
		user: {
			email,
			role,
			name,
		},
	});
};

import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";

type Data = { message: string } | IProduct | null;

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	switch (req.method) {
		case "GET":
			return getProductSlug(req, res);

		default:
			return res.status(400).json({
				message: "Bad request",
			});
	}
}

const getProductSlug = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
) => {
    await db.connect();
	const { slug } = req.query;
	const product = await Product.findOne({ slug }).lean();
    
	await db.disconnect();

	if (!product) {
		return res.status(404).json({
			message: "Producto no encontrado",
		});
	}

	return res.status(200).json(product);
};

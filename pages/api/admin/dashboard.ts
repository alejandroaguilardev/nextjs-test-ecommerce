import type { NextApiRequest, NextApiResponse } from "next";
import { Order, Product, User } from "../../../models";
import { db } from "../../../database";

type Data = {
	numberOfOrders: number;
	paidOrders: number;
	noPaidOrders: number;
	numberOfClients: number;
	numberOfProducts: number;
	productWithNoInventory: number;
	lowInventary: number;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	await db.connect();
	// const numberOfOrders = await Order.count();
	// const paidOrders = await Order.find({ isPaid: true }).count();
	// const numberOfClients = await User.find({ role: "client" }).count();
	// const numberOfProducts = await Product.count();
	// const productWithNoInventory = await Product.find({ inStock: 0 }).count();
	// const lowInventary = await Product.find({ inStock: { $lte: 10 } }).count();

	const [
		numberOfOrders,
		paidOrders,
		numberOfClients,
		numberOfProducts,
		productWithNoInventory,
		lowInventary,
	] = await Promise.all([
		await Order.count(),
		await Order.find({ isPaid: true }).count(),
		await User.find({ role: "client" }).count(),
		await Product.count(),
		await Product.find({ inStock: 0 }).count(),
		await Product.find({ inStock: { $lte: 10 } }).count(),
	]);

	await db.disconnect();

	res.status(200).json({
		numberOfOrders,
		paidOrders,
		noPaidOrders: numberOfOrders - paidOrders,
		numberOfClients,
		numberOfProducts,
		productWithNoInventory,
		lowInventary,
	});
}

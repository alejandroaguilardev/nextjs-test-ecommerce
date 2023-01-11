import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";
import { productsToUrl, productToUrl } from "../utils";

export const getProductBySlug = async (
	slug: string
): Promise<IProduct | null> => {
	await db.connect();
	const product = await Product.findOne({ slug }).lean();
	await db.disconnect();

	if (!product) {
		return null;
	}

	const updatedProduct = productToUrl(product);

	return JSON.parse(JSON.stringify(updatedProduct));
};

interface ProductSlug {
	slug: string;
}

export const getAllProductSlug = async (): Promise<ProductSlug[]> => {
	await db.connect();
	const slugs = await Product.find().select("slug -_id").lean();
	await db.disconnect();

	return slugs;
};

export const getProductByTerm = async (
	term: string
): Promise<ProductSlug[]> => {
	term = term.toString().toLowerCase();

	await db.connect();
	const products = await Product.find({
		$text: { $search: term },
	})
		.select("title  price inStock slug -_id")
		.lean();

	await db.disconnect();

	return products;
};

export const getAllProducts = async (): Promise<ProductSlug[]> => {
	await db.connect();
	const products = await Product.find().lean();

	await db.disconnect();

	const updatedProducts = productsToUrl(products);

	return JSON.parse(JSON.stringify(updatedProducts));
};

import { IProduct } from "../interfaces";

export const productToUrl = (product: IProduct): IProduct => {
	product.images = product.images.map((image) => {
		return image.includes("http")
			? image
			: `${process.env.HOST_NAME}/products/${image}`;
	});
	return product;
};

export const productsToUrl = (products: IProduct[]): IProduct[] => {
	return products.map((product) => {
		product.images = product.images.map((image) => {
			return image.includes("http")
				? image
				: `${process.env.HOST_NAME}/products/${image}`;
		});
		return product;
	});
};

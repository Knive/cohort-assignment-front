import { Merchant } from "../merchants/merchant.types";

export type Campaign = {
	id: string
	slug: string
	merchant: Merchant
	imageUrl: string
	title: string
	price: number
};
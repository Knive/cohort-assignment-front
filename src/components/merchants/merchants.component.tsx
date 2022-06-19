import { useEffect, useState } from "react";
import { Merchant } from "./merchant.types";
import MerchantsCardsLoading from "./merchants-loading.component";
import MerchantCard from "./merchant-card.components";

export default function MerchantsContainer() {

	const [loading, setLoading] = useState<boolean>(true)
	const [merchants, setMerchants] = useState<Array<Merchant>>([])
	const [error, setError] = useState<boolean>(false)

	useEffect(() => {

		async function getMerchantsList() {
			const response = await fetch('http://[::1]:3000/merchants')
			return await response.json()
		}

		getMerchantsList()
			.then(merchantsList => {
				setLoading(false)
				setMerchants(merchantsList)
			})
			.catch((err) => {
				setError(true)
				console.error(err)
			})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (error) {
		return <div className="mt-20">An error happened, please, try later.</div>
	}

	if (merchants.length === 0) {
		return <div className="mt-20">No merchants yet.</div>
	}

	return (
		<div className="mt-20 grid gap-12 grid-cols-1 auto-rows-auto lg:grid-cols-3">
			{
				loading
					? <MerchantsCardsLoading />
					: merchants?.map(m => <MerchantCard key={m.id} merchant={m} />)
			}
		</div>
	)
}
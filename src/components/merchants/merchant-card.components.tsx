import { useCallback, useEffect, useMemo, useState } from 'react'
import { Campaign } from '../campaigns/campaign.types'
import { Merchant } from './merchant.types'

interface MerchantCardProps {
	merchant: Merchant
}

export default function MerchantCard({ merchant }: MerchantCardProps) {

	const [loading, setLoading] = useState<boolean>(true)
	const [campaigns, setCampaigns] = useState<Array<Campaign>>([])
	const [error, setError] = useState<boolean>(false)

	useEffect(() => {
		async function getMerchantCampaigns() {
			const response = await fetch(`http://[::1]:3000/merchants/${merchant.id}/campaigns`)
			return await response.json()
		}

		getMerchantCampaigns()
			.then(campaignsList => {
				setLoading(false)
				setCampaigns(campaignsList)
			})
			.catch((err) => {
				setError(true)
				console.error(err)
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const LoadingCard = useCallback(() => {
		return loading ? <div className="animate-pulse h-2 bg-slate-200 rounded col-span-2"></div> : null
	}, [loading])

	const CampaignsDisplay = useMemo(() => {
		if (!loading) {
			if (error)
				return 'Campaigns could not be loaded'
			else
				return `${campaigns.length === 0 ? 'No' : campaigns.length} Campaigns Available`
		}

		return null
	}, [loading, error, campaigns.length])

	return (
		<div className="w-full rounded-3xl overflow-hidden shadow-lg cursor-pointer bg-white hover:bg-gray-50">
			<img className="w-full h-60 object-cover" src={merchant.bannerUrl} alt={merchant.name} />
			<img className="w-20 h-20 rounded-full ml-8 -mt-12 relative border-4 border-solid border-white object-cover" src={merchant.logoUrl} alt={merchant.name} />
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{merchant.name}</div>
				<p className="text-gray-400 text-base">
					<LoadingCard />
					{CampaignsDisplay}
				</p>
			</div>
		</div>
	)
}
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

	/**
	 * Retrieves a specific merchant campaigns
	 */
	const getMerchantCampaigns = useCallback(async () => {
		try {
			const response = await fetch(`http://[::1]:3000/merchants/${merchant.id}/campaigns`)
			const campaignsList = await response.json()
			setLoading(false)
			setCampaigns(campaignsList)
		} catch (err) {
			setError(true)
			console.error(err)
		}
	}, [merchant.id])

	useEffect(() => {
		getMerchantCampaigns()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const LoadingCard = useCallback(() => {
		return loading
			? (<div className="space-y-3 animate-pulse">
				<div className="grid grid-cols-3 gap-4">
					<div className="h-2 bg-slate-200 rounded col-span-2"></div>
					<div className="h-2 bg-slate-200 rounded col-span-1"></div>
				</div>
				<div className="h-2 bg-slate-200 rounded"></div>
			</div>)
			: null
	}, [loading])

	const CampaignsDisplay = useMemo(() => {
		// Not loaded yet
		if (!loading) {

			// Error with fetch request
			if (error)
				return 'Campaigns could not be loaded'

			// Campaigns list empty
			if (campaigns.length === 0)
				return 'No Campaigns Available'

			// More than a thousand
			if (campaigns.length > 1000)
				return 'More than a thousand campaigns available'

			// Basic length
			return `${campaigns.length} Campaigns Available`
		}

		return null
	}, [loading, error, campaigns.length])

	return (
		<div className="w-full rounded-3xl overflow-hidden shadow-lg cursor-pointer bg-white hover:bg-gray-50">
			{
				merchant.bannerUrl !== ''
					? <img className="w-full h-60 object-cover" src={merchant.bannerUrl} alt={merchant.name} />
					: <div className="w-full h-60 bg-slate-300"></div>
			}
			{
				merchant.logoUrl !== ''
					? <img className="w-20 h-20 rounded-full ml-8 -mt-12 relative border-4 border-solid border-white object-cover" src={merchant.logoUrl} alt={merchant.name} />
					: <div className="w-20 h-20 rounded-full ml-8 -mt-12 relative border-4 border-solid border-white bg-white"></div>
			}
			<div className="px-6 py-4">
				<div className="font-bold text-xl mb-2">{merchant.name}</div>
				<LoadingCard />
				<p className="text-gray-400 text-base">
					{CampaignsDisplay}
				</p>
			</div>
		</div>
	)
}
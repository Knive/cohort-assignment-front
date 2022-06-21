import { useCallback, useEffect, useRef, useState } from "react";
import { Merchant } from "./merchant.types";
import MerchantsCardsLoading from "./merchants-loading.component";
import MerchantCard from "./merchant-card.components";
import InfiniteScroll from "react-infinite-scroll-component"
import { createGuid } from "../../lib/utils";
import { ReactComponent as Spinner } from '../../assets/spinner.svg'
import { useTriggerScrollFix } from "../../lib/hooks";
import SearchBar from "../common/search-bar.components";

/**
 * Adds new merchants
 * @param count Number of merchants to add
 * @param index Index used to name the merchants
 */
function addNewMerchants(count: number, index: number) {
	const newMerchants: Array<Merchant> = []

	for (let i = 0; i < count; i++) {
		newMerchants.push({
			id: createGuid(),
			name: `Merchant ${index + i}`,
			slug: `merchant-${index + i}`,
			bannerUrl: '',
			logoUrl: ''
		} as Merchant)
	}

	return newMerchants
}

/**
 * Displays merchants list
 */
export default function MerchantsContainer() {

	const [loading, setLoading] = useState<boolean>(true)
	const [merchants, setMerchants] = useState<Array<Merchant>>([])
	const [error, setError] = useState<boolean>(false)
	const [count, setCount] = useState<number>(1)
	const [searching, setSearching] = useState<boolean>(false)
	const [searchResults, setSearchResults] = useState<Array<Merchant>>([])
	const searchBar = useRef<HTMLInputElement>(null)

	/**
	 * Fetch merchants list (actual API request)
	 */
	const getMerchantsList = useCallback(async () => {
		try {
			const response = await fetch('http://[::1]:3000/merchants')
			const merchantsList = await response.json()
			setMerchants(merchantsList)
			setLoading(false)
		} catch (err) {
			setError(true)
			console.error(err)
		}
	}, [])

	/**
	 * Adds more merchants to the list (fake API request, imagine that the endpoint is paginated)
	 */
	const getMoreMerchants = useCallback(async () => {
		// Fake async api call lasting .5 seconds
		setTimeout(() => {
			// Add merchants
			setMerchants(merchants.concat(addNewMerchants(20, count)))

			// Set new count
			setCount(count + 20)
		}, 1500)
	}, [count, merchants])

	useEffect(() => {
		getMerchantsList()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Fix not loading data when initial list do not allow a scroll
	useTriggerScrollFix([merchants.length, searching])

	/**
	 * Handles search (should use API call to properly search match from database)
	 */
	const handleSearch = useCallback(() => {
		var search = searchBar.current?.value;

		// Search merchant
		if (search !== undefined && search !== '') {
			setSearchResults(merchants.filter(m => m.name.toLowerCase().startsWith(search!.toLowerCase())))
			setSearching(true)

		// Empty, display merchants list again
		} else {
			setSearching(false)
		}
	}, [merchants])

	/**
	 * Displays search results
	 */
	const SearchBarResults = useCallback(() => {
		if (searching) {

			// No match
			if (searchResults.length === 0)
				return <div className="mt-20">Sorry, we were not able to find a match.</div>

			// Match
			return <div className="mt-20 grid gap-12 grid-cols-1 auto-rows-auto lg:grid-cols-3">
				{searchResults?.map(m => <MerchantCard key={m.id} merchant={m} />)}
			</div>
		}

		return null
	}, [searchResults, searching])

	if (error) {
		return <div className="mt-20">An error happened, please, try later.</div>
	}

	if (!searching && merchants.length === 0) {
		return <div className="mt-20">No merchants yet.</div>
	}

	console.log('searching', searching, 'count', count)

	return (
		<InfiniteScroll
			dataLength={merchants.length}
			next={getMoreMerchants}
			hasMore={!searching && count < 60}
			loader={<div className="h-6 w-full p-10 flex justify-center">
				<Spinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-400" />
			</div>}
			style={{ overflow: 'initial' }}
		>
			<SearchBar ref={searchBar} onSearch={handleSearch} />
			<SearchBarResults />

			{
				!searching && <div className="mt-10 grid gap-12 grid-cols-1 auto-rows-auto lg:grid-cols-3">

					{
						loading
							? <MerchantsCardsLoading />
							: merchants?.map(m => <MerchantCard key={m.id} merchant={m} />)
					}

				</div>
			}
		</InfiniteScroll>
	)
}
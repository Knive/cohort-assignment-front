import { useEffect } from 'react';

/**
 * Simple fix to react infinite scroll component when initial list do not allow a scroll
 * and thus will not fetch new data, we trigger a scroll event. This case should not happen
 * with proper paginated API
 * @param deps Dependencies
 */
export function useTriggerScrollFix(deps: Array<any>) {
	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('scroll'));
		}
	}, [deps]);
}
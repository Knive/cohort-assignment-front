import Layout from './components/Layout';
import { ReactComponent as CohortLogo } from './assets/cohort-logo.svg'
import MerchantsContainer from './components/merchants/merchants.component';

function App() {
	return (
		<Layout>
			<CohortLogo />
			<MerchantsContainer />
		</Layout>
	);
}

export default App;
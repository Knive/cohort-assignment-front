export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="px-4 md:px-24 py-11 max-w-screen-2xl m-auto">
			{children}
		</div>
	)
}
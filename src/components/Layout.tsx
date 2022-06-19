export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="px-4 md:px-24 py-11">
			{children}
		</div>
	)
}
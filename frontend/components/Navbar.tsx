import { useRouter } from "next/router";
import Link from "next/link";

const navigationRoutes = [{name:'OSA OVERVIEW',component:"home"}, {name:'ACTIONS',component:"logBook"}, {name:'ANALYTICS', component:"analytics"}, {name:'SCORECARD',component:"scoreCard"}];

export default function Navbar() {
	const router = useRouter();
	return (
		<nav className="nav_bar">
			{navigationRoutes.map((singleRoute) => {
				return (
					<NavigationLink
						key={singleRoute.component}
						href={`/${singleRoute.component}`}
						text={singleRoute.name}
						router={router}
					/>
				);
			})}
		</nav>
	);
}

function NavigationLink({ href, text, router }:any) {
	const isSelected = router.asPath === (href === "/home" ? "/" : href);
	return (

		<Link href={href === "/home" ? "/" : href} passHref>
			<a
				href={href === "/home" ? "/" : href}
				className={`${isSelected && "active"} nav_item`}>
				<span>{text}</span>
			</a>
		</Link>
	);
}

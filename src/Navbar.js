import { Link } from "react-router-dom";

/**
* The Navbar component displays navigation links to the Home and Admin pages.
*/
export default function Navbar() {

	return (
		<>
		<center>
			<div className="nav">
				<Link to="/"> Home </Link>
				<Link to="/Admin"> Admin </Link>
			</div>
		</center>
		</>
	);
}

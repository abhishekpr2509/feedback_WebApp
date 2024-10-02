import React, {useState} from "react";
import "./StarRating.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

/**
 * The StarRating component allows users to select a rating by clicking on stars.
 * @param {number} rating - The current selected rating.
 * @param {function} onRatingChange - A function to update the selected rating.
 */

const StarRating = ({rating, onRatingChange}) => {

	//State variable to track the star currently being hovered over	
	const[hover, setHover] = useState(0);

	
	return (
		<div className="star-rating">
		{[...Array(5)].map((star, i) => {
			const ratingValue = i + 1;
			return(
			<label key={i}>
				<input type= "radio"
					name= "rating"
					value={ratingValue}
					onClick={() =>	onRatingChange(ratingValue)}
				/>
				<FontAwesomeIcon icon={faStar}
					className={
						ratingValue <= (hover || rating)
						? "star selected"
						: "star"
					}
					onMouseEnter={() => setHover(ratingValue) }
					onMouseLeave={() => setHover(0) }
					onClick={()=> onRatingChange(ratingValue)}
				/>
				</label>
			);
		})}
		</div>
	);
};

export default StarRating;
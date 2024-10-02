import { useState } from "react";
import StarRating from "./StarRating"; // StarRating is a custom component
import Navbar from "./Navbar"; //Navbar is a custom component


/**
 * The Feedback component represents a form for users to submit feedback.
 */
const Feedback = () => {

	//State Variables for name, email, feedback and rating:-
	const[name,setName] = useState("");
	const[email,setEmail] = useState("");
	const[feedback,setFeedback] = useState("");
	const[rating, setRating] = useState("0");
	
	//Function to handle changes in input fields(name, email and feedback):-
	const hChange = (field) => (event) => {
		
		const updater = {
			name: setName,
			email: setEmail,
			feedback: setFeedback
		}[field];

		updater(event.target.value);
	};		

	//Function to handle form submission:-
	const hSubmit = async (event) => {
		
		event.preventDefault();
		
		//Validating name input(spaces, valid characters)
		const trimmedName = name.trim();
		if (!trimmedName || trimmedName.length<2) {
			alert("Please enter a valid name with at-least two characters.");
			return;
		}
		
		const nameRegex = /^[a-zA-Z\s]*$/;
		if(!nameRegex.test(trimmedName)) {
			alert("Please enter a valid name containing only alphabets");
			return;
		}
		

		//Validating email input(spaces, valid characters)
		if(email.includes(" ")) {
			alert("Please remove any spaces from your email address.");
			return;
		}
		
		const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if(!emailRegex.test(email)) {
			alert("Please enter a valid email address");
			return;
		}

		//Validating rating to check if input stars are selected:-
		if(Number(rating) === 0)
		{
			alert("Please select stars as feedback.");
			return;
		}

	//Connection establishment between the UI to store the input in backend(database)
	try {
		const response = await fetch("http://localhost:5000/feedback", 
		{
			method: "POST",
			headers: 
			{
				"Content-Type":
				"application/json"
			},
			body:
			JSON.stringify({ name, email, feedback, rating })
		});
		
		//Error handling for connection between backend and UI
		if(!response.ok) 
		{
			const errorData = await response.json();
			if(errorData && errorData.message) {
			throw new Error(errorData.message);
			console.log(errorData);
			}
			else
			{
				throw new Error("An error has occurred while submitting your feedback. Please try again");
			}
		}
			//Clear form inputs and displaying success message
			setName("");
			setEmail("");
			setFeedback("");
			setRating(0);
				
				alert("Feedback submitted successfully.");
	}
	
	//Error handling for form submission
	catch(error)
	{
		alert(error.message);
		console.log(error.message);
	}
};		
	//Displaying the Feedback Form
	return(
	<>
	<center>
	<section>
			<div className="color"></div>
			<div className="color"></div>
			<div className="color"></div>
	<div className="box">
		<div className="square" style={{"--i":0}}></div>
		<div className="square" style={{"--i":1}}></div>
		<div className="square" style={{"--i":2}}></div>
		<div className="square" style={{"--i":3}}></div>
		<div className="square" style={{"--i":4}}></div>
		<div className="square" style={{"--i":5 }}></div>
		<div className="container">
			<div className="form">
				<h1 className="title"> Feedback Form </h1>
					<div className="feedback-box">
						<form onSubmit={hSubmit}>
							<br/><br/>

								<div className="inputBox">
									<input type="text" value={name} placeholder="enter your name here" 
									onChange={hChange("name")} required/>
								</div>
								<br/><br/>
		
								<div className="inputBox">
									<input type="text" value={email} placeholder="enter your email address here" 
									onChange={hChange("email")} required/>
								</div>
								<br/><br/>

								<div className="inputBox">
									<textarea placeholder="enter your feedback in detail here"
									value={feedback} onChange={hChange("feedback")} draggable="false" required/>
								</div>
								<br/><br/>

								<div className="inputBox">
									<div className="stars">
										<StarRating rating={rating} onRatingChange={setRating}/>	
									</div>
								</div>
					
								<div className="inputBox">
									 <button className="submit_btn" type="submit"> Submit </button>
								</div>
						</form>
					</div>
			</div>
		</div>
	</div>		
	</section>
	</center>
	</>

	);


};

export default Feedback;
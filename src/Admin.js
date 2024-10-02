import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";


/**
 * The Admin component handles login, displays feedback data, and allows deleting entries. :-
 */

const Admin = () => {
	// State variables for feedback data, username, password, and login status
	const [Fb, setFb] = useState([]);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoggedIn, setIsLoggedIn] =useState(false);

	// Refs for input elements:-
	const usernameInputRef = useRef();
	const passwordInputRef = useRef();
	
	// Fetch feedback data from the server when the component mounts:-
	useEffect( () => {
		fetch("http://localhost:5000/feedback")
		.then((response) => {
			if(!response.ok)
			{
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return response.json();
		})
		
		.then((data) => {
			if(Array.isArray(data)){
				setFb(data);
			}
			else
			{
				console.error("Data is not an array: ", data);
			}
		})
		.catch((error) => {
				console.error('Error fetching data: ', error);
		});
	}, []);

	// Handle login form submission:-
	const handleLogin = (event) =>
		{
			event.preventDefault();
			fetch('http://localhost:5000/admin/login',
			{
				method:'POST',
				headers:
					{
						'Content-Type':'application/json'
					},
				body:JSON.stringify({username,password})
			})
			.then(response => 
			{
				if(response.ok)
				{
					return response.json();
				}	
				else
				{
					throw new Error('Invalid Credentials');
				}
			})
			.then(data=>
			{
				setIsLoggedIn(true);
			}
			)
			.catch(error => 
			{
				alert(error.message);
				setUsername("");
				setPassword("");
				usernameInputRef.current.focus();
			}
			);
	};

	// Handle deletion of feedback entries
	const handleDelete = (id) =>
	{
		if(window.confirm('Are you sure you want to delete this entry?'))
		{
			setFb((prevFeedback) =>
				prevFeedback.filter((feedback) => feedback._id!==id));
		}
	};
	
	//Handle logout
	const handleLogout = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if(window.confirm('Are you sure you want to log out?'))
		{
			setIsLoggedIn(false);
			setUsername("");
			setPassword("");
		}
	};


	//DisplayStars component to render star icons based on rating:-
	const DisplayStars = ({rating}) => {
		let numStars = Math.round(Number(rating));
		numStars = Number.isNaN(numStars) ? 0 : numStars; 
		console.log(`rating: ${rating}, numStars: ${numStars}`);
		return(
			<>
				{[...Array(numStars)].map((star, i) => (
					<FontAwesomeIcon key={i} icon={faStar} />
				))}
			</>
		);
	};
	
//Displaying the output:-
return(
	<>
	<div>
	<center>
		
				
								
						{!isLoggedIn && (
						
						<div className="Admin-Login-Container">
						
							<div className="Admin-Form">
								<h1 className="Admin-Title"> Admin Log-In </h1>
								<div className="Admin-Login-Form">
									<form onSubmit={handleLogin}>
									<br/>
							
										<div className="Admin-InputBox">
											<input
											type="text"
											value={username}
											onChange={(event)=>setUsername(event.target.value)}
											placeholder="Enter username"
											ref={usernameInputRef}
											/>
										</div>
							
									<br/><br/>
										<div className="Admin-InputBox">
											<input
												type="password"
												value={password}
												onChange={(event)=>setPassword(event.target.value)}
												placeholder="Enter password"
												ref={passwordInputRef}
											/>
										</div>
						
									<br/><br/>
										<div className="Admin-InputBox">
												<button type="submit"> Login </button>
										</div>
									</form>
								</div>
							</div>
						</div>
						)}
					
	</center>
	</div>
	{isLoggedIn && (
	<>
			<section> 
				<div className="color"></div>
				<div className="color"></div>
				<div className="color"></div>

			<div className="Admin-box">
				<div className="Admin-square" style={{ "--i" : 0 }}></div>
				<div className="Admin-square" style={{ "--i" : 1 }}></div>
				<div className="Admin-square" style={{ "--i" : 2 }}></div>
				<div className="Admin-square" style={{ "--i" : 3 }}></div>
				<div className="Admin-square" style={{ "--i" : 4 }}></div>
			
				<div className="Admin-Container">
		
				
					<div className="Admin-box">
							 <div className="logout-btn" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px'}}>
        							<button onClick={handleLogout}> Logout </button>
    							</div>
							<table className="Database-Table">
								<thead>
									<tr>
										<th> Name </th>
										<th> Email </th>
										<th> Feedback </th>
										<th> Rating </th>
										<th> Actions </th>
										 </tr>
    
								</thead>
									<tbody>
										{Fb.map((feedback) => (
										<tr key={feedback._id}>
											<td className="Entry-Content"> {feedback.name} </td>
											<td className="Entry-Content"> {feedback.email} </td>
											<td className="Entry-Content"> {feedback.feedback} </td>
											<td className="Entry-Content"> <DisplayStars rating= {feedback.rating} /> </td>
											<td> <button onClick={()=> handleDelete(feedback._id)}> Delete </button> </td>
										</tr>
										))}
									</tbody>
							</table>
					
					</div>
				</div>
			</div>
	
			</section>
		</>
	)}
	</>
);
};
export default Admin;
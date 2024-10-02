const mongoose = require("mongoose");
const AdminModel = require("./AdminSchema");
const bcrypt = require('bcrypt');


// Function to connect the MongoDB database:-
async function connectToDatabase() {

	try {
		await
		mongoose.connect("mongodb://127.0.0.1:27017/feedbackdatabase",
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				serverSelectionTimeoutMS: 30000
			})
		console.log("Connected to 'feedbackdatabase' database");
	}
		catch (error)
		{
			console.error("Error Connecting to database", error);
		}
}

//Calling the connection function 
connectToDatabase();


//Define a Mongoose schema for the Feedback Model
const FeedbackSchema = new mongoose.Schema({
	name: {
		type: String, // Datatype of the input
		required: true, // Cannot be null or empty
		},
	email: {
		type: String,
		required: true,
		unique: true, // Ensures uniqueness 
		},
	feedback: {
		type: String,
		required: true,
		},
	rating: {
		type: Number, // Input of Integer datatype
		required: true,
		},
});

// Create a Mongoose model for the Feedback schema
const FeedbackModel = mongoose.model("feedbacks", FeedbackSchema); 

// Create indexes for the Feedback model
FeedbackModel.createIndexes();

// Function to create an  admin user if it doesn't exist:-
const createAdmin = async () => 
	{
		const existingAdmin = await AdminModel.findOne({ username: 'admin123' });
		if(existingAdmin)
		{
			console.log("Admin exists.");
			return;
		}
	
		const newAdmin = new AdminModel( 
			{
				username: 'admin123',
				password: 'password123'
			} );
		try
			{
				await newAdmin.save();
				console.log('Admin Created');
			}
		catch (error)
			{
				console.error("Error in Admin Creation: ", error);
			}
	};

// Call the function to create an admin user
createAdmin();

const express = require('express');
const app = express();
const cors = require("cors");
console.log("App listens at port 5000");

//Configuring Express to use JSON parsing and CORS :-
app.use(express.json());
app.use(cors());

// Define a route to check if the application is working
app.get("/", (req, resp) => {
	
	resp.send("App is Working.");
});

// Define a route to fetch the Feedback data
app.get("/feedback", async (req, resp) => {
	try {
		const feedbacks = await FeedbackModel.find();
		resp.json(feedbacks);
	}
	catch (error)
	{
		console.error("Error fetching feedbacks: ", error);
		resp.status(500).json({ message: "An error has occurred while fetching feedbacks. Try again. " });
	}
});

// Define a route to submit Feedback data :-
app.post("/feedback", async (req, resp) => {
	
	try {
		console.log('Received feedback', req.body);
		
		const { email } = req.body;
		const existingFeedback = await FeedbackModel.findOne({email: email});
		if(existingFeedback)
		{
			return resp.status(400).json({ message: "Email already exists" })
		}
		
		const feedbackDoc = new FeedbackModel(req.body);
		const savedFeedback = await feedbackDoc.save();
		console.log('Saved feedback: ', savedFeedback); 
		resp.status(201).json({ message: "Feedback submitted successfully." });
	}
	// Error handling for submission of Feedback data route
	catch(error)
		{
			console.error("Error submitting feedback", error.message);
			if(error.code === 11000)
			{
				resp.status(400).json({message: "Email already exists."});
			}
			else
			{
				resp.status(500).json({ error:"An error has occurred while submitting feedback. Please try again" });
			}
		}
});

// Define a route for admin login
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    const adminData = await AdminModel.findOne({ username: username });

    if (adminData && bcrypt.compareSync(password, adminData.password)) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Starting the Express server on the port 5000 :-
app.listen(5000);

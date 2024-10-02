const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Bcrypt is being used for securing the password
const saltRounds = 10; // Number of salt rounds that will be used for hashing :- 

//Define a Mongoose schema for the Admin model :-
const AdminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
});

// Middleware: Hashing the password before saving to the database:-
AdminSchema.pre('save', async function(next){
	if(this.isModified('password'))
		{
			// Hashing the password using bcrypt with the specified salt rounds:-
			this.password = await
			bcrypt.hash(this.password, saltRounds);
		}
		next();
});

const AdminModel = mongoose.model("admins", AdminSchema);

module.exports = AdminModel;


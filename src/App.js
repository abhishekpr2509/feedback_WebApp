import logo from './logo.svg';
import './App.css';
import Feedback from "./Feedback";
import Admin from "./Admin";
import Navbar from "./Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/**
 * The main App component is the entry point of the application.
 */
function App() {
  return (
    <div className="App">
	<BrowserRouter>
		<Navbar/>
		<Routes>
			<Route path="/" element={<Feedback/>}/>
			<Route path="/Admin" element={<Admin/>}/>
			<Route path="*" element={<Feedback/>}/>
		</Routes>
	</BrowserRouter>
    </div>
  );
}

export default App;

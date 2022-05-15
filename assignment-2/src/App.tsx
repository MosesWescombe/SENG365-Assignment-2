import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./Pages/Home";
import NavBar from "./components/NavBar";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { Auctions } from "./Pages/Auctions";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/auctions' element={<Auctions />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

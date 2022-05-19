import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import { Auctions } from "./Pages/Auctions";
import { AuctionItemPage } from "./Pages/AuctionItemPage";

function App() {
  return (
    <div className="App" style={{height: '100%', minHeight: '100vh', backgroundColor: '#f2f2f2'}}>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Auctions />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/auctions' element={<Auctions />}/>
          <Route path='/auction/:auctionId' element={<AuctionItemPage />}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

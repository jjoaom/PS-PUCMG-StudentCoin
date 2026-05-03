import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/pages/Home";
import Header from "./components/pages/Header";
import Login from "./components/pages/Login";

function App() {
  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

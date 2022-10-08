import { useState } from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import Home from "./Components/Home";
import Lobby from "./Components/Lobby";

function App() {
  const [count, setCount] = useState(0);

  const handlePlay = () => {};

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
}

export default App;

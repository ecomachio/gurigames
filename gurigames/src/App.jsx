import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <form>
        <input type="text" name="player" placeholder="faz teu nome champs" />
        <input type="button" value="Jogar" className="nes-btn is-success"/>
      </form>
    </div>
  );
}

export default App;

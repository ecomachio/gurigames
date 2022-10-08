import { useState } from "react";
import { useNavigate } from "react-router-dom";

const URL = "https://nwoffg0662.execute-api.us-east-1.amazonaws.com/join";

function Home() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  const handlePlay = async () => {
    console.log("aqio", input, URL);
    const response = await fetch(URL, {
      method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      mode: "no-cors",

      body: JSON.stringify({ name: input }),
    });
    navigate("/lobby");
    if (response.status !== 200) navigate("/lobby");
    else alert("deu erro");
  };

  return (
    <div className="App">
      <h1>
        <span className="nes-text is-warning">Faz teu nome, Champs!</span>
      </h1>
      <form>
        <input
          type="text"
          name="player"
          placeholder="Escolha um nome..."
          value={input}
          onInput={(e) => setInput(e.target.value)}
        />
        <input
          type="button"
          onClick={handlePlay}
          value="Jogar"
          className="nes-btn is-success"
        />
      </form>
    </div>
  );
}

export default Home;

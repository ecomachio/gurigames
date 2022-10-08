import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const handlePlay = () => {
    console.log("aqui");
    navigate("/lobby");
  };

  return (
    <div className="App">
      <h1>
        <span className="nes-text is-warning">Faz teu nome, Champs!</span>
      </h1>
      <form>
        <input type="text" name="player" placeholder="Escolha um nome..." />
        <input type="button" onClick={handlePlay} value="Jogar" className="nes-btn is-success" />
      </form>
    </div>
  );
}

export default Home;

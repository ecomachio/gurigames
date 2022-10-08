import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const handlePlay = () => {
    console.log("aqui");
    navigate("/lobby");
  };

  return (
    <div className="App">
      <form>
        <input type="text" name="player" placeholder="faz teu nome champs" />
        <input
          type="button"
          value="Jogar"
          onClick={handlePlay}
          className="nes-btn is-success"
        />
      </form>
    </div>
  );
}

export default Home;

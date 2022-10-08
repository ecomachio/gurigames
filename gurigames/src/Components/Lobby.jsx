import { useEffect, useState } from "react";

function Lobby() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("https://nwoffg0662.execute-api.us-east-1.amazonaws.com/user")
      .then((response) => response.json())
      // 4. Setting *dogImage* to the image url that we received from the response above
      .then((data) => setUsers(data.Items));
  }, []);

  return (
    <div className="App">
      <h1>Procurando oponente...</h1>
      <ul>
        {users.map((user) => {
          return (
            <>
              <li>
                <a href="#" className="nes-badge">
                  <span className="is-success">Online</span>
                </a>
                {user.name}
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
}

export default Lobby;

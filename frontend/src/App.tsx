import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div id="App">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;

import logo from "./assets/images/logo.png";
import "./App.css";
import Clipboard from "./components/Clipboard";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div id="App">
      <Navbar />
      <Clipboard />
    </div>
  );
}

export default App;

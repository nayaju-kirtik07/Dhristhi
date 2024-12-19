import "./App.css";
import AllRoutes from "./Component/AllRoutes";
import { AllContext } from "./Component/Context";

function App() {
  return (
    <AllContext>
      <div className="App">
        <AllRoutes />
      </div>
    </AllContext>
  );
}

export default App;

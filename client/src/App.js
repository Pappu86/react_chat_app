import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Join from "./components/Join";
import Chat from "./components/Chat";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Join} />
          <Route path="/chat" component={Chat} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

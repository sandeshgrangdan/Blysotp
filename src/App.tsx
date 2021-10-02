import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Verify from './Verify';
import Success from './Success';
import Error from './Error';
const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path={`/`}>
          <Verify />
        </Route>
        <Route path={`/success`}>
          <Success />
        </Route>
        <Route path={`*`}>
          <Error />
        </Route>
      </Switch>

    </Router>
  );
};

export default App;
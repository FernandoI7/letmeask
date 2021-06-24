import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AuthContextComponent } from './context/AuthContext/AuthContext';
import { Home } from './pages/Home/Home';
import { NewRoom } from './pages/NewRoom/NewRoom';
import { Room } from './pages/Room/Room';

function App() {
  return (
    <BrowserRouter>
      <AuthContextComponent>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:id" component={Room} />
        </Switch>
      </AuthContextComponent>
    </BrowserRouter>
  );
}

export default App;

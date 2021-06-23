import { BrowserRouter, Route } from 'react-router-dom';
import { AuthContextComponent } from './context/AuthContext/AuthContext';
import { Home } from './pages/Home/Home';
import { NewRoom } from './pages/NewRoom/NewRoom';

function App() {
  return (
    <BrowserRouter>
      <AuthContextComponent>
        <Route path="/" exact component={Home} />
        <Route path="/rooms/new" component={NewRoom} />
      </AuthContextComponent>
    </BrowserRouter>
  );
}

export default App;

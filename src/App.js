import './App.css';
import MainBoard from './main/MainBoard';
import { store } from './store';
import { Provider } from 'react-redux';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <MainBoard />
      </div>
    </Provider>
  );
}

export default App;

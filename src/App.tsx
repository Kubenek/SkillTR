import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router';

import Dashboard from './pages/Dashboard';
import Designer from './pages/Designer';
import Settings from './pages/Settings';

import Navigation from './components/Navigation';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/designer' element={<Designer/>}/>
        <Route path='/settings' element={<Settings/>}/>
        <Route path='/test' element={<Navigation/>}/>
      </Routes>
    </BrowserRouter>
  );

}

export default App

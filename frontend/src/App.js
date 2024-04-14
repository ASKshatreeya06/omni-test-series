import './App.css';
import Header from './components/Header';
import Login from './components/Login';
import Questionnaire from './components/Questionnair'; // Corrected file name
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
function App() {
  const user=sessionStorage.getItem("user")
  return (
    <BrowserRouter>
    
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/home" element={user?<Questionnaire />:<Login />} /> 
      </Routes>
    </BrowserRouter>
  );
}
export default App;
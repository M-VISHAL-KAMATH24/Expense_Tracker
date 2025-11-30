import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from './pages/Auth/Login';
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Routes path="/" element={<Root/>}/>
          <Routes path="login" exact element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
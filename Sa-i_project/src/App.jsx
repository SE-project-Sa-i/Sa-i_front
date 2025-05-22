// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import PeopleList from './Pages/PeopleList';
import Category from './Pages/Category';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<PeopleList />} />
          <Route path="/category" element={<Category />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

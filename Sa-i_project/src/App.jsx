// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home';
import PeopleList from './Pages/PeopleList';
import Category from './Pages/Category';
import CategoryCreateComplete_1 from './Pages/CategoryCreateComplete_1';
import CategoryCreateComplete_2 from './Pages/CategoryCreateComplete_2';
import CategoryCreateComplete_3 from './Pages/CategoryCreateComplete_3';
import CategoryCreateComplete_4 from './Pages/CategoryCreateComplete_4';
import CategoryCreateComplete_5 from './Pages/CategoryCreateComplete_5';
import CategoryCreateComplete_6 from './Pages/CategoryCreateComplete_6';
import NodeCreateComplete_1 from './Pages/NodeCreateComplete_1';
import NodeCreateComplete_2 from './Pages/NodeCreateComplete_2';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/people" element={<PeopleList />} />
          <Route path="/category" element={<Category />} />
          <Route path="/categoryCreateComplete_1" element={<CategoryCreateComplete_1 />} />
          <Route path="/categoryCreateComplete_2" element={<CategoryCreateComplete_2 />} />
          <Route path="/categoryCreateComplete_3" element={<CategoryCreateComplete_3 />} />
          <Route path="/categoryCreateComplete_4" element={<CategoryCreateComplete_4 />} />
          <Route path="/categoryCreateComplete_5" element={<CategoryCreateComplete_5 />} />
          <Route path="/categoryCreateComplete_6" element={<CategoryCreateComplete_6 />} />
          <Route path="/nodeCreateComplete_1" element={<NodeCreateComplete_1 />} />
          <Route path="/nodeCreateComplete_2" element={<NodeCreateComplete_2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

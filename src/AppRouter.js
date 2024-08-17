// AppRouter.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AiwithImage from './components/AiwithImage';
//import AboutMe from './pages/AboutMe';


export const routes = [
  { path: '/', name: 'Home', component: <Home /> },
  { path: '/image', name: 'Image AI', component: <AiwithImage /> },

];

const AppRouter = () => {
  return (
    <Router>
      <Navbar />

      <div className='bg-slate-900 '>
        <Routes>

          {
            routes.map((route) => {
              return (
                <Route path={route.path} exact element={route.component} />
              );
            })
          }
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
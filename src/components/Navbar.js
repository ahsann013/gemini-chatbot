import React from 'react';
import { NavLink } from 'react-router-dom';
import { routes } from '../AppRouter';

const Navbar = () => {
  return (
    <nav className=' bg-slate-900'>
      <ul>
        {
          routes.map((route, index) => {
            return (
              <li className='sticky  mt-2' key={index}>
                <NavLink className="text-decoration-none text-white" to={route.path} exact activeClassName="active">
                  {route.name}
                </NavLink>
              </li>
            );
          })
        }
      </ul>
    </nav>
  );
};

export default Navbar;
import React from 'react';

export default function header() {
    return (
       <header>
               <Link className="site-logo" to="/">#VanLife</Link>
               <nav>
                 <Link to="/about">About</Link>
                 <Link to="/vans">Vans</Link>
               </nav>
        </header>
    )
};
import './Navigation.css'

import { NavLink } from "react-router";
import { Dashboard, Swatch, Cog } from '@boxicons/react';

export default function Navigation() {

    return(
        <nav className="navbar">

            <NavLink to={"/dashboard"} className='navbutton' data-tooltip="Dashboard">
                <Dashboard className='icon'/>
            </NavLink>

            <NavLink to={"/designer"} className='navbutton' data-tooltip="Designer">
                <Swatch className='icon'/>
            </NavLink>

            <NavLink to={"/settings"} className='navbutton' data-tooltip="Settings">
                <Cog className='icon'/>
            </NavLink>
        </nav>
    );

}
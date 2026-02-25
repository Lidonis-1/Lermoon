import React from "react";
import { Link } from "react-router-dom";
import './nav.css'
import { useState } from "react";

 export default function NavPanel(){
    const[vision, isVision] = useState(true);
    return (
        <>
        {vision ? 
        <div className="nav_panel">
            <Link to="/Profile"><button className="nav_button_link">profile</button></Link>
            <Link to="/Graphs"><button className="nav_button_link">Graphs</button></Link>
        </div> : <></>}
        <button className="nav_opener" onClick={()=>{isVision(!vision)}}>N</button>
        
        </>
        
    )
}
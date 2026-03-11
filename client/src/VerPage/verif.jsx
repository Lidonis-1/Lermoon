import React, { useState } from "react";
import { Link } from "react-router-dom";
import './styles ver.css'


function login(callback){
    return(
        <div className="ver_box">
            <label className="label">
                name:  
                <input type="text"/>
            </label>

            <label className="label">
                password:
                <input type="text"/> 
            </label>

            <Link to='/Graphs' className="link">
             <button className="log_button" type="button">login
             </button>
            </Link>
            <button className="button_reg" onClick={()=>callback(true)}>register</button>
        </div>
        )}

function register(callback){
    return(
        <div className="ver_box">
            <label className="label">
                name:  
                <input type="text"/>
            </label>

            <label className="label">
                password:
                <input type="text"/> 
            </label>

            <label className="label">
                confirm password:
                <input type="text"/> 
            </label>
            <button className="button_reg" onClick={()=>callback(false)}>register</button>
        </div>
    )
}

export default function Verif_page(){
    const [status, setStatus] = useState(false)
    return<div className="ver_scen">
        {status?register(setStatus):login(setStatus)}
        
    </div>
    

}
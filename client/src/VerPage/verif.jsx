import React from "react";
import { Link } from "react-router-dom";
import './styles ver.css'


export default function Verif_page(){
    return<div className="ver_scen">
        <div className="ver_box">
            <Link to='/home'>
             <button className="log_button" type="button">login
             </button>
            </Link>
        </div>
    </div>
    

}
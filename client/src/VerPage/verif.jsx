import React, { useState } from "react";
import { Link } from "react-router-dom";
import './styles ver.css'


function Login(callback){   //форма входу (потрібна перевірка на на введені данні при login)
    const [name, setName]=useState("")
    const [password, setPasswword] = useState("")
    return(

        <div className="ver_box">
            <label className="label">
                name:  
                <input type="text" placeholder="enter your name" />
            </label>

            <label className="label">
                password:
                <input type="password" placeholder="enter your password"/> 
            </label>

            <Link to='/Graphs' className="link">
             <button className="log_button" type="button">login
             </button>
            </Link>

            <button className="button_reg" onClick={()=>callback(true)}>register</button>
        </div>
        )}

function Register(callback){    //форма регистрації ()
    const [name, setName] = useState("")
    const [password, setPasswword] = useState("")

   function Logging(){
    
    if(localStorage.getItem(name) !== 0){
        localStorage.setItem(name,password)
    }
    else{
        throw new Error("user allready exist in local host")
    }
    callback(false);
    return
   }

    return(
        <div className="ver_box">
            <label className="label">
                name:  
                <input 
                type="text" 
                placeholder="come up with a name" 
                onChange={(n)=>setName(n.target.value)}/>
            </label>

            <label className="label">    
                password:
                <input 
                type="password"     
                placeholder="come up with a password" 
                onChange={(pas)=>setPasswword(pas.target.value)}/> 
            </label>

            <label className="label">
                confirm password:
                <input type="password" placeholder="confirm it"/> 
            </label>
            <button className="button_reg" onClick={Logging}>register</button>
        </div>
    )
}

export default function Verif_page(){   //сторінка (змінити механізм зміни форм)
    const [status, setStatus] = useState(false)
    return<div className="ver_scen">
        {status?Register(setStatus):Login(setStatus)}
        
    </div>
    

}
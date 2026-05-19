import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";

import './Profile.css'
import Start from "../GraphsPage/Graps";
import {idGenerator} from "./ObjGen";




const gen = idGenerator(20);

export default function Profile(){

  const [creation, setCreation ] = useState(false) 
  const [wName, setWName] = useState("")
  const [problem, setProblem] = useState(false)

  const [works, setWorks] = useState([]);  // збережені сторінки
  const [newWorks, setNewWorks] = useState([]); // не збережені сторінки



  async function getWorks() { // витягування завантажених на сервак шляхів до сторінок
    try{
      const response = await fetch("http://localhost:8080/profile")
      if (!response.ok) throw new Error(`помилка: ${response.status}`);
      const newData = await response.json()
      setWorks(newData)

    }catch(err){
      console.error(err)
    }
  }
  
  useEffect(()=>{ //спрацювання функції при кожному завантаженні сторінки 
    getWorks()
  },[])

  async function addWork(){  // завантаження нового шляху для сторінки
    if (wName === ""){
      setProblem("Пу пу пу")
      return
    }
    const pathId = wName;
    const updatedNewWorks = [...newWorks, pathId]
    setNewWorks(updatedNewWorks)
    try{

      const response = await fetch("http://localhost:8080/profile",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({workID: pathId})
      })

      if (!response.ok) throw new Error(`помилка: ${response.status}`);
      setCreation(false)
      setProblem(false)
    }catch(err){
      console.error(err)
    }
  }

  return (
    <div className="profile_scen">
      <div className="user_part"></div>
      
      <div className="library_part">
        {works.map((place, skey) => (
          <Link key={`work-${skey}`} to={`/work/${place}`}>
            <div className="work-box">
              image
            </div>
          </Link>
        ))}

        {newWorks.map((place, skey) => (
          <Link key={`new-work-${skey}`} to={`/work/${place}`}>
            <div className="work-box">
              image
            </div>
          </Link>
        ))}

        <button onClick={()=>{setCreation(true)}} className="add-btn">
          +
        </button>
        {creation? 
        <div className="wCraetion">
          {problem?<p>{problem}</p>:<></>}
          <p>
            Enter name of your work
          </p>
          <input 
          type="text"
          className="wNameIn"
          onChange={(e)=>{setWName(e.target.value)}}
          value={wName}
          ></input>
          <div className="bContainer">
            <button className="bCreation" onClick={addWork}>Ok</button>
            <button className="bCreation" onClick={()=>{setCreation(false)
              setProblem(false)
            }}>Cancel</button>
          </div>
        </div>
          :<></>}
      </div>
    </div>
  );
}
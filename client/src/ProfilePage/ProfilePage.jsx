import React,{ useEffect, useState } from "react";
import { Link } from "react-router-dom";

import './Profile.css'
import Start from "../GraphsPage/Graps";
import {idGenerator} from "./ObjGen";



const gen = idGenerator(20);

export default function Profile(){
    const [works, setWorks] = useState([]); 
    const [newWorks, setNewWorks] = useState([]);



    async function getWorks() {
      try{
        const response = await fetch("http://localhost:8080/profile")
        if (!response.ok) throw new Error(`помилка: ${response.status}`);
        const newData = await response.json()
        setWorks(newData)

      }catch(err){
        console.error(err)
      }
    }
    
    useEffect(()=>{
      getWorks()
    },[])

    async function addWork(){ 
      const pathId = gen.next().value;
      const updatedNewWorks = [...newWorks, pathId]
      setNewWorks(updatedNewWorks)
      try{

        const response = await fetch("http://localhost:8080/profile",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({workID: pathId})
        })

        if (!response.ok) throw new Error(`помилка: ${response.status}`);
      }catch(err){
        console.error(err)
      }
    }
  
    return <div className="profile_scen">
        <div className="user_part"></div>
        <div className="library_part">
          {works.map((place, skey) => (
        <Link
        key={`${skey}`}
          to={`/work/${place}`}
        >
          <div className="work-box">
            image
          </div>
        </Link>
      ))}


          {newWorks.map((place, skey) => (
        <Link
        key={`${skey}`}
          to={`/work/${place}`}
        >
          <div className="work-box">
            image
          </div>
        </Link>
      ))}

      <button onClick={addWork} className="add-btn">
        +
      </button>
        </div>
    </div>
}
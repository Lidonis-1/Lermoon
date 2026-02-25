import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";


import './Profile.css'
import Start from "../GraphsPage/Graps";

function* idGenerator() {
    
    let randomId = crypto.randomUUID()
  while (true) {
    
    yield `/work/${randomId}`
    randomId = crypto.randomUUID()
    
    
  }
}

const gen = idGenerator()
export default function Profile(){
    const [works, setWorks] = useState([])

    const addWork = () => {
    const id = gen.next().value
    setWorks((befor) => [...befor, id])
  }



    return <div className="profile_scen">
        
        <div className="user_part"></div>
        
        <div className="library_part">
            {works.map((place, skey) => (
        <Link
        key={`${skey}`}
          to={place}
          style={{ textDecoration: "none", marginRight: "12px" }}
        >
          <div className="work-box">
            work
          </div>
        </Link>
      ))}

      <button onClick={addWork} className="add-btn">
        +
      </button>
        </div>
    </div>
}
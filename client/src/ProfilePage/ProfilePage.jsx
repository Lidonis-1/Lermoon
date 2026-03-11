import React,{ useState } from "react";
import { Link } from "react-router-dom";

import './Profile.css'
import Start from "../GraphsPage/Graps";
import {idGenerator} from "../../ObjGen";



const gen = idGenerator(10,100, "work");

export default function Profile(){
    const [works, setWorks] = useState([]);

    const addWork = () => {

    const id = gen.next().value;
    setWorks((before) => [...before, id]);
  }
    return <div className="profile_scen">
        <div className="user_part"></div>
        <div className="library_part">
            {works.map((place, skey) => (
        <Link
        key={`${skey}`}
          to={place}
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
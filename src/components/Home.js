import React from 'react'
import './Home.css'
import { Link } from 'react-router-dom'
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { FaRegKeyboard } from "react-icons/fa";
import { MdOutlinePhotoCamera } from "react-icons/md";

function Home() {
  return (
    <div className="home-cont">
        <div className="button-calendar">
            <div className="mini-calendar">
                <h1>Select a day!</h1>

                <div className="week">
                    <div className="day">
                        <p>Two Days Ago</p>
                        <div className="dayoptions">
                            <div className="dayoption">Complete?</div>
                            <div className="dayoption">Edit</div>
                            <div className="dayoption">Delete</div>
                        </div>
                    </div>
                    <div className="day">
                        <p>Yesterday</p>
                    <div className="dayoptions">
                            <div className="dayoption">Complete?</div>
                            <div className="dayoption">Edit</div>
                            <div className="dayoption">Delete</div>
                        </div>
                    </div>
                    <div className="day">
                        <p>Today</p>
                    <div className="dayoptions">
                            <div className="dayoption">Complete?</div>
                            <div className="dayoption">Edit</div>
                            <div className="dayoption">Delete</div>
                        </div>
                    </div>
                </div>
                <div className="tipoftheday">
                    <h1>Tip of the Day</h1>
                    <p>Things that seem insignificant now could be worth remembering later.</p>
                </div>


            </div>
            
        </div>
        <div className="journal-entry">
            <h1>Journal Entry Input</h1>
                <div className="input-selector">
                    <Link to="/voice" className="input-button voice"><MdOutlineKeyboardVoice /></Link>
                    <Link to="/type" className="input-button type"><FaRegKeyboard /></Link>
                    <Link to="/photo" className="input-button photo"><MdOutlinePhotoCamera /></Link>

                </div>
            </div>

    </div>
  )
}

export default Home

import React, { useState, useEffect }from 'react'
import './Home.css'
//import { MdOutlineKeyboardVoice,  MdOutlinePhotoCamera , MdDelete } from "react-icons/md";
import { FaEdit, FaEye, FaShareSquare } from "react-icons/fa";
import JournalEntry from './JournalEntry';
// import axios from 'axios';

function Home() {
    const [currentDay, setCurrentDay] = useState('');
    const [yesterday, setYesterday] = useState('');
    const [twoDaysAgo, setTwoDaysAgo] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [viewOption, setViewOption] = useState('');

    useEffect(() => {
        const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };

        const today = new Date();
        const todayString = today.toLocaleDateString(undefined, options);
        
        // Split the date string into parts
        const [weekday, ...rest] = todayString.split(', ');
        const formattedTodayString = `${weekday},<br />${rest.join(', ')}`;

        setCurrentDay(formattedTodayString);

        const yesterdayDate = new Date(today);
        yesterdayDate.setDate(today.getDate() - 1);
        const yesterdayString = yesterdayDate.toLocaleDateString(undefined, options);
        
        // Split the date string into parts
        const [weekday1, ...rest1] = yesterdayString.split(', ');
        const formattedYesterString = `${weekday1},<br />${rest1.join(', ')}`;

        setYesterday(formattedYesterString);

        const twoDaysAgoDate = new Date(today);
        twoDaysAgoDate.setDate(today.getDate() - 2);
        const twoDaysAgoString = twoDaysAgoDate.toLocaleDateString(undefined, options);
        const [weekday2, ...rest2] = twoDaysAgoString.split(', ');
        const formatted2dayString = `${weekday2},<br />${rest2.join(', ')}`;

        setTwoDaysAgo(formatted2dayString);


        console.log(`Selected Day: ${selectedDay}, View Option: ${viewOption}`);
    }, [selectedDay, viewOption]);




  return (
    <div className="home-cont">
        <div className="button-calendar">
            <div className="mini-calendar">
                <h1>Select a day!</h1>

                <div className="week">
                    <div className="day">
                        <div className="pcont" >
                            <p><strong>Two Days Ago</strong></p>
                            <p dangerouslySetInnerHTML={{ __html: twoDaysAgo }} />
                        </div>
                        <div className="dayoptions">
                            <div className="dayoption" onClick={() => { setSelectedDay('twoDaysAgo1'); setViewOption('view'); }}><FaEye/>  </div>
                            <div className="dayoption" onClick={() => { setSelectedDay('twoDaysAgo1'); setViewOption('write'); }}><FaEdit/></div>
                            <div className="dayoption" onClick={() => { setSelectedDay('twoDaysAgo1'); setViewOption('share'); }}><FaShareSquare/></div>
                        </div>
                    </div>
                    <div className="day" onClick={() => setSelectedDay('yesterday1')}>
                        <div className="pcont">
                            <p><strong>Yesterday</strong></p>
                            <p dangerouslySetInnerHTML={{ __html: yesterday }} />
                        </div>
                    <div className="dayoptions">
                            <div className="dayoption" onClick={() => { setSelectedDay('yesterday1'); setViewOption('view'); }}><FaEye/> </div>
                            <div className="dayoption" onClick={() => { setSelectedDay('yesterday1'); setViewOption('write'); }}><FaEdit/></div>
                            <div className="dayoption" onClick={() => { setSelectedDay('yesterday1'); setViewOption('share'); }}><FaShareSquare/></div>
                        </div>
                    </div>
                    <div className="day" onClick={() => setSelectedDay('currentDay1')}>
                        <div className="pcont">  
                            <p><strong>Today</strong></p>
                            <p dangerouslySetInnerHTML={{ __html: currentDay }} />
                        </div>
                         <div className="dayoptions">
                            <div className="dayoption" onClick={() => { setSelectedDay('currentDay1'); setViewOption('view'); }}><FaEye/> </div>
                            <div className="dayoption" onClick={() => { setSelectedDay('currentDay1'); setViewOption('write'); }}><FaEdit/></div>
                            <div className= "dayoption" onClick={() => { setSelectedDay('currentDay1'); setViewOption('share'); }}><FaShareSquare/></div>
                        </div>
                    </div>
                </div>
                <div className="tipoftheday">
                    <h1>Tip of the Day</h1>
                    <p>Things that seem insignificant now could be worth remembering later.</p>
                </div>


            </div>
            
        </div>
        <JournalEntry 
                selectedDay={selectedDay} 
                viewOption = {viewOption}
                setViewOption = {setViewOption}
            />

    </div>
  )
}

export default Home

// <h1>Journal Entry Input</h1>
//                 <div className="input-selector">
//                     <Link to="/voice" className="input-button voice"><MdOutlineKeyboardVoice /></Link>
//                     <Link to="/type" className="input-button type"><FaRegKeyboard /></Link>
//                     <Link to="/photo" className="input-button photo"><MdOutlinePhotoCamera /></Link>

//                 </div>

import React, {useState, useEffect} from 'react';
import './JournalEntry.css';
import axios from 'axios';

const JournalEntry = ({ selectedDay, viewOption, setViewOption}) => {
    
    const [entries, setEntries] = useState([]);
    const [currentDay, setCurrentDay] = useState('');
    const [yesterday, setYesterday] = useState('');
    const [twoDaysAgo, setTwoDaysAgo] = useState('');
    const [textEntry, setTextEntry] = useState('');

    const getFormattedDate = (day) => {
        const today = new Date();
        switch (day) {
            case 'currentDay1':
                return today.toISOString().split('T')[0];
            case 'yesterday1':
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                return yesterday.toISOString().split('T')[0];
            case 'twoDaysAgo1':
                const twoDaysAgo = new Date(today);
                twoDaysAgo.setDate(today.getDate() - 2);
                return twoDaysAgo.toISOString().split('T')[0];
            default:
                return today.toISOString().split('T')[0];
        }
    };
    

    const renderDate = () => {
        switch (selectedDay) {
            case 'currentDay1':
                return <div className="daterender" dangerouslySetInnerHTML={{ __html: currentDay }} />;
            case 'yesterday1':
                return <div className="daterender" dangerouslySetInnerHTML={{ __html: yesterday }} />;
            case 'twoDaysAgo1':
                return <div className="daterender" dangerouslySetInnerHTML={{ __html: twoDaysAgo }} />;
            default:
                return <div className="daterender" >Select a day to view the journal entry.</div>;
        }
    };


    const formattedSelectedDay = getFormattedDate(selectedDay);

    useEffect(() => {
        // Load the previously written entry if it exists
        const existingEntry = entries.find(entry => {
            const entryDate = new Date(entry.entry_date).toISOString().split('T')[0];
            console.log('formatted', formattedSelectedDay);
            return entryDate === formattedSelectedDay;
        });
        if (existingEntry) {
            setTextEntry(existingEntry.content);
        } else {
            setTextEntry('');
        }
    }, [entries, formattedSelectedDay]);

    

    const handleSave = async () => {
        console.log('Formatted Selected Day:', formattedSelectedDay); // Debug log
    
        try {
            const response = await axios.put('http://localhost:3000/entries', {
                content: textEntry,
                entry_date: formattedSelectedDay
            });
    
            console.log('Update successful:', response.data);
    
            // Update the entries state with the updated entry
            setEntries(prevEntries => prevEntries.map(entry => 
                entry.entry_date === formattedSelectedDay ? { ...entry, content: textEntry } : entry
            ));
    
            setViewOption('view'); // Switch back to 'view' mode
        } catch (error) {
            console.error('Error updating entry:', error.response ? error.response.data : error.message);
        }
    };

    const renderViewOption = () => {
        switch (viewOption) {
            case 'view':
                return (<div className="viewcont">
                    <div className="buttoncont">
                        <div className="editButton" onClick={() => setViewOption('write')}>Edit</div>
                        <div className="closeButton" onClick={() => setViewOption('')}>X</div>
                    </div>
                    <div className="viewbox">
                    {entries
                            .filter(entry => {
                                const rawEntryDate = entry.entry_date;
                                const entryDate = new Date(rawEntryDate).toISOString().split('T')[0];
                                console.log(`Raw entry date: ${rawEntryDate}, Formatted entry date: ${entryDate}, Selected day: ${formattedSelectedDay}`);
                                return entryDate === formattedSelectedDay;
                            })
                            .map(entry => (
                                <div key={entry.id}>
                                    {entry.content}
                                </div>
                            ))
                        }

                    </div>
                </div>);
            case 'write':
                return (<div className="viewcont">
                    <div className="buttoncont">
                        <div className="editButton" onClick={handleSave}>Save</div>
                        <div className="closeButton" onClick={() => setViewOption('')}>X</div>
                    </div>
                    <div className="viewbox">
                        <textarea
                            value={textEntry}
                            onChange={(e) => setTextEntry(e.target.value)}
                            className="textEntry"
                        />

                    </div>
                </div>);
                case 'share':
                return <div>Sharing the journal entry for the selected day.</div>;
            default:
                return <div>Select an option to continue.</div>;
        }
    }

    useEffect(() => {
        // Logic to handle re-rendering or fetching data when selectedDay or viewOption changes
        // For example, you might fetch new data based on the selectedDay or viewOption
    }, [selectedDay, viewOption]);
     
    useEffect(() => {
        const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };

        const today = new Date();
        const todayString = today.toLocaleDateString(undefined, options);
        setCurrentDay(todayString);

        const yesterdayDate = new Date(today);
        yesterdayDate.setDate(today.getDate() - 1);
        const yesterdayString = yesterdayDate.toLocaleDateString(undefined, options);
        setYesterday(yesterdayString);

        const twoDaysAgoDate = new Date(today);
        twoDaysAgoDate.setDate(today.getDate() - 2);
        const twoDaysAgoString = twoDaysAgoDate.toLocaleDateString(undefined, options);

        setTwoDaysAgo(twoDaysAgoString);
    }, []);

    useEffect(() => {
        // Fetch journal entries from the backend
        axios.get('http://localhost:3000/entries')
            .then(response => {
                setEntries(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching journal entries:', error);
            });
    }, []);


    return (
        <div className="journal-entry">
            {renderDate()}
            {renderViewOption()}
        </div>
        
    );
};

export default JournalEntry;
import React, { useState, useEffect } from 'react';
import './JournalEntry.css';
import axios from 'axios';
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const JournalEntry = ({ selectedDay, viewOption, setViewOption }) => {
    const [entries, setEntries] = useState([]);
    const [currentDay, setCurrentDay] = useState('');
    const [yesterday, setYesterday] = useState('');
    const [twoDaysAgo, setTwoDaysAgo] = useState('');
    const [textEntry, setTextEntry] = useState('');
    const [healthIssues, setHealthIssues] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [interimText, setInterimText] = useState('');

    const {
        transcript,
        interimTranscript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (finalTranscript !== '') {
            const lastChar = textEntry.slice(-1);
            const punctuation = ['.', ',', '!', '?', ';', ':'];
            const needsSpace = lastChar && !lastChar.trim() && !punctuation.includes(lastChar);

            setTextEntry(prevText => prevText + (needsSpace ? ' ' : '') + finalTranscript);
            setInterimText('');
            resetTranscript();
        }
    }, [finalTranscript, textEntry, resetTranscript]);

    useEffect(() => {
        setInterimText(interimTranscript);
        console.log('Interim transcript:', interimTranscript);
    }, [interimTranscript]);

    useEffect(() => {
        console.log('Listening state:', listening);
    }, [listening]);

    const startListening = () => {
        setIsListening(true);
        SpeechRecognition.startListening({ continuous: true });
    };

    const stopListening = () => {
        setIsListening(false);
        setInterimText('');
        SpeechRecognition.stopListening();
    };

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
        axios.get('http://localhost:3000/entries')
            .then(response => {
                setEntries(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching journal entries:', error);
            });
    }, []);

    const handleSpeechToText = () => {
        if (listening) {
            stopListening();
        } else {
            startListening();
        }
    };

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
                return <div className="daterender">Select a day to view the journal entry.</div>;
        }
    };

    const formattedSelectedDay = getFormattedDate(selectedDay);

    useEffect(() => {
        const existingEntry = entries.find(entry => {
            const entryDate = new Date(entry.entry_date).toISOString().split('T')[0];
            return entryDate === formattedSelectedDay;
        });
        if (existingEntry) {
            setTextEntry(existingEntry.content);
        } else {
            setTextEntry('');
        }
    }, [entries, formattedSelectedDay]);

    const handleSave = async () => {
        try {
            const response = await axios.put('http://localhost:3000/entries', {
                content: textEntry,
                entry_date: formattedSelectedDay
            });

            setEntries(prevEntries => prevEntries.map(entry =>
                entry.entry_date === formattedSelectedDay ? { ...entry, content: textEntry } : entry
            ));

            setViewOption('view');
        } catch (error) {
            console.error('Error updating entry:', error.response ? error.response.data : error.message);
        }
    };

    const renderViewOption = () => {
        switch (viewOption) {
            case 'view':
                return (
                    <div className="viewcont">
                        <div className="buttoncont">
                            <div className="editButton" onClick={() => setViewOption('write')}>Edit</div>
                            <div className="submitButton" onClick={analyzeEntries}>Submit</div>
                            <div className="closeButton" onClick={() => setViewOption('')}>X</div>
                        </div>
                        <div className="viewbox">
                            {entries
                                .filter(entry => {
                                    const entryDate = new Date(entry.entry_date).toISOString().split('T')[0];
                                    return entryDate === formattedSelectedDay;
                                })
                                .map(entry => (
                                    <div key={entry.id}>
                                        {entry.content}
                                    </div>
                                ))
                            }
                            <br />
                            {healthIssues && <div className="healthIssues">{healthIssues}</div>}
                        </div>
                    </div>
                );
            case 'write':
                return (
                    <div className="viewcont">
                        <div className="buttoncont">
                            <div className="editButton" onClick={handleSave}>Save</div>
                            <div className="closeButton" onClick={() => setViewOption('')}>X</div>
                        </div>
                        <div className="viewbox">
                            <textarea
                                value={textEntry + interimText}
                                onChange={(e) => setTextEntry(e.target.value)}
                                className="textEntry"
                            />
                            <div onClick={handleSpeechToText} className="stt-button">
                                {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                            </div>
                        </div>
                    </div>
                );
            case 'share':
                return <div>Sharing the journal entry for the selected day.</div>;
            default:
                return <div>Select an option to continue.</div>;
        }
    };

    const analyzeEntries = async () => {
        const filteredEntries = entries
            .filter(entry => {
                const entryDate = new Date(entry.entry_date).toISOString().split('T')[0];
                return entryDate === formattedSelectedDay;
            })
            .map(entry => entry.content)
            .join('\n');

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: `Analyze the following journal entries for possible health issues:\n\n${filteredEntries}` }
                ],
                max_tokens: 150,
                temperature: 0.7,
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_API_KEY`
                }
            });

            const healthIssues = response.data.choices[0].message.content.trim();
            setHealthIssues(healthIssues);
        } catch (error) {
            console.error('Error analyzing entries:', error);
        }
    };

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    return (
        <div className="journal-entry">
            {renderDate()}
            {renderViewOption()}
        </div>
    );
};

export default JournalEntry;
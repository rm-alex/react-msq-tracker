import React, { useState, useRef, useEffect } from 'react';
import { quests, quest, data, clearCache } from 'garlandtools-api';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import MobileStepper from '@mui/material/MobileStepper';
import QuestList from "./QuestList";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import GenreProgress from './GenreProgress';
import GenreList from './GenreList';
import { elementAcceptingRef } from '@mui/utils';

const LOCAL_STORAGE_MSQ_DATA_KEY = 'msqTracker.data';
const LOCAL_STORAGE_LANGUAGE_KEY = 'msqTracker.lang';
const LOCAL_STORAGE_DATABASE_VERSION_KEY = 'msqTracker.dbVersion';
const LOCAL_STORAGE_SITE_VERSION_KEY = 'msqTracker.version';

function App() {

   const [language, setLanguage] = useState("en");

   const [questData, setQuestData] = useState('');
   const [genreData, setGenreData] = useState('');

   const [currentQuestIndex, setCurrentQuestIndex] = useState(200);
   const [loadingData, setLoadingData] = useState(true);

   const [inputQuestName, setInputQuestName] = useState('');
   const [selectedQuest, setSelectedQuest] = useState('');
   const [questList, setQuestList] = useState('');

   const [totalProgress, setTotalProgress] = useState(0);
   const [showCurrentOnly, setShowCurrentOnly] = useState(true);
   const [hideSpoilers, setHideSpoilers] = useState(true);
   const [hideCompleted, setHideCompleted] = useState(false);

   var totalQuestCount = 0;

   async function getQuests()
   {
      // Genres:
      // 1 - Seventh Umbral Era
      // 2 - Seventh Astral Era
      // 3 - Heavensward
      // 4 - Dragonsong War
      // 5 - Post-Dragonsong War
      // 6 - Stormblood
      // 7 - Post-Ala Mhigan Liberation
      // 8 - Shadowbringers
      // 9 - The Voyage Home
      // 10 - Dark Reprise
      // 11 - Endwalker
      // 12 - Newfound Adventure

      // cache the genre data, if necessary
      const garlandData = await data();
      
      const garlandQuestsData = await quests();
      const garlandGenreData = Object.values(garlandData.questGenreIndex);
      
      var startingData = garlandQuestsData.sort((a,b) => { return a.s - b.s }).sort((a,b)=> { return a.g - b.g; })
      .filter(element => garlandGenreData[element.g].section.includes("Main Scenario"))
      .filter(element => (element.l.includes('Thanalan') || element.l === 'Ul\'dah') && element.g === 1 && element.s >= 11 && element.s <= 90);

      console.log(startingData);

      var questsData = garlandQuestsData.sort((a,b) => { return a.s - b.s }).sort((a,b)=> { return a.g - b.g; })
      .filter(element => garlandGenreData[element.g].section.includes("Main Scenario"))
      .filter(element => element.g > 1 || element.s > 90)
      .filter(element => element.i !== 66217 && element.i !== 66218); // Remove the extra "The Company You Keep" quests
      
      var companyYouKeepQuest = questsData.find(element => element.i === 66216);
      companyYouKeepQuest.n = companyYouKeepQuest.n.split('(')[0].trim();

      console.log(questsData);

      setQuestData(questsData);

      // combine the data into one object.
      var newGenreData = garlandGenreData.filter(element => element.section.includes("Main Scenario"));

      for (var g in newGenreData) {
         const genreQuests = questsData.filter(element => element.g === newGenreData[g].id);
         const genreQuestCount = genreQuests.length;
         //newGenreData[g].questCount = genreQuestCount;
         newGenreData[g].startsAt = questsData.indexOf(genreQuests[0]);
         newGenreData[g].endsAt = questsData.indexOf(genreQuests[genreQuestCount-1]);
         totalQuestCount = totalQuestCount + genreQuestCount;
      }

      setGenreData(newGenreData);

      //console.log(newGenreData);

      const questNames = questsData.map((quest, i) => {
         return {key: quest.i, index: i, label: quest.n, id: quest.i, genre: quest.g};
      });

      setQuestList(questNames);

      setLoadingData(false);
   }

   useEffect(() => {
      getQuests();
   }, []);

   function getTotalQuestCount()
   {
      var questTotal = 0;
      for (var genre in genreData)
      {
         questTotal += genre.questCount;
      }

      return questTotal;
   }

   function getGenreName(genreId)
   {
      var version;
      var color = '';
      if (genreId < 3)
      {
         version = "2.0";
         color = 'primary'
      }
      else if (genreId < 6)
      {
         version = "3.0";
         color = 'primary';
      }
      else if (genreId < 8)
      {
         version = "4.0";
         color = 'error';
      }
      else if (genreId < 11)
      {
         version = "5.0";
         color = 'secondary';
      }
      else
      {
         version = "6.0";
         color = 'warning';
      }

      return <Chip label={version} color={color} size="small" />
   }

   // TODO: find way to put all progress bars in a line.

   function onQuestSelected(e, newValue)
   {
      setSelectedQuest(newValue);
      console.log(newValue);
      console.log(questList.length);

      const newQuestIndex = newValue ? newValue.index : 0;

      setTotalProgress(questList.length > 0 ? (newValue.index / (questList.length - 1)) * 100 : 0);
   }

   function getGenrePercentage(genreIndex)
   {
      const questCount = genreData[genreIndex].questCount;
      return Math.floor(Math.min(questCount, selectedQuest.index) / (questCount) * 100);
   }

   function handlePreviousQuest()
   {
      if (!selectedQuest)
         setSelectedQuest(questList[0]);

      const prevQuestIndex = Math.max(0,selectedQuest.index - 1);
      setSelectedQuest(questList[prevQuestIndex]);
   }

   function handleNextQuest()
   {
      if (!selectedQuest)
      setSelectedQuest(questList[0]);

      const nextQuestIndex = Math.min(selectedQuest.index + 1, questList.length-1);
      setSelectedQuest(questList[nextQuestIndex]);
   }

   function handleSpoilerChanged(e, newValue)
   {
      setHideSpoilers(newValue);
   }

   function handleCurrentOnlyChanged(e, newValue)
   {
      setShowCurrentOnly(newValue);
   }

   function handleHideCompletedChanged(e, newValue)
   {
      setHideCompleted(newValue);
   }

   return (
      <>
         {loadingData && <CircularProgress /> }
         { !loadingData && <div>
            { questList.length > 0 && <Autocomplete
               value={selectedQuest}
               onChange={onQuestSelected}
               inputValue={inputQuestName}
               onInputChange={(event, newValue) => { setInputQuestName(newValue);}}
               options={questList}
               isOptionEqualToValue={(option, value) => option.id === value.id}
               renderInput={(params) => <TextField {...params} label="Quest Name"/>}
            /> }
            <Checkbox checked={showCurrentOnly} onChange={handleCurrentOnlyChanged}/><label>Only Show Current Category</label>
            { !showCurrentOnly && 
               <>
                  <Checkbox checked={hideSpoilers} onChange={handleSpoilerChanged}/><label>Hide Spoiler Categories</label>
                  <Checkbox checked={hideCompleted} onChange={handleHideCompletedChanged}/><label>Hide Completed Categories</label>
               </> 
            }
            { selectedQuest && <>
               <div>Current Quest: <span>{selectedQuest.label}</span></div> 
               <button onClick={handlePreviousQuest}>Previous</button>
               <button onClick={handleNextQuest}>Next</button>
               <br/>
               <div>You are...</div>
               <GenreProgress quest={selectedQuest} max={questData.length} prefix="The" label="Main Story Questline" />
               <br/>
               {showCurrentOnly && <GenreProgress quest={selectedQuest} genre={genreData[selectedQuest.genre-1]}/>}
               {!showCurrentOnly && <GenreList quest={selectedQuest} genres={genreData} quests={questData} spoilers={hideSpoilers} hideCompleted={hideCompleted}/> }
               </>
            }
         </div> }
      </>
   );
}

export default App;

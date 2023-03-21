import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';

function GenreProgress({quest, label, prefix, genre, spoiler, max, hideIfComplete})
{
    // Get the amount of quests in this genre
    const questCount = max > 0 ? max : (genre ? (genre.endsAt - genre.startsAt) + 1 : 0);
    
    // Get the starting and ending quest indexes.
    const startIndex = genre ? genre.startsAt : 0;
    const endIndex = genre ? genre.endsAt : 0;

    const isAtEnd = quest ? quest.index === endIndex : false;

    // Get the quest index in respect to the current genre.
    const questIndex = quest ? quest.index - startIndex : 0;

    // Calculate the percentage.
    const percentage = questCount > 0 ? Math.max(0,Math.min(100, Math.floor(((questIndex+1) / questCount) * 100))) : 0;

    // Return the label to display, factoring in any prefixes, the spoiler parameter, and an override display name.
    function getDisplayLabel()
    {
        if (spoiler && questIndex < 0)
            return "???";

        const genreName = genre ? genre.name : '';
        const labelPrefix = prefix ? `${prefix} ` : '';
        const displayLabel = label ? label : genreName;

        return labelPrefix + displayLabel;
    }

    return (
        <>
            {(!hideIfComplete || percentage < 100 || isAtEnd) && 
                <div data-mui-color-scheme="light">
                    <LinearProgress variant="determinate" value={percentage}/>
                    <span>{questIndex >= 0 ? Math.min(questCount, questIndex + 1) : 0} out of {questCount} quests through {getDisplayLabel()} ({percentage}%)</span> {percentage >= 100 && <Chip label="Complete!" size="small" color="warning"/>}
                </div>
            }
        </>
    );
}

export default GenreProgress;
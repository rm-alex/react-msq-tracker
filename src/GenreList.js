import Reach from 'react';
import GenreProgress from './GenreProgress';

function GenreList({genres, quest, quests, spoilers, hideCompleted})
{
    return (
        <div>
            <GenreProgress quest={quest} genre={genres[0]} hideIfComplete={hideCompleted} label="A Realm Reborn" />
            <GenreProgress quest={quest} genre={genres[1]} hideIfComplete={hideCompleted} prefix="The" />
            <GenreProgress quest={quest} genre={genres[2]} hideIfComplete={hideCompleted} />
            <GenreProgress quest={quest} genre={genres[3]} hideIfComplete={hideCompleted} spoiler={spoilers} prefix="The" />
            <GenreProgress quest={quest} genre={genres[4]} hideIfComplete={hideCompleted} spoiler={spoilers}/>
            <GenreProgress quest={quest} genre={genres[5]} hideIfComplete={hideCompleted} />
            <GenreProgress quest={quest} genre={genres[6]} hideIfComplete={hideCompleted} spoiler={spoilers}/>
            <GenreProgress quest={quest} genre={genres[7]} hideIfComplete={hideCompleted} />
            <GenreProgress quest={quest} genre={genres[8]} hideIfComplete={hideCompleted} spoiler={spoilers}/>
            <GenreProgress quest={quest} genre={genres[9]} hideIfComplete={hideCompleted} spoiler={spoilers}/>
            <GenreProgress quest={quest} genre={genres[10]} hideIfComplete={hideCompleted} />
            <GenreProgress quest={quest} genre={genres[11]} hideIfComplete={hideCompleted} spoiler={spoilers} prefix="A" />
        </div>
    )
}

export default GenreList;
import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function QuestList({ questList, genreName, startOpen }) {

   const [open, setOpen] = useState(startOpen);

   function handleOnClick()
   {
      setOpen(!open);
   }

   return (
      <div>
         <List>
            <ListItemButton onClick={handleOnClick}>
               <ListItemIcon>
                  {open ? <ExpandLess /> : <ExpandMore />}
               </ListItemIcon>
               <ListItemText primary={genreName}/>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
               <List component="div" disablePadding>
                  {questList.map(q => (
                     <ListItemButton>
                        <ListItemText primary={q.n}/>
                     </ListItemButton>
                  ))}
               </List>
            </Collapse>
         </List>
      </div>
   )
}

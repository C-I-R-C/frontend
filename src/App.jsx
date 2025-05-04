import logo from './logo.svg';
// import './App.css';
import HeadName from './Head/Head';
import Button from './Button/Button';

import {Fragment, useState} from 'react'
import TabSection from './TabSection/TabSection';
import Section2 from './Section2/Section2';


export default function App() {
  const [tab, setTab] = useState('section1');

  return (
   
    <Fragment>

      <h3>
      <HeadName></HeadName>    

      </h3>

      <TabSection active={tab} onChange={(curent) => setTab(curent)}/>
      
     {tab === 'section1' && 
     (
      <>
      S1
      </>
     )
     }

     {tab === 'section2' &&
    (
      <Section2></Section2>
     )
     }
  
    
    </Fragment>
  );
}




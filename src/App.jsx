import logo from './logo.svg';
// import './App.css';
import HeadName from './Head/Head';
import Button from './Button/Button';

import {Fragment, useState} from 'react'

import TabSection from './TabSection/TabSection';

import MainPage from './MainPage/MainPage'

import AddOrder from './Section2/AddOrder';
import OrderTable from './Section2/OrdersTable';


import AddClients from './Section3/AddClient';
import ClientsTable from './Section3/ClientsTable'

import DITable from './MainPage/DeficitIngredients'

import Image from './Section4/table.png'

export default function App() {
  const [tab, setTab] = useState('section1');

  return (
   
    <Fragment  className="relative" >

      <h3>
      <HeadName></HeadName>    

      </h3>

      <TabSection active={tab} onChange={(curent) => setTab(curent)}/>
      
     {tab === 'section1' && 
     (
      <>
        <MainPage />
        <DITable />
      </>
     )
     }

     {tab === 'section2' &&
    (
      <>
      <AddOrder ></AddOrder>
      <OrderTable></OrderTable>

      </>
      
     )
     }

     {tab === 'section3' &&
    (
      <>
      <AddClients></AddClients>
      <ClientsTable></ClientsTable>
      </>
      
     )
     }

    {tab == 'section4' &&
    <>
    <img 

     style={{ 
    marginLeft: "400px",  
    marginTop: "-400px",   
   
    width: "1200px",
    height: "800px"

    }} 

    src = {Image} />
    </>
    }
    </Fragment>
  );
}




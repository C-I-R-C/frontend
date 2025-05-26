
import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './Layout';

import Login from './Components/Login/Login';
import Orders from './Components/Orders/Orders';
import Setting from './Components/OtherSetting/OtherSetting';
import Ingredients from './Components/OtherSetting/Ingredients/Ingredients';
import ColorsTable from './Components/OtherSetting/Colors/Colors';
import BoxesTable from './Components/OtherSetting/Boxes/Boxes';
import ClientsTable from './Components/Clients/Clients';
import Setting2 from './Components/Setting2/Setting2';
import Flower from './Components/Setting2/Flowers/Flower';
import Items from './Components/Setting2/Items/Items';
import StartPage from './Components/StartPage/StartPage';
import MainPage from './Components/MainPage/MainPage';
import  ProfitChart  from './Components/Finance/Finance';
import ProfitChart2 from './Components/Finance/Finance2';

const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    element: <Layout />, 
    children: [
      {
        path: "/mainpage",
        element: <MainPage />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/clients",
        element: <ClientsTable />,
      },
      {
        path: "/inventory",
        element: <Setting />,
      },
      {
        path: "/ingredients",
        element: <Ingredients />,
      },
      {
        path: "/colors",
        element: <ColorsTable />,
      },
      {
        path: "/boxes",
        element: <BoxesTable />,
      },
      {
        path: "/other",
        element: <Setting2 />,
      },
      {
        path: "/items",
        element: <Items />,
      },
      {
        path: "/itemflowers",
        element: <Flower />,
      },
      {
        path: "/finance",
        element: <> <ProfitChart/> </>,
      },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />
}

export default App


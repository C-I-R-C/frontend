import { Outlet } from 'react-router-dom';
import Header from './Components/TopHeader/Topheader';

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> 
      </main>
    </>
  );
};

export default Layout;
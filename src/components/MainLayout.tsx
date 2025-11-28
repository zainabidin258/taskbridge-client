import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className='flex h-screen'>
      <div className='flex shrink-0'>
        <Sidebar />
      </div>
      <main className='flex flex-1 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

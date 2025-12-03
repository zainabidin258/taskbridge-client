import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import AppHeader from '@/components/header';

const MainLayout = () => {
  return (
    <div className='flex h-screen w-screen'>
      <Sidebar />
      <div className='flex flex-col flex-1 min-h-0'>
        <AppHeader />
        <main className='flex-1 min-h-0 overflow-auto bg-red-500'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

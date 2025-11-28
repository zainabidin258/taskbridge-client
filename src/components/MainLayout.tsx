import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';

const MainLayout = () => {
  return (
    <div className='grid grid-cols-[250px_1fr]'>
      <Sidebar />

      <main className=''>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

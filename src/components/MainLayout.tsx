import { Outlet } from 'react-router-dom';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/index';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const MainContent = () => {
  const { open } = useSidebar();

  return (
    <main
      className={cn(
        'flex flex-1 transition-all duration-200 ease-linear',
        open
          ? 'md:ml-[var(--sidebar-width)]'
          : 'md:ml-[var(--sidebar-width-icon)]'
      )}
    >
      <Outlet />
    </main>
  );
};

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <div className='h-full'>
          <SidebarTrigger />
          <AppSidebar />
        </div>
        <MainContent />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

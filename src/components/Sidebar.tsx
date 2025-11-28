// Sidebar.tsx
import { AppSidebar } from '@/components/sidebar/index';
import { SidebarProvider, SidebarTrigger } from './ui/sidebar';

export function Sidebar() {
  return (
    <SidebarProvider>
      <div className='h-full w-full'>
        <SidebarTrigger />
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
}

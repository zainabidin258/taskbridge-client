// AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  return (
    <>
      <Sidebar className='h-full bg-white border-r border-gray-200'>
        <SidebarTrigger />
        <SidebarHeader className='flex items-center justify-between py-3'>
          <h2 className='text-lg font-bold'>TaskBridge</h2>
        </SidebarHeader>

        <SidebarContent className='flex-1 overflow-y-auto'>
          <SidebarGroup>
            <h3 className='px-4 py-2 font-semibold text-gray-700'>Boards</h3>
            <ul>
              <li className='px-4 py-1 hover:bg-gray-100 cursor-pointer'>
                Project Alpha
              </li>
              <li className='px-4 py-1 hover:bg-gray-100 cursor-pointer'>
                Marketing Campaign
              </li>
              <li className='px-4 py-1 hover:bg-gray-100 cursor-pointer'>
                Design Sprint
              </li>
            </ul>
          </SidebarGroup>

          <SidebarGroup>
            <h3 className='px-4 py-2 font-semibold text-gray-700'>Teams</h3>
            <ul>
              <li className='px-4 py-1 hover:bg-gray-100 cursor-pointer'>
                Frontend
              </li>
              <li className='px-4 py-1 hover:bg-gray-100 cursor-pointer'>
                Backend
              </li>
              <li className='px-4 py-1 hover:bg-gray-100 cursor-pointer'>
                Design
              </li>
            </ul>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <div className='px-4 py-3 text-sm text-gray-500'>
            Logged in as <strong>Zain</strong>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}

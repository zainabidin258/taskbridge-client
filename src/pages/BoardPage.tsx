import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DragDropContext } from '@hello-pangea/dnd';
import { COLUMNS } from '@/constants/columns';
import KanbanColumn from '@/components/KanbanColumn';
import { handleDragEnd } from '@/utils/dragDrop';
import type { Task } from '@/types/Task';
import type { IBoard } from '@/types/Board';

import api from '@/api/axios';

const fetchBoard = async (boardId: string): Promise<IBoard> => {
  const response = await api.get(`/api/boards/${boardId}`);
  return response.data;
};

const fetchTasks = async (boardId: string): Promise<Task[]> => {
  const response = await api.get(`/api/tasks/board/${boardId}`);
  return response.data;
};

const BoardPage = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();

  const {
    data: board,
    isLoading: boardLoading,
    isError: boardError,
  } = useQuery<IBoard>({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId!),
    enabled: !!boardId,
  });

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
    refetch: refetchTasks,
  } = useQuery<Task[]>({
    queryKey: ['tasks', boardId],
    queryFn: () => fetchTasks(boardId!),
    enabled: !!boardId,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    handleDragEnd(result, tasks || [], refetchTasks, queryClient);
  };

  const handleTaskCreated = () => {
    refetchTasks();
  };

  if (boardLoading || tasksLoading) return <div>Loading...</div>;
  if (boardError || tasksError) return <div>Error loading data</div>;

  return (
    <div className='min-h-screen bg-white'>
      {/* Sticky Header */}
      <div className='sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-8 py-6 flex justify-between items-center shadow-sm'>
        <div className='space-y-1'>
          <div className='flex items-center gap-3'>
            <div className='w-2 h-2 rounded-full bg-indigo-500 animate-pulse'></div>
            <h1 className='text-3xl font-bold text-gray-900'>{board?.title}</h1>
          </div>
          <p className='text-gray-600 text-lg max-w-2xl'>
            {board?.description}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          <button className='px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all font-medium flex items-center gap-2'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 6v6m0 0v6m0-6h6m-6 0H6'
              />
            </svg>
            Add Column
          </button>
          <button className='px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 4v16m8-8H4'
              />
            </svg>
            Add Task
          </button>
        </div>
      </div>

      {/* Board Stats */}
      <div className='px-8 py-4 border-b border-gray-100 bg-gray-50/50'>
        <div className='flex items-center gap-6 text-sm'>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-red-500'></span>
            <span className='text-gray-700'>
              To Do: {tasks?.filter((t: Task) => t.status === 'todo').length}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-blue-500'></span>
            <span className='text-gray-700'>
              In Progress:{' '}
              {tasks?.filter((t: Task) => t.status === 'in-progress').length}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-green-500'></span>
            <span className='text-gray-700'>
              Done: {tasks?.filter((t: Task) => t.status === 'done').length}
            </span>
          </div>
          <div className='text-gray-500'>Total: {tasks?.length} tasks</div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className='p-8'>
          <div className='flex gap-6 min-w-max'>
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasks || []}
                boardId={boardId!}
                onTaskCreated={handleTaskCreated}
              />
            ))}

            {/* Add Column Card */}
            <div className='w-[340px] flex-shrink-0'>
              <button className='w-full h-full min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-300 transition-all flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600 group'>
                <div className='w-14 h-14 rounded-full bg-white border-2 border-dashed border-gray-300 group-hover:border-indigo-300 flex items-center justify-center mb-4 transition-all'>
                  <svg
                    className='w-7 h-7 group-hover:scale-110 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 4v16m8-8H4'
                    />
                  </svg>
                </div>
                <p className='text-lg font-medium'>Add new column</p>
                <p className='text-sm mt-2 max-w-xs text-center'>
                  Create a new workflow stage
                </p>
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Empty State (if no tasks at all) */}
      {tasks?.length === 0 && (
        <div className='flex-1 flex flex-col items-center justify-center p-12 text-center'>
          <div className='w-24 h-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center mb-6'>
            <svg
              className='w-12 h-12 text-indigo-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
              />
            </svg>
          </div>
          <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
            No tasks yet
          </h3>
          <p className='text-gray-600 max-w-md mb-6'>
            Get started by creating your first task. Tasks help you organize and
            track work across your team.
          </p>
          <button
            onClick={() => {
              // This would open a modal for the first task
              // For now, you can implement this similarly to the column add task
            }}
            className='px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:shadow-lg'
          >
            Create Your First Task
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardPage;

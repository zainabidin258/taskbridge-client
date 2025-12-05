import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DragDropContext } from '@hello-pangea/dnd';
import { COLUMNS } from '@/constants/columns';
import KanbanColumn from '@/components/KanbanColumn';
import { handleDragEnd } from '@/utils/dragDrop';
import type { Task } from '@/types/Task';
import type { IBoard } from '@/types/Board';
import { useState } from 'react';

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
  const [showTip, setShowTip] = useState(true);

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

      {/* Empty State Tip (if no tasks at all) */}
      {tasks?.length === 0 && showTip && (
        <div className='fixed top-30 right-8 z-40 animate-bounce ease-in duration-1400'>
          <div className='bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs relative'>
            {/* Arrow pointing down */}
            <div className='absolute -top-2 right-8 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45'></div>

            <div className='flex items-start gap-3'>
              <div className='w-8 h-8 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center flex-shrink-0'>
                <svg
                  className='w-4 h-4 text-indigo-500'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <div className='flex-1'>
                <h4 className='font-semibold text-gray-900 text-sm mb-1'>
                  Ready to get started?
                </h4>
                <p className='text-gray-600 text-xs'>
                  Create your first task to organize your work and track
                  progress.
                </p>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className='text-gray-400 hover:text-gray-600 transition ml-2 cursor-pointer'
              >
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;

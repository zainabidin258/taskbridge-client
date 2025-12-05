import { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type {
  DroppableProvided,
  DroppableStateSnapshot,
} from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import type { Column } from '@/constants/columns';
import type { Task } from '@/types/Task';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  boardId: string;
  onTaskCreated: () => void;
}

const KanbanColumn = ({
  column,
  tasks,
  boardId,
  onTaskCreated,
}: KanbanColumnProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columnTasks = tasks.filter((t: Task) => t.status === column.id);

  return (
    <Droppable droppableId={column.id}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`w-[340px] h-[600px] flex flex-col shrink-0 ${column.color} rounded-2xl p-5 border ${column.borderColor} transition-all overflow-hidden ${
            snapshot.isDraggingOver
              ? 'ring-2 ring-indigo-200 ring-offset-1'
              : ''
          }`}
        >
          {/* Column Header */}
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-3'>
              <h2 className='font-bold text-gray-800 uppercase tracking-wider text-sm'>
                {column.title}
              </h2>
              <span className='bg-white px-2.5 py-1 rounded-full text-sm font-medium shadow-sm border'>
                {columnTasks.length}
              </span>
            </div>
            <button className='text-gray-400 hover:text-gray-600 p-1.5 hover:bg-white rounded-lg transition'>
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
                  d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                />
              </svg>
            </button>
          </div>

          {/* Tasks Container */}
          <div className='flex flex-col gap-3 flex-1 min-h-[400px] overflow-y-auto'>
            {columnTasks.length === 0 ? (
              <div className='flex-1 flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-300 rounded-xl bg-white/50'>
                <svg
                  className='w-12 h-12 mb-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z'
                  />
                </svg>
                <p className='text-sm'>No tasks here</p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className='mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium'
                >
                  + Add a task
                </button>
              </div>
            ) : (
              columnTasks.map((task: Task, index: number) => (
                <TaskCard key={task._id} task={task} index={index} />
              ))
            )}
            {provided.placeholder}
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className='mt-4 w-full py-3 text-gray-500 hover:text-gray-700 hover:bg-white rounded-xl border border-dashed border-gray-300 transition flex items-center justify-center gap-2 font-medium'
          >
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

          <AddTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onTaskCreated={onTaskCreated}
            boardId={boardId}
            defaultStatus={column.id}
          />
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;

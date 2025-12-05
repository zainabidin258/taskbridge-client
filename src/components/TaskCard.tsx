import { Draggable } from '@hello-pangea/dnd';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import type { Task } from '@/types/Task';

interface TaskCardProps {
  task: Task;
  index: number;
}

const TaskCard = ({ task, index }: TaskCardProps) => {
  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-move border border-gray-200 hover:border-gray-300 group ${
            snapshot.isDragging ? 'shadow-lg rotate-1 scale-[1.02]' : ''
          }`}
        >
          {/* Task Header */}
          <div className='flex justify-between items-start mb-3'>
            <h3 className='font-semibold text-gray-900 pr-4'>{task.title}</h3>
            <button className='opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition'>
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

          {/* Task Description */}
          {task.description && (
            <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
              {task.description}
            </p>
          )}

          {/* Task Meta */}
          <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
            <div className='flex items-center gap-2'>
              {task.priority && (
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.priority}
                </span>
              )}
              {task.labels && task.labels.length > 0 && (
                <span className='text-xs text-gray-500'>
                  {task.labels.length} labels
                </span>
              )}
            </div>
            {task.assignee && (
              <div className='w-7 h-7 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white'>
                {task.assignee.charAt(0)}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;

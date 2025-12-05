import { useState, useRef, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Draggable } from '@hello-pangea/dnd';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from '@hello-pangea/dnd';
import type { Task } from '@/types/Task';
import AddTaskModal from './AddTaskModal';
import DeleteModal from './DeleteModal';
import { EditIcon, DeleteIcon, LoadingIcon } from './icons';
import api from '@/api/axios';

interface TaskCardProps {
  task: Task;
  index: number;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

const TaskCard = ({
  task,
  index,
  onTaskUpdated,
  onTaskDeleted,
}: TaskCardProps) => {
  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const updateTaskMutation = useMutation({
    mutationFn: async (newTitle: string) => {
      await api.put(`/api/tasks/${task._id}`, {
        title: newTitle.trim(),
      });
    },
    onMutate: async (newTitle) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', task.board] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks', task.board]);

      // Optimistically update to the new value
      queryClient.setQueryData(['tasks', task.board], (oldTasks: Task[] = []) =>
        oldTasks.map((t) =>
          t._id === task._id ? { ...t, title: newTitle.trim() } : t
        )
      );

      return { previousTasks };
    },
    onError: (error, newTitle, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['tasks', task.board], context?.previousTasks);
      console.error('Failed to update task title:', error);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks', task.board] });
      onTaskUpdated?.();
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/api/tasks/${task._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', task.board] });
      onTaskDeleted?.();
      setIsDeleteModalOpen(false);
    },
    onError: (error) => {
      console.error('Failed to delete task:', error);
    },
  });

  // Close inline editing when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isEditingTitle &&
        titleInputRef.current &&
        !titleInputRef.current.contains(event.target as Node)
      ) {
        setIsEditingTitle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditingTitle]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      updateTaskMutation.mutate(editedTitle);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteTask = () => {
    setIsDeleteModalOpen(true);
  };
  return (
    <>
      <Draggable key={task._id} draggableId={task._id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`p-5 rounded-xl bg-white shadow-sm hover:shadow-md transition-all cursor-grabbing border border-gray-200 hover:border-gray-300 group ${
              snapshot.isDragging ? 'shadow-lg rotate-1 scale-[1.02]' : ''
            }`}
          >
            {/* Task Header */}
            <div className='flex justify-between items-start mb-3'>
              <div className='flex-1 pr-4'>
                {isEditingTitle ? (
                  <input
                    ref={titleInputRef}
                    type='text'
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onBlur={handleTitleSubmit}
                    className='font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-indigo-500 outline-none w-full'
                  />
                ) : (
                  <div className='flex items-center gap-2'>
                    {updateTaskMutation.isPending && (
                      <LoadingIcon className='h-4 w-4 text-indigo-600' />
                    )}
                    <h3
                      className='font-semibold text-gray-900 hover:text-indigo-600 cursor-text transition-colors'
                      onClick={() =>
                        !updateTaskMutation.isPending && setIsEditingTitle(true)
                      }
                      title='Click to edit title'
                    >
                      {task.title}
                    </h3>
                  </div>
                )}
              </div>

              <div className='flex gap-1'>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className='text-gray-400 hover:text-gray-600 transition p-1 cursor-pointer'
                  title='Edit task'
                >
                  <EditIcon />
                </button>
                <button
                  onClick={handleDeleteTask}
                  className='text-gray-400 hover:text-red-600 transition p-1 cursor-pointer'
                  title='Delete task'
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            {/* Task Description */}
            {task.description && (
              <div
                className='text-sm text-gray-600 mb-4 line-clamp-2 prose prose-sm max-w-none [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 [&_li]:m-0'
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
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
                <div className='w-7 h-7 rounded-full bg-linear-to-r from-blue-400 to-purple-500 flex items-center justify-center text-xs font-medium text-white'>
                  {task.assignee.charAt(0)}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
      {/* Edit Task Modal */}
      <AddTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onTaskCreated={() => {
          setIsEditModalOpen(false);
          onTaskUpdated?.();
        }}
        boardId={task.board}
        defaultStatus={task.status}
        existingTask={task}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteTaskMutation.mutate()}
        title='Delete Task'
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText='Delete Task'
        isLoading={deleteTaskMutation.isPending}
      />
    </>
  );
};

export default TaskCard;

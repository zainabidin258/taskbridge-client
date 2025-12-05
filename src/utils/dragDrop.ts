import api from '@/api/axios';
import type { DropResult } from '@hello-pangea/dnd';
import type { Task } from '@/types/Task';
import type { QueryClient } from '@tanstack/react-query';

export const updateTaskStatus = async (taskId: string, newStatus: string) => {
  console.log('Updating task:', taskId, 'to status:', newStatus);
  try {
    const response = await api.put(`/api/tasks/${taskId}`, {
      status: newStatus,
    });
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update task error:', error);
    throw error;
  }
};

export const handleDragEnd = async (
  result: DropResult,
  tasks: Task[],
  refetch: () => void,
  queryClient: QueryClient
) => {
  console.log('Drag end result:', result);

  if (!result.destination) {
    console.log('No destination, returning');
    return;
  }

  const { source, destination } = result;
  console.log('Source:', source, 'Destination:', destination);

  // If dropped in the same position, do nothing
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    console.log('Same position, returning');
    return;
  }

  try {
    // Find the task being moved
    const task = tasks.find((t: Task) => t._id === result.draggableId);
    console.log('Found task:', task);

    if (task) {
      // Only update if moving to different column
      if (task.status !== destination.droppableId) {
        console.log(
          'Updating task status from',
          task.status,
          'to',
          destination.droppableId
        );

        // Optimistically update the cache
        const queryKey = ['tasks', task.board];
        queryClient.setQueryData(queryKey, (oldTasks: Task[] = []) => {
          return oldTasks.map((t: Task) =>
            t._id === task._id ? { ...t, status: destination.droppableId } : t
          );
        });

        try {
          // Update task status in backend
          await updateTaskStatus(task._id, destination.droppableId);
          console.log('Backend update successful');
        } catch (error) {
          // Revert optimistic update on error
          console.error('Backend update failed, reverting:', error);
          queryClient.invalidateQueries(queryKey);
          throw error;
        }
      }
    } else {
      console.log('Task not found with ID:', result.draggableId);
    }
  } catch (error) {
    console.error('Failed to update task status:', error);
    // Optionally show error notification to user
  }
};

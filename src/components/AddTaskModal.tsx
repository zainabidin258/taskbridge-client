import { useState, useEffect } from 'react';
import { taskService } from '@/services';
import type { Task } from '@/types/Task';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import RichTextEditor from '@/components/RichTextEditor';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  boardId: string;
  defaultStatus?: string;
  existingTask?: Task | null;
}

const AddTaskModal = ({
  isOpen,
  onClose,
  onTaskCreated,
  boardId,
  defaultStatus = 'todo',
  existingTask = null,
}: AddTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(defaultStatus);
  const [priority, setPriority] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  // Populate form when editing existing task
  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description || '');
      setStatus(existingTask.status);
      setPriority(existingTask.priority || 'medium');
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
    }
  }, [existingTask, defaultStatus, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);
    try {
      if (existingTask) {
        // Update existing task
        await taskService.updateTask(existingTask._id, {
          title: title.trim(),
          description: description,
          status,
          priority,
        });
      } else {
        // Create new task
        await taskService.createTask({
          title: title.trim(),
          description: description,
          status,
          board: boardId,
          priority,
        });
      }

      onTaskCreated();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>
            {existingTask ? 'Edit Task' : 'Add New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title *</Label>
            <Input
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter task title'
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder='Enter task description...'
            />
          </div>

          <div className='flex gap-8 justify-evenly'>
            <div className='space-y-2 w-full'>
              <Label htmlFor='status'>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='todo'>To Do</SelectItem>
                  <SelectItem value='in-progress'>In Progress</SelectItem>
                  <SelectItem value='done'>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2 w-full'>
              <Label htmlFor='priority'>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='low'>Low</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='high'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isLoading || !title.trim()}
              className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
            >
              {isLoading
                ? existingTask
                  ? 'Updating...'
                  : 'Creating...'
                : existingTask
                  ? 'Update Task'
                  : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;

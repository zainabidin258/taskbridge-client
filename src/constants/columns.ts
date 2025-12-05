export interface Column {
  id: string;
  title: string;
  color: string;
  borderColor: string;
}

export const COLUMNS: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'done',
    title: 'Done',
    color: 'bg-green-50',
    borderColor: 'border-green-200',
  },
];

export const getStatusTitle = (status: string): string => {
  return (
    COLUMNS.find((col) => col.id === status)?.title || status.replace('-', ' ')
  );
};

export const getColumnColor = (status: string): string => {
  return COLUMNS.find((col) => col.id === status)?.color || 'bg-gray-50';
};

export const getBorderColor = (status: string): string => {
  return (
    COLUMNS.find((col) => col.id === status)?.borderColor || 'border-gray-200'
  );
};

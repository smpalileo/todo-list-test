import React, { memo } from 'react';
import { Todo } from '../App';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

// Wrap component in React.memo
const TodoItem: React.FC<TodoItemProps> = memo(({ todo, onToggle, onDelete, onDragStart, onDragEnd, isDragging }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(todo.id);
  };

  const handleItemClick = (e: React.MouseEvent) => {
    // Don't toggle if clicking on checkbox or delete button
    if ((e.target as HTMLElement).closest('.todo-checkbox') || (e.target as HTMLElement).closest('.delete-btn')) {
      return;
    }
    onToggle(todo.id);
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''} ${isDragging ? 'dragging' : ''}`}
      onClick={handleItemClick}
      draggable
      onDragStart={(e) => onDragStart(e, todo.id)}
      onDragEnd={onDragEnd}
    >
      <div 
        className="todo-checkbox"
        onClick={handleCheckboxClick}
      />
      <span className="todo-text">{todo.text}</span>
      <button className="delete-btn" onClick={handleDelete}>
        ×
      </button>
    </div>
  );
});

export default TodoItem;


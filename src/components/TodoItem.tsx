import React, { memo } from 'react';
import { Todo } from '../App';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

// Wrap component in React.memo
const TodoItem: React.FC<TodoItemProps> = memo(({ todo, onToggle, onDelete }) => {
  // Use useCallback here for internal handlers if they were more complex,
  // but for this simple case it's fine.
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  };

  return (
    <div
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      onClick={() => onToggle(todo.id)}
    >
      <span>{todo.text}</span>
      <button className="delete-btn" onClick={handleDelete}>
        X
      </button>
    </div>
  );
});

export default TodoItem;


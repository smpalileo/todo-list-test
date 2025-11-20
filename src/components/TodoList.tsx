import React, { memo } from 'react';
import TodoItem from './TodoItem';
import { Todo } from '../App';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetId: number) => void;
  draggingId: number | null;
}

// Wrap component in React.memo
const TodoList: React.FC<TodoListProps> = memo(({ todos, onToggle, onDelete, onDragStart, onDragEnd, onDragOver, onDrop, draggingId }) => {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <div
          key={todo.id}
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, todo.id)}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            isDragging={draggingId === todo.id}
          />
        </div>
      ))}
    </div>
  );
});

export default TodoList;


import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Import components
import Header from './components/Header';
import AddInput from './components/AddInput';
import TodoList from './components/TodoList';

// Import styles
import './App.css';

// Define the shape of a single Todo object
export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
}

function App() {
  // Initialize state with TypeScript generics, loading from localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      return savedTodos ? JSON.parse(savedTodos) : [];
    } catch (error) {
      console.error("Failed to parse todos from localStorage", error);
      return [];
    }
  });

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOverIdRef = useRef<number | null>(null);

  // Effect to save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
    };
    // Use functional update to avoid dependency on 'todos'
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  }, []); // Empty dependency array

  const toggleTodo = useCallback((id: number) => {
    setTodos(prevTodos => {
      const updated = prevTodos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? Date.now() : null,
            }
          : todo
      );
      // If toggling to completed, move to bottom; if toggling to incomplete, move to top
      const active = updated.filter(t => !t.completed).sort((a, b) => b.createdAt - a.createdAt);
      const completed = updated.filter(t => t.completed).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
      return [...active, ...completed];
    });
  }, []); // Empty dependency array

  const deleteTodo = useCallback((id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []); // Empty dependency array

  const handleDragStart = useCallback((e: React.DragEvent, id: number) => {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    dragOverIdRef.current = null;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    
    if (!draggingId || draggingId === targetId) {
      return;
    }

    setTodos(prevTodos => {
      // Get the current sorted order
      const active = prevTodos.filter(t => !t.completed).sort((a, b) => b.createdAt - a.createdAt);
      const completed = prevTodos.filter(t => t.completed).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
      const sorted = [...active, ...completed];

      const draggedTodo = prevTodos.find(t => t.id === draggingId);
      if (!draggedTodo) return prevTodos;

      // Find indices in the sorted array
      const draggedIndex = sorted.findIndex(t => t.id === draggingId);
      const targetIndex = sorted.findIndex(t => t.id === targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prevTodos;

      // Remove dragged item
      const withoutDragged = sorted.filter(t => t.id !== draggingId);
      
      // Find new target index after removal
      const newTargetIndex = withoutDragged.findIndex(t => t.id === targetId);
      if (newTargetIndex === -1) return prevTodos;

      // If dragging a completed task, ensure it stays in completed section
      if (draggedTodo.completed) {
        const activeWithout = withoutDragged.filter(t => !t.completed);
        const completedWithout = withoutDragged.filter(t => t.completed);
        
        // Find where to insert in completed section
        const targetInCompleted = completedWithout.findIndex(t => t.id === targetId);
        if (targetInCompleted !== -1) {
          // Insert at target position in completed section
          const newCompleted = [...completedWithout];
          newCompleted.splice(targetInCompleted, 0, draggedTodo);
          return [...activeWithout, ...newCompleted];
        } else {
          // Target is in active, so move to end of completed
          return [...activeWithout, ...completedWithout, draggedTodo];
        }
      } else {
        // Dragging an incomplete task
        const activeWithout = withoutDragged.filter(t => !t.completed);
        const completedWithout = withoutDragged.filter(t => t.completed);
        
        // Find where to insert in active section
        const targetInActive = activeWithout.findIndex(t => t.id === targetId);
        if (targetInActive !== -1) {
          // Insert at target position in active section
          const newActive = [...activeWithout];
          newActive.splice(targetInActive, 0, draggedTodo);
          return [...newActive, ...completedWithout];
        } else {
          // Target is in completed, so move to end of active
          return [...activeWithout, draggedTodo, ...completedWithout];
        }
      }
    });
  }, [draggingId]);

  // Memoize the sorted list to prevent re-sorting on every render
  // Most recent incomplete first, then incomplete tasks, then most recently completed
  const sortedTodos = useMemo(() => {
    const active = todos.filter(t => !t.completed).sort((a, b) => b.createdAt - a.createdAt);
    const completed = todos.filter(t => t.completed).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
    return [...active, ...completed];
  }, [todos]);

  return (
    <div className="App">
      <Header />
      <AddInput onAdd={addTodo} />
      <TodoList
        todos={sortedTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        draggingId={draggingId}
      />
    </div>
  );
}

export default App;


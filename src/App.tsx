import React, { useState, useEffect, useCallback, useMemo } from 'react';

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
      />
    </div>
  );
}

export default App;


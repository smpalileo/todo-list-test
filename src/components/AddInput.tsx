import React, { useState, memo } from 'react';

interface AddInputProps {
  onAdd: (text: string) => void;
}

// Wrap component in React.memo
const AddInput: React.FC<AddInputProps> = memo(({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText(''); // Clear input after adding
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-input-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo..."
      />
      <button type="submit">Add</button>
    </form>
  );
});

export default AddInput;


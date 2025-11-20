# Todo List App

A React + TypeScript todo list application built with Vite.

## Features

- Add new todos
- Toggle todo completion status
- Delete todos
- Todos are persisted in localStorage
- Sorted display (active todos first, then completed)
- Smooth hover effects for delete buttons

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── AddInput.tsx
│   │   ├── TodoList.tsx
│   │   └── TodoItem.tsx
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```


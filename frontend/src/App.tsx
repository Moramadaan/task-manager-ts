import React from 'react';
import './App.css';
import TaskList from './components/TaskList';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-4 px-6">
          <h1 className="text-3xl font-bold text-primary-600">Task Manager</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto py-8 px-6">
        <TaskList />
      </main>
    </div>
  );
};
export default App;
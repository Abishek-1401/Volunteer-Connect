import React, { useState } from 'react';
import './ProjectTasks.css';
import { FaPlus } from 'react-icons/fa';

const ProjectTasks = ({ initialTasks }) => {
  const [tasks, setTasks] = useState(initialTasks || []);
  const [newTask, setNewTask] = useState('');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  return (
    <div className="project-tasks-container">
      <form onSubmit={handleAddTask} className="add-task-form">
        <input 
          type="text" 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Add a new task..."
        />
        <button type="submit"><FaPlus /> Add Task</button>
      </form>
      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? 'completed' : ''} onClick={() => toggleTask(index)}>
            <div className="task-checkbox"></div>
            <span>{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectTasks;
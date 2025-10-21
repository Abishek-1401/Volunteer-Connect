import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ProjectTasks from '../../components/ProjectTasks/ProjectTasks';
import ProjectFiles from '../../components/ProjectFiles/ProjectFiles';
import './ProjectDashboardPage.css';

// --- Full Mock Data for a single project ---
const mockProjectData = {
  '1': { 
    title: 'Community Garden Initiative', 
    chat: [
      { id: 'msg1', sender: { name: 'Eleanor Pena', avatar: 'https://randomuser.me/api/portraits/women/1.jpg' }, text: 'We need to decide on the types of vegetables to plant.', status: 'seen' },
      { id: 'msg2', sender: { name: 'You', avatar: null }, text: 'I can research some options that grow well in our climate.', status: 'seen' }
    ], 
    tasks: [
      {text: 'Buy seeds', completed: true},
      {text: 'Prepare the soil beds', completed: false}
    ], 
    files: [{name: 'garden_plan.pdf', uploader: 'Eleanor', size: '1.2MB'}] 
  },
  '2': { 
    title: 'Tech Skills Workshop for Kids', 
    chat: [
      { id: 'msg3', sender: { name: 'Cody Fisher', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' }, text: 'Welcome to the team! First planning meeting is tomorrow.', status: 'seen' }
    ], 
    tasks: [
      {text: 'Finalize curriculum', completed: false},
      {text: 'Contact local schools', completed: false}
    ], 
    files: [] 
  },
  '3': { 
    title: 'Beach Cleanup Drive', 
    chat: [], 
    tasks: [], 
    files: [] 
  },
};

const ProjectDashboardPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    // In a real app, you'd fetch this data from your backend
    setProject(mockProjectData[projectId]);
  }, [projectId]);

  if (!project) {
    return (
        <div className="project-dashboard-page">
            <div className="navbar-wrapper"><Navbar /></div>
            <main className="dashboard-container">
                <p>Loading Project Dashboard...</p>
            </main>
        </div>
    );
  }

  return (
    <div className="project-dashboard-page">
      <div className="navbar-wrapper">
        <Navbar />
      </div>
      <main className="dashboard-container">
        <h1 className="dashboard-project-title">{project.title}</h1>
        <div className="dashboard-content">
          <div className="dashboard-tabs">
            <button className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
            <button className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
            <button className={`tab-button ${activeTab === 'files' ? 'active' : ''}`} onClick={() => setActiveTab('files')}>Files</button>
          </div>
          <div className="dashboard-tab-content">
            {activeTab === 'chat' && (
              <ChatWindow 
                conversation={{ name: 'Project Chat' }} 
                messages={project.chat} 
                isEmbedded={true}
              />
            )}
            {activeTab === 'tasks' && <ProjectTasks initialTasks={project.tasks} />}
            {activeTab === 'files' && <ProjectFiles files={project.files} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboardPage;
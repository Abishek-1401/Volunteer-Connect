import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar/Navbar';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import ProjectTasks from '../../components/ProjectTasks/ProjectTasks';
import ProjectFiles from '../../components/ProjectFiles/ProjectFiles';
import { useToast } from '../../context/ToastContext';
import './ProjectDashboardPage.css';

const ProjectDashboardPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const { showToast } = useToast();

  const fetchProject = async () => {
    try {
      const { data } = await axios.get(`/api/projects/${projectId}`);
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
      showToast('Failed to load project details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, showToast]);

  if (loading) {
    return (
        <div className="project-dashboard-page">
            <div className="navbar-wrapper"><Navbar /></div>
            <main className="dashboard-container">
                <p>Loading Project Dashboard...</p>
            </main>
        </div>
    );
  }

  if (!project) {
    return (
        <div className="project-dashboard-page">
            <div className="navbar-wrapper"><Navbar /></div>
            <main className="dashboard-container">
                <p>Project not found</p>
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
                messages={project.chat || []}
                isEmbedded={true}
              />
            )}
            {activeTab === 'tasks' && <ProjectTasks initialTasks={project.tasks || []} />}
            {activeTab === 'files' && <ProjectFiles files={project.files || []} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDashboardPage;
cat > src/App.js << 'EOF'
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';

const API_URL = 'http://localhost:5000/api';
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const login = (newToken) => { localStorage.setItem('adminToken', newToken); setToken(newToken); setIsAuthenticated(true); };
  const logout = () => { localStorage.removeItem('adminToken'); setToken(null); setIsAuthenticated(false); };
  return <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

const useScrollReveal = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  return { ref, inView };
};

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const { ref: heroRef, inView: heroInView } = useScrollReveal();
  const { ref: aboutRef, inView: aboutInView } = useScrollReveal();
  const { ref: skillsRef, inView: skillsInView } = useScrollReveal();
  const { ref: projectsRef, inView: projectsInView } = useScrollReveal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, skillsRes] = await Promise.all([
          axios.get(`${API_URL}/projects`),
          axios.get(`${API_URL}/skills`)
        ]);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen">
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div ref={heroRef} className={`text-center px-4 transition-all duration-700 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: heroInView ? 1 : 0 }} transition={{ duration: 0.5 }} className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
            <i className="fas fa-code text-5xl text-blue-600"></i>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">John Developer</h1>
          <p className="text-xl md:text-2xl mb-6">MERN Stack Developer & Creative Technologist</p>
          <div className="flex gap-4 justify-center">
            <a href="#skills" className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-lg transition">View Skills</a>
            <a href="#projects" className="px-6 py-3 border-2 border-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition">See Projects</a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div ref={aboutRef} className={`text-center transition-all duration-700 ${aboutInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">About Me</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              I'm a passionate full-stack developer with expertise in MongoDB, Express.js, React, and Node.js.
              I love building beautiful, functional web applications that solve real-world problems.
              With 5+ years of experience, I've worked with startups and enterprises to deliver high-quality solutions.
            </p>
          </div>
        </div>
      </section>

      <section id="skills" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div ref={skillsRef} className={`transition-all duration-700 ${skillsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-center mb-6">Technical Skills</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
            {Object.entries(groupedSkills).map(([category, categorySkills]) => (
              <div key={category} className="mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-gray-700">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorySkills.map((skill, idx) => (
                    <motion.div key={skill._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: skillsInView ? 1 : 0, x: skillsInView ? 0 : -20 }} transition={{ delay: idx * 0.1 }} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                      <div className="flex items-center mb-4">
                        <i className={`fab ${skill.icon} text-3xl text-blue-600 mr-3`}></i>
                        <h4 className="text-xl font-semibold">{skill.name}</h4>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{skill.level}% proficiency</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div ref={projectsRef} className={`transition-all duration-700 ${projectsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-center mb-6">Featured Projects</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, idx) => (
                <motion.div key={project._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: projectsInView ? 1 : 0, scale: projectsInView ? 1 : 0.9 }} transition={{ delay: idx * 0.1 }} className="bg-gray-50 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack?.map((tech, i) => (<span key={i} className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">{tech}</span>))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && (<a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800"><i className="fas fa-external-link-alt mr-1"></i> Live Demo</a>)}
                      {project.githubUrl && (<a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900"><i className="fab fa-github mr-1"></i> GitHub</a>)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
          <p className="text-xl mb-8">Interested in working together? Let's talk!</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-3xl hover:scale-110 transition"><i className="fab fa-github"></i></a>
            <a href="#" className="text-3xl hover:scale-110 transition"><i className="fab fa-linkedin"></i></a>
            <a href="#" className="text-3xl hover:scale-110 transition"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-3xl hover:scale-110 transition"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
      </section>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      login(response.data.token);
      window.location.href = '/admin/dashboard';
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Login</button>
        </form>
        <p className="text-center text-gray-500 mt-4 text-sm">Default: admin@portfolio.com / admin123</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { token, logout } = useContext(AuthContext);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', imageUrl: '', techStack: [], liveUrl: '', githubUrl: '' });
  const [skillForm, setSkillForm] = useState({ name: '', icon: 'fa-js', level: 80, category: 'Frontend' });
  const [techInput, setTechInput] = useState('');

  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes] = await Promise.all([
        axios.get(`${API_URL}/projects`),
        axios.get(`${API_URL}/skills`)
      ]);
      setProjects(projectsRes.data);
      setSkills(skillsRes.data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await axios.put(`${API_URL}/admin/projects/${editingItem._id}`, projectForm, axiosConfig);
      else await axios.post(`${API_URL}/admin/projects`, projectForm, axiosConfig);
      setShowProjectForm(false);
      setProjectForm({ title: '', description: '', imageUrl: '', techStack: [], liveUrl: '', githubUrl: '' });
      setEditingItem(null);
      fetchData();
    } catch (error) { alert('Error saving project'); }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) await axios.put(`${API_URL}/admin/skills/${editingItem._id}`, skillForm, axiosConfig);
      else await axios.post(`${API_URL}/admin/skills`, skillForm, axiosConfig);
      setShowSkillForm(false);
      setSkillForm({ name: '', icon: 'fa-js', level: 80, category: 'Frontend' });
      setEditingItem(null);
      fetchData();
    } catch (error) { alert('Error saving skill'); }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm('Are you sure?')) {
      await axios.delete(`${API_URL}/admin/${type}/${id}`, axiosConfig);
      fetchData();
    }
  };

  const addTechStack = () => {
    if (techInput && !projectForm.techStack.includes(techInput)) {
      setProjectForm({ ...projectForm, techStack: [...projectForm.techStack, techInput] });
      setTechInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Admin Dashboard</h1>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </nav>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Projects</h2>
            <button onClick={() => { setShowProjectForm(true); setEditingItem(null); setProjectForm({ title: '', description: '', imageUrl: '', techStack: [], liveUrl: '', githubUrl: '' }); }} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Project</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div key={project._id} className="bg-white rounded-lg shadow p-4">
                <img src={project.imageUrl} alt={project.title} className="w-full h-40 object-cover rounded mb-3" />
                <h3 className="font-bold text-lg">{project.title}</h3>
                <p className="text-gray-600 text-sm">{project.description.substring(0, 100)}</p>
                <div className="flex justify-between mt-4">
                  <button onClick={() => { setEditingItem(project); setProjectForm(project); setShowProjectForm(true); }} className="text-blue-600">Edit</button>
                  <button onClick={() => handleDelete('projects', project._id)} className="text-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Skills</h2>
            <button onClick={() => { setShowSkillForm(true); setEditingItem(null); setSkillForm({ name: '', icon: 'fa-js', level: 80, category: 'Frontend' }); }} className="bg-green-600 text-white px-4 py-2 rounded">+ Add Skill</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map(skill => (
              <div key={skill._id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center"><i className={`fab ${skill.icon} text-2xl text-blue-600 mr-2`}></i><span className="font-semibold">{skill.name}</span></div>
                  <p className="text-sm text-gray-500">{skill.category} - {skill.level}%</p>
                </div>
                <div><button onClick={() => { setEditingItem(skill); setSkillForm(skill); setShowSkillForm(true); }} className="text-blue-600 mr-3">Edit</button><button onClick={() => handleDelete('skills', skill._id)} className="text-red-600">Delete</button></div>
              </div>
            ))}
          </div>
        </div>
        {showProjectForm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"><div className="bg-white rounded-lg p-6 max-w-md w-full max-h-screen overflow-y-auto"><h3 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Project' : 'Add Project'}</h3><form onSubmit={handleAddProject}><input type="text" placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="w-full p-2 border rounded mb-3" required /><textarea placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} className="w-full p-2 border rounded mb-3" required /><input type="text" placeholder="Image URL" value={projectForm.imageUrl} onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })} className="w-full p-2 border rounded mb-3" /><div className="flex gap-2 mb-3"><input type="text" placeholder="Tech Stack" value={techInput} onChange={(e) => setTechInput(e.target.value)} className="flex-1 p-2 border rounded" /><button type="button" onClick={addTechStack} className="bg-blue-600 text-white px-4 rounded">Add</button></div><div className="flex flex-wrap gap-2 mb-3">{projectForm.techStack.map((tech, i) => <span key={i} className="bg-gray-200 px-2 py-1 rounded text-sm">{tech}</span>)}</div><input type="text" placeholder="Live URL" value={projectForm.liveUrl} onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })} className="w-full p-2 border rounded mb-3" /><input type="text" placeholder="GitHub URL" value={projectForm.githubUrl} onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })} className="w-full p-2 border rounded mb-3" /><div className="flex gap-3"><button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex-1">Save</button><button type="button" onClick={() => setShowProjectForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded flex-1">Cancel</button></div></form></div></div>)}
        {showSkillForm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"><div className="bg-white rounded-lg p-6 max-w-md w-full"><h3 className="text-2xl font-bold mb-4">{editingItem ? 'Edit Skill' : 'Add Skill'}</h3><form onSubmit={handleAddSkill}><input type="text" placeholder="Skill Name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full p-2 border rounded mb-3" required /><input type="text" placeholder="Icon (fa-js, fa-react, etc)" value={skillForm.icon} onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })} className="w-full p-2 border rounded mb-3" /><input type="number" placeholder="Level (0-100)" value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })} className="w-full p-2 border rounded mb-3" /><select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} className="w-full p-2 border rounded mb-3"><option>Frontend</option><option>Backend</option><option>Database</option><option>DevOps</option><option>Other</option></select><div className="flex gap-3"><button type="submit" className="bg-green-600 text-white px-4 py-2 rounded flex-1">Save</button><button type="button" onClick={() => setShowSkillForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded flex-1">Cancel</button></div></form></div></div>)}
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOF
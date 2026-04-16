import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth, signIn, logout, OperationType, handleFirestoreError } from '../lib/firebase';
import { PortfolioContent } from '../types';
import { DEFAULT_CONTENT } from '../constants';
import { Save, LogOut, LogIn, ChevronRight, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminProps {
  content: PortfolioContent;
  onUpdate: (newContent: PortfolioContent) => void;
}

export default function Admin({ content, onUpdate }: AdminProps) {
  const [user, setUser] = useState(auth.currentUser);
  const [editContent, setEditContent] = useState<PortfolioContent>(content);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>('hero');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'content', 'main'), editContent);
      onUpdate(editContent);
      alert('저장되었습니다!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'content/main');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card p-12 max-w-md w-full text-center flex flex-col gap-8">
          <h1 className="text-4xl font-black text-primary tracking-tighter">Admin Login</h1>
          <p className="text-sub">포트폴리오 내용을 수정하려면 관리자 계정으로 로그인하세요.</p>
          <button 
            onClick={signIn}
            className="flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            <LogIn size={20} />
            Google로 로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-10 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-primary tracking-tighter">Admin Dashboard</h1>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest">Editor Mode</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 bg-white border border-white/20 text-primary px-6 py-3 rounded-2xl font-bold hover:bg-white/80 transition-all shadow-sm"
          >
            대시보드로 돌아가기
          </Link>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-2xl font-bold hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? '저장 중...' : '변경사항 저장'}
          </button>
          <button 
            onClick={logout}
            className="p-3 rounded-2xl bg-white border border-white/20 text-sub hover:text-primary transition-all"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
          {Object.keys(editContent)
            .filter(section => section !== 'analytics' && section !== 'schedule' && section !== 'skills' && section !== 'growth')
            .map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl font-bold text-left transition-all",
                activeSection === section 
                  ? "bg-primary text-white shadow-lg" 
                  : "bg-white/50 text-sub hover:bg-white hover:text-primary"
              )}
            >
              <span className="capitalize">{section}</span>
              {activeSection === section ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="col-span-12 lg:col-span-9 glass-card p-8">
          {activeSection === 'hero' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black text-primary">Hero Section</h3>
              <div className="grid gap-4">
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-sub uppercase tracking-widest">Title</span>
                  <textarea 
                    value={editContent.hero.title}
                    onChange={(e) => setEditContent({ ...editContent, hero: { ...editContent.hero, title: e.target.value } })}
                    className="p-4 rounded-xl bg-background border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent/20 h-24"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-sub uppercase tracking-widest">Subtitle</span>
                  <textarea 
                    value={editContent.hero.subtitle}
                    onChange={(e) => setEditContent({ ...editContent, hero: { ...editContent.hero, subtitle: e.target.value } })}
                    className="p-4 rounded-xl bg-background border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent/20 h-32"
                  />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-sub uppercase tracking-widest">Background Image URL</span>
                  <input 
                    type="text" 
                    value={editContent.hero.backgroundImage}
                    onChange={(e) => setEditContent({ ...editContent, hero: { ...editContent.hero, backgroundImage: e.target.value } })}
                    className="p-4 rounded-xl bg-background border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </label>
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-primary">Projects Section</h3>
                <button 
                  onClick={() => {
                    const newProjects = [...editContent.projects, {
                      title: 'New Project',
                      description: 'Description',
                      image: 'https://picsum.photos/seed/new/800/600',
                      images: [],
                      tags: ['Tag'],
                      link: '#',
                      tools: ['Tool'],
                      learnings: 'Learnings',
                      results: 'Results'
                    }];
                    setEditContent({ ...editContent, projects: newProjects });
                  }}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              {editContent.projects.map((project, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border border-white/20 flex flex-col gap-4 relative group">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1 bg-white/50 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                      <button 
                        onClick={() => {
                          if (i === 0) return;
                          const newProjects = [...editContent.projects];
                          const temp = newProjects[i];
                          newProjects[i] = newProjects[i - 1];
                          newProjects[i - 1] = temp;
                          setEditContent({ ...editContent, projects: newProjects });
                        }}
                        className="p-1.5 text-sub hover:text-primary disabled:opacity-30"
                        disabled={i === 0}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          if (i === editContent.projects.length - 1) return;
                          const newProjects = [...editContent.projects];
                          const temp = newProjects[i];
                          newProjects[i] = newProjects[i + 1];
                          newProjects[i + 1] = temp;
                          setEditContent({ ...editContent, projects: newProjects });
                        }}
                        className="p-1.5 text-sub hover:text-primary disabled:opacity-30"
                        disabled={i === editContent.projects.length - 1}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        const newProjects = editContent.projects.filter((_, index) => index !== i);
                        setEditContent({ ...editContent, projects: newProjects });
                      }}
                      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={project.title}
                    onChange={(e) => {
                      const newProjects = [...editContent.projects];
                      newProjects[i].title = e.target.value;
                      setEditContent({ ...editContent, projects: newProjects });
                    }}
                    placeholder="Project Title"
                    className="p-3 rounded-xl bg-white border border-white/20 font-bold"
                  />
                  <textarea 
                    value={project.description}
                    onChange={(e) => {
                      const newProjects = [...editContent.projects];
                      newProjects[i].description = e.target.value;
                      setEditContent({ ...editContent, projects: newProjects });
                    }}
                    placeholder="Description"
                    className="p-3 rounded-xl bg-white border border-white/20 h-20"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-sub uppercase tracking-widest">Main Thumbnail</label>
                      <input 
                        type="text" 
                        value={project.image}
                        onChange={(e) => {
                          const newProjects = [...editContent.projects];
                          newProjects[i].image = e.target.value;
                          setEditContent({ ...editContent, projects: newProjects });
                        }}
                        placeholder="Main Image URL"
                        className="p-3 rounded-xl bg-white border border-white/20"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-sub uppercase tracking-widest">Project Link</label>
                      <input 
                        type="text" 
                        value={project.link}
                        onChange={(e) => {
                          const newProjects = [...editContent.projects];
                          newProjects[i].link = e.target.value;
                          setEditContent({ ...editContent, projects: newProjects });
                        }}
                        placeholder="Project Link"
                        className="p-3 rounded-xl bg-white border border-white/20"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-sub uppercase tracking-widest">Gallery Images</label>
                      <button 
                        onClick={() => {
                          const newProjects = [...editContent.projects];
                          newProjects[i].images = [...(newProjects[i].images || []), ""];
                          setEditContent({ ...editContent, projects: newProjects });
                        }}
                        className="text-[10px] font-bold text-accent hover:underline"
                      >
                        + Add Image
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {(Array.isArray(project.images) ? project.images : []).map((img, imgIdx) => (
                        <div key={imgIdx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={img}
                            onChange={(e) => {
                              const newProjects = [...editContent.projects];
                              const currentImages = [...(Array.isArray(newProjects[i].images) ? newProjects[i].images : [])];
                              currentImages[imgIdx] = e.target.value;
                              newProjects[i].images = currentImages;
                              setEditContent({ ...editContent, projects: newProjects });
                            }}
                            placeholder={`Image ${imgIdx + 1} URL`}
                            className="flex-1 p-2 rounded-lg bg-white border border-white/20 text-xs font-mono"
                          />
                          <div className="flex gap-1">
                            <button 
                              onClick={() => {
                                if (imgIdx === 0) return;
                                const newProjects = [...editContent.projects];
                                const currentImages = [...(Array.isArray(newProjects[i].images) ? newProjects[i].images : [])];
                                const temp = currentImages[imgIdx];
                                currentImages[imgIdx] = currentImages[imgIdx - 1];
                                currentImages[imgIdx - 1] = temp;
                                newProjects[i].images = currentImages;
                                setEditContent({ ...editContent, projects: newProjects });
                              }}
                              className="p-1 text-sub hover:text-primary disabled:opacity-30"
                              disabled={imgIdx === 0}
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                if (imgIdx === (project.images?.length || 0) - 1) return;
                                const newProjects = [...editContent.projects];
                                const currentImages = [...(Array.isArray(newProjects[i].images) ? newProjects[i].images : [])];
                                const temp = currentImages[imgIdx];
                                currentImages[imgIdx] = currentImages[imgIdx + 1];
                                currentImages[imgIdx + 1] = temp;
                                newProjects[i].images = currentImages;
                                setEditContent({ ...editContent, projects: newProjects });
                              }}
                              className="p-1 text-sub hover:text-primary disabled:opacity-30"
                              disabled={imgIdx === (project.images?.length || 0) - 1}
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button 
                              onClick={() => {
                                const newProjects = [...editContent.projects];
                                const currentImages = [...(Array.isArray(newProjects[i].images) ? newProjects[i].images : [])];
                                newProjects[i].images = currentImages.filter((_, idx) => idx !== imgIdx);
                                setEditContent({ ...editContent, projects: newProjects });
                              }}
                              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {(!project.images || (Array.isArray(project.images) && project.images.length === 0)) && (
                        <p className="text-[10px] text-sub italic">No gallery images added. Using main thumbnail only.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      value={project.tools.join(', ')}
                      onChange={(e) => {
                        const newProjects = [...editContent.projects];
                        newProjects[i].tools = e.target.value.split(',').map(s => s.trim());
                        setEditContent({ ...editContent, projects: newProjects });
                      }}
                      placeholder="Tools (comma separated)"
                      className="p-3 rounded-xl bg-white border border-white/20"
                    />
                    <input 
                      type="text" 
                      value={project.tags.join(', ')}
                      onChange={(e) => {
                        const newProjects = [...editContent.projects];
                        newProjects[i].tags = e.target.value.split(',').map(s => s.trim());
                        setEditContent({ ...editContent, projects: newProjects });
                      }}
                      placeholder="Tags (comma separated)"
                      className="p-3 rounded-xl bg-white border border-white/20"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <input 
                      type="text" 
                      value={project.results}
                      onChange={(e) => {
                        const newProjects = [...editContent.projects];
                        newProjects[i].results = e.target.value;
                        setEditContent({ ...editContent, projects: newProjects });
                      }}
                      placeholder="Results"
                      className="p-3 rounded-xl bg-white border border-white/20"
                    />
                    <textarea 
                      value={project.learnings}
                      onChange={(e) => {
                        const newProjects = [...editContent.projects];
                        newProjects[i].learnings = e.target.value;
                        setEditContent({ ...editContent, projects: newProjects });
                      }}
                      placeholder="Learnings"
                      className="p-3 rounded-xl bg-white border border-white/20 h-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'techSkills' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-primary">Tech Skills Section</h3>
                <button 
                  onClick={() => {
                    const newSkills = [...editContent.techSkills, { label: 'New Skill', level: 80, category: 'Dev' }];
                    setEditContent({ ...editContent, techSkills: newSkills });
                  }}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              {editContent.techSkills.map((skill, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-background border border-white/20 relative group">
                  <input 
                    type="text" 
                    value={skill.label}
                    onChange={(e) => {
                      const newSkills = [...editContent.techSkills];
                      newSkills[i].label = e.target.value;
                      setEditContent({ ...editContent, techSkills: newSkills });
                    }}
                    className="p-2 rounded-lg bg-white border border-white/20"
                  />
                  <input 
                    type="number" 
                    value={skill.level}
                    onChange={(e) => {
                      const newSkills = [...editContent.techSkills];
                      newSkills[i].level = Number(e.target.value);
                      setEditContent({ ...editContent, techSkills: newSkills });
                    }}
                    className="p-2 rounded-lg bg-white border border-white/20"
                  />
                  <select 
                    value={skill.category}
                    onChange={(e) => {
                      const newSkills = [...editContent.techSkills];
                      newSkills[i].category = e.target.value as any;
                      setEditContent({ ...editContent, techSkills: newSkills });
                    }}
                    className="p-2 rounded-lg bg-white border border-white/20"
                  >
                    <option value="Design">Design</option>
                    <option value="Dev">Dev</option>
                    <option value="AI">AI</option>
                  </select>
                  <button 
                    onClick={() => {
                      const newSkills = editContent.techSkills.filter((_, index) => index !== i);
                      setEditContent({ ...editContent, techSkills: newSkills });
                    }}
                    className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-primary">Experience Section</h3>
                <button 
                  onClick={() => {
                    const newExp = [...editContent.experience, { company: 'New Company', period: '2024 - Present', role: 'Role', description: 'Description' }];
                    setEditContent({ ...editContent, experience: newExp });
                  }}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              {editContent.experience.map((exp, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border border-white/20 flex flex-col gap-4 relative group">
                  <button 
                    onClick={() => {
                      const newExp = editContent.experience.filter((_, index) => index !== i);
                      setEditContent({ ...editContent, experience: newExp });
                    }}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                  <input 
                    type="text" 
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...editContent.experience];
                      newExp[i].company = e.target.value;
                      setEditContent({ ...editContent, experience: newExp });
                    }}
                    placeholder="Company"
                    className="p-3 rounded-xl bg-white border border-white/20 font-bold"
                  />
                  <input 
                    type="text" 
                    value={exp.period}
                    onChange={(e) => {
                      const newExp = [...editContent.experience];
                      newExp[i].period = e.target.value;
                      setEditContent({ ...editContent, experience: newExp });
                    }}
                    placeholder="Period"
                    className="p-3 rounded-xl bg-white border border-white/20"
                  />
                  <textarea 
                    value={exp.description}
                    onChange={(e) => {
                      const newExp = [...editContent.experience];
                      newExp[i].description = e.target.value;
                      setEditContent({ ...editContent, experience: newExp });
                    }}
                    placeholder="Job Description"
                    className="p-3 rounded-xl bg-white border border-white/20 h-20"
                  />
                </div>
              ))}
            </div>
          )}

          {activeSection === 'about' && (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl font-black text-primary">About Section</h3>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-sub uppercase tracking-widest">Header Profile Photo URL</span>
                <input 
                  type="text" 
                  value={editContent.profilePhoto}
                  onChange={(e) => setEditContent({ ...editContent, profilePhoto: e.target.value })}
                  className="p-4 rounded-xl bg-background border border-white/20"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-sub uppercase tracking-widest">About Photo URL</span>
                <input 
                  type="text" 
                  value={editContent.about.photo}
                  onChange={(e) => setEditContent({ ...editContent, about: { ...editContent.about, photo: e.target.value } })}
                  className="p-4 rounded-xl bg-background border border-white/20"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-sub uppercase tracking-widest">Quote</span>
                <input 
                  type="text" 
                  value={editContent.about.quote}
                  onChange={(e) => setEditContent({ ...editContent, about: { ...editContent.about, quote: e.target.value } })}
                  className="p-4 rounded-xl bg-background border border-white/20"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold text-sub uppercase tracking-widest">Full Description</span>
                <textarea 
                  value={editContent.about.description}
                  onChange={(e) => setEditContent({ ...editContent, about: { ...editContent.about, description: e.target.value } })}
                  className="p-4 rounded-xl bg-background border border-white/20 h-40"
                />
              </label>
            </div>
          )}

          {activeSection !== 'hero' && activeSection !== 'projects' && activeSection !== 'techSkills' && activeSection !== 'experience' && activeSection !== 'about' && (
            <div className="flex flex-col items-center justify-center py-20 text-sub">
              <p>이 섹션의 편집 기능은 곧 추가될 예정입니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

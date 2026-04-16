import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  Bell, 
  LayoutDashboard, 
  Briefcase, 
  BarChart3, 
  User, 
  Settings,
  Plus,
  ArrowUpRight,
  Play,
  Pause,
  Square,
  X,
  Cpu,
  Code2,
  Palette,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { PortfolioContent, ScheduleItem, ProjectItem, SkillItem, TechSkill, ExperienceItem } from '../types';

interface DashboardProps {
  content: PortfolioContent;
}

export default function Dashboard({ content }: DashboardProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState('dashboard');

  const selectedProject = selectedProjectIndex !== null ? content.projects[selectedProjectIndex] : null;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F7F7] p-4 md:p-6 lg:p-10">
      {/* Background Animated Objects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: mousePos.x, 
            y: mousePos.y,
            rotate: mousePos.x * 0.5
          }}
          className="absolute -top-20 -left-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-accent/10 rounded-full blur-[80px] md:blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: -mousePos.x * 1.5, 
            y: -mousePos.y * 1.5,
            rotate: -mousePos.y * 0.5
          }}
          className="absolute top-1/2 -right-20 md:-right-40 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-point/20 rounded-full blur-[60px] md:blur-[100px]"
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 md:gap-8 h-full lg:h-[calc(100vh-80px)]">
        {/* Sidebar - Fixed on desktop, bottom on mobile */}
        <Sidebar activeSection={activeSection} onSectionClick={scrollToSection} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-6 md:gap-8 overflow-y-auto lg:pr-4 scrollbar-hide pb-24 lg:pb-0">
          <Header profilePhoto={content.profilePhoto} />
          
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 md:gap-8">
              <div id="dashboard">
                <Hero content={content.hero} />
              </div>
              
              <div id="projects">
                <Projects content={content.projects} onProjectClick={(p) => {
                  const index = content.projects.findIndex(proj => proj.title === p.title);
                  setSelectedProjectIndex(index);
                }} />
              </div>
              
              <div id="tech">
                <TechSkills content={content.techSkills} />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 md:gap-8">
              <div id="about">
                <About content={content.about} />
              </div>
              <div id="experience">
                <Experience content={content.experience} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProjectIndex(null)}
            onNext={() => setSelectedProjectIndex((prev) => (prev !== null && prev < content.projects.length - 1 ? prev + 1 : 0))}
            onPrev={() => setSelectedProjectIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : content.projects.length - 1))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ activeSection, onSectionClick }: { activeSection: string, onSectionClick: (id: string) => void }) {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'tech', icon: BarChart3, label: 'Tech' },
    { id: 'about', icon: User, label: 'About' },
    { id: 'experience', icon: Settings, label: 'Experience' },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:flex flex-row lg:flex-col items-center py-4 lg:py-8 px-6 lg:px-4 glass-card w-auto lg:w-20 h-auto lg:h-full z-50">
      <div className="flex flex-row lg:flex-col gap-4 md:gap-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionClick(item.id)}
            className={cn(
              "p-3 rounded-2xl transition-all duration-300",
              activeSection === item.id 
                ? "bg-primary-orange text-white shadow-lg shadow-primary-orange/20" 
                : "text-sub hover:bg-white/50 hover:text-primary"
            )}
          >
            <item.icon size={24} />
          </button>
        ))}
      </div>
    </div>
  );
}

function Header({ profilePhoto }: { profilePhoto: string }) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center justify-between w-full md:w-auto gap-4">
        <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-primary">tnwl.zip</h1>
        <div className="flex md:hidden items-center gap-2">
          <button className="p-2 rounded-full bg-white/50 border border-white/20 text-sub">
            <Bell size={18} />
          </button>
          <img 
            src={profilePhoto} 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sub group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="궁금한게 있다면 연락 주세요!" 
            className="pl-12 pr-6 py-2.5 md:py-3 rounded-full bg-white/50 border border-white/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all w-full md:w-64"
          />
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button className="p-3 rounded-full bg-white/50 border border-white/20 text-sub hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 pl-2 pr-2 py-2 rounded-full bg-white/50 border border-white/20">
            <img 
              src={profilePhoto} 
              alt="Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero({ content }: { content: PortfolioContent['hero'] }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] md:rounded-[40px] min-h-[500px] md:h-[calc(100vh-200px)] group">
      <img 
        src={content.backgroundImage} 
        alt="Hero" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      
      <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-normal text-white leading-tight tracking-tight mb-8 md:mb-10 max-w-2xl whitespace-pre-line">
            {content.title}
          </h2>
          <div className="h-1 w-20 bg-accent mb-8" />
          <p className="text-white/90 text-lg md:text-2xl font-medium max-w-sm md:max-w-xl leading-snug">
            {content.subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Projects({ content, onProjectClick }: { content: ProjectItem[], onProjectClick: (p: ProjectItem) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl md:text-2xl font-black text-primary">Featured Projects</h3>
        <button className="p-2 rounded-full bg-white/50 hover:bg-white transition-all">
          <Plus size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {content.map((project, i) => (
          <motion.div 
            key={i}
            layoutId={`project-${project.title}`}
            whileHover={{ y: -10 }}
            onClick={() => onProjectClick(project)}
            className="glass-card overflow-hidden group cursor-pointer"
          >
            <div className="relative h-56 md:h-72 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex gap-2 mb-3 md:mb-4">
                {project.tags.map((tag, j) => (
                  <span key={j} className="text-[10px] font-bold text-accent uppercase tracking-widest">{tag}</span>
                ))}
              </div>
              <h4 className="text-xl md:text-2xl font-black text-primary mb-2 md:mb-3">{project.title}</h4>
              <p className="text-sm md:text-base text-sub line-clamp-2">{project.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose, onNext, onPrev }: { project: ProjectItem, onClose: () => void, onNext: () => void, onPrev: () => void }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  
  // Ensure images is always an array and filter out empty strings
  const images = useMemo(() => {
    const gallery = Array.isArray(project.images) ? project.images.filter(img => img && img.trim() !== "") : [];
    return gallery.length > 0 ? gallery : [project.image];
  }, [project.images, project.image]);

  useEffect(() => {
    setCurrentImgIndex(0);
  }, [project.title]);

  const nextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 lg:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary/90 backdrop-blur-2xl"
      />
      <motion.div 
        layoutId={`project-${project.title}`}
        className="relative w-full max-w-[95vw] bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full lg:h-[95vh]"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all border border-white/20"
        >
          <X size={24} />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="lg:w-[70%] h-[50vh] lg:h-full overflow-hidden bg-black relative group">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImgIndex}
              src={images[currentImgIndex]} 
              alt={`${project.title} - ${currentImgIndex + 1}`} 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>

          {/* Image Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImg}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all border border-white/10 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextImg}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-primary transition-all border border-white/10 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
          
          {/* Image Progress Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              {images.map((_, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setCurrentImgIndex(i); }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === currentImgIndex ? "w-8 bg-accent" : "w-4 bg-white/30 hover:bg-white/50"
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="lg:w-[30%] p-8 md:p-12 lg:p-16 overflow-y-auto flex flex-col bg-white">
          <div className="flex-1">
            <div className="flex gap-2 mb-6">
              {project.tags.map((tag, j) => (
                <span key={j} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest">{tag}</span>
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-tighter mb-6 leading-tight">{project.title}</h2>
            <p className="text-base md:text-lg text-sub font-medium leading-relaxed mb-12">{project.description}</p>

            <div className="grid gap-10">
              <section>
                <h5 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2 opacity-50">
                  <Settings size={12} className="text-accent" /> Tools Used
                </h5>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, i) => (
                    <span key={i} className="px-4 py-2 rounded-xl bg-background border border-white/20 text-xs font-bold text-primary">
                      {tool}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h5 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2 opacity-50">
                  <Code2 size={12} className="text-accent" /> Key Learnings
                </h5>
                <p className="text-sub text-sm leading-relaxed">{project.learnings}</p>
              </section>

              <section>
                <h5 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2 opacity-50">
                  <BarChart3 size={12} className="text-accent" /> Achievements
                </h5>
                <p className="text-accent text-sm leading-relaxed font-bold">{project.results}</p>
              </section>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6">
            <div className="flex items-center justify-between pt-8 border-t border-background">
              <button 
                onClick={(e) => { e.stopPropagation(); onPrev(); setCurrentImgIndex(0); }}
                className="flex items-center gap-2 text-xs font-bold text-sub hover:text-accent transition-colors group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                PREV PROJECT
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNext(); setCurrentImgIndex(0); }}
                className="flex items-center gap-2 text-xs font-bold text-sub hover:text-accent transition-colors group"
              >
                NEXT PROJECT
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <a 
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-center hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
            >
              Visit Project
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function TechSkills({ content }: { content: TechSkill[] }) {
  return (
    <div className="glass-card p-8 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-primary">AI & Tech 활용</h3>
          <p className="text-sm text-sub mt-1">디자인부터 코딩, AI 활용까지 아우르는 기술 스택</p>
        </div>
        <Cpu className="text-accent" size={32} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {(['Design', 'Dev', 'AI'] as const).map((category) => (
          <div key={category} className="flex flex-col gap-6">
            <h5 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              {category === 'Design' ? <Palette size={14} /> : category === 'Dev' ? <Code2 size={14} /> : <Cpu size={14} />}
              {category}
            </h5>
            <div className="flex flex-col gap-5">
              {content.filter(s => s.category === category).map((skill, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-bold text-primary">
                    <span>{skill.label}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={cn(
                        "h-full rounded-full",
                        category === 'Design' ? "bg-accent" : category === 'Dev' ? "bg-primary" : "bg-point-dark"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function About({ content }: { content: PortfolioContent['about'] }) {
  return (
    <div className="glass-card p-8 flex flex-col gap-6">
      <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden group">
        <img 
          src={content.photo} 
          alt="Profile" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <p className="text-white font-black text-xl leading-tight tracking-tighter">
            "{content.quote}"
          </p>
        </div>
      </div>
      <p className="text-sm text-sub leading-relaxed font-medium">
        {content.description}
      </p>
    </div>
  );
}

function Experience({ content }: { content: ExperienceItem[] }) {
  return (
    <div className="glass-card p-8 flex flex-col gap-6">
      <h3 className="text-xl font-black text-primary">경력 사항</h3>
      <div className="flex flex-col gap-6">
        {content.map((exp, i) => (
          <div key={i} className="relative pl-6 border-l-2 border-accent/20 flex flex-col gap-1">
            <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-accent" />
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{exp.period}</span>
            <h4 className="font-black text-primary">{exp.company}</h4>
            <p className="text-xs font-bold text-sub">{exp.role}</p>
            <div className="text-xs text-sub mt-2 space-y-1">
              {exp.description.split('\n').filter(line => line.trim()).map((line, j) => (
                <div key={j} className="flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{line.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Growth({ content }: { content: PortfolioContent['growth'] }) {
  const [experience, setExperience] = useState({ years: 5, months: 8, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Start date: 5 years and 8 months before April 13, 2026
    // 2026-04-13 minus 5 years = 2021-04-13
    // 2021-04-13 minus 8 months = 2020-08-13
    const startDate = new Date('2020-08-13T00:00:00');

    const updateCounter = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      // Simple calculation for years and months
      const years = Math.floor(days / 365.25);
      const remainingDays = days % 365.25;
      const months = Math.floor(remainingDays / 30.44);
      
      setExperience({
        years,
        months,
        days: Math.floor(remainingDays % 30.44),
        hours: hours % 24,
        minutes: minutes % 60,
        seconds: seconds % 60
      });
    };

    const interval = setInterval(updateCounter, 1000);
    updateCounter();
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-8 flex flex-col gap-6">
      <h3 className="text-xl font-black text-primary">Growth Tracker</h3>
      
      <div className="relative flex justify-center py-4">
        <svg className="w-48 h-48 -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-background"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeDasharray="502.4"
            initial={{ strokeDashoffset: 502.4 }}
            whileInView={{ strokeDashoffset: 502.4 * (1 - 0.75) }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="text-accent"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-primary">{content.sitesCount}</span>
          <span className="text-[10px] font-bold text-sub uppercase tracking-widest">Sites Built</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-2xl bg-white/50">
          <div className="text-center mb-2">
            <div className="text-xl font-black text-primary">
              {experience.years}y {experience.months}m {experience.days}d
            </div>
            <div className="text-[10px] font-bold text-sub uppercase tracking-widest">Total Experience</div>
          </div>
          <div className="flex justify-center gap-2 text-[10px] font-mono text-accent">
            <span>{experience.hours.toString().padStart(2, '0')}h</span>
            <span>{experience.minutes.toString().padStart(2, '0')}m</span>
            <span>{experience.seconds.toString().padStart(2, '0')}s</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/50 text-center">
            <div className="text-xl font-black text-primary">{content.projectsCount}</div>
            <div className="text-[10px] font-bold text-sub uppercase tracking-widest">Projects</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/50 text-center flex flex-col justify-center">
            <div className="text-xs font-bold text-primary">Continuous</div>
            <div className="text-[10px] font-bold text-sub uppercase tracking-widest">Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
}


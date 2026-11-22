import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/portfolio';
import { uploadAssetToSupabase } from '../../lib/supabase';
import { Plus, Edit2, Trash2, Eye, ExternalLink, Github, Upload, Layers, X, Check } from 'lucide-react';

interface ProjectManagerProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
  onPreviewProject: (project: Project) => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({ onShowToast, onPreviewProject }) => {
  const { projects, addProject, updateProject, deleteProject } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'E-Commerce Website',
    description: '',
    technologies: 'React, TypeScript, Tailwind CSS',
    image: '',
    screenshots: [] as string[],
    liveUrl: '',
    githubUrl: '',
    featured: false,
  });

  const categories = [
    'E-Commerce Website',
    'Graduation Project',
    'Web Application',
    'Interactive 3D Experience',
    'Landing Page & UI',
    'IoT & Hardware System',
  ];

  const handleOpenAdd = () => {
    setEditingProjectId(null);
    setFormData({
      name: '',
      category: 'E-Commerce Website',
      description: '',
      technologies: 'React, TypeScript, Tailwind CSS',
      image: '',
      screenshots: [],
      liveUrl: '',
      githubUrl: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setFormData({
      name: project.name,
      category: project.category,
      description: project.description,
      technologies: project.technologies.join(', '),
      image: project.image,
      screenshots: project.screenshots || [project.image],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete project "${name}"?`)) {
      await deleteProject(id);
      onShowToast(`Deleted project "${name}"`);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const cloudUrl = await uploadAssetToSupabase(file);
      if (cloudUrl) {
        setFormData((prev) => ({
          ...prev,
          image: cloudUrl,
          screenshots: prev.screenshots.length === 0 ? [cloudUrl] : prev.screenshots,
        }));
        onShowToast('Main image uploaded to Supabase Storage!');
        return;
      }

      // Base64 fallback
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({
          ...prev,
          image: base64,
          screenshots: prev.screenshots.length === 0 ? [base64] : prev.screenshots,
        }));
        onShowToast('Main image loaded locally!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      onShowToast('Image upload failed', 'error');
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const cloudUrl = await uploadAssetToSupabase(file);
      if (cloudUrl) {
        setFormData((prev) => ({ ...prev, screenshots: [...prev.screenshots, cloudUrl] }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setFormData((prev) => ({ ...prev, screenshots: [...prev.screenshots, base64] }));
        };
        reader.readAsDataURL(file);
      }
    }
    onShowToast('Additional screenshots added!');
  };

  const handleRemoveScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = formData.technologies
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectPayload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      technologies: techArray,
      image: formData.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      screenshots: formData.screenshots.length > 0
        ? formData.screenshots
        : [formData.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'],
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      featured: formData.featured,
    };

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, projectPayload);
        onShowToast(`Updated project "${formData.name}"`);
      } else {
        await addProject(projectPayload);
        onShowToast(`Added new project "${formData.name}"!`);
      }
      setIsModalOpen(false);
    } catch (err) {
      onShowToast('Failed to save project', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900/60 border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Manage Portfolio Projects</h3>
          <p className="text-xs text-slate-400">
            Add new projects, update screenshots, edit descriptions, or remove items.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Project
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-5 rounded-2xl bg-dark-900/40 border border-slate-800/80 hover:border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/60 border border-slate-800 shrink-0">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyber-purple/15 text-cyber-purple border border-cyber-purple/30">
                    {project.category}
                  </span>
                  <h4 className="text-base font-bold text-white font-display">{project.name}</h4>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-1 max-w-xl">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex items-center gap-2 self-end md:self-center">
              <button
                onClick={() => onPreviewProject(project)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Preview project modal"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenEdit(project)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Edit project"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDelete(project.id, project.name)}
                className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Project Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-dark-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyber-purple/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <h3 className="text-xl font-bold font-display text-white">
                {editingProjectId ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mazag Coffee"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Project Category *</label>
                  <input
                    list="categories-list"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Select or enter category"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                  />
                  <datalist id="categories-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Project Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed summary of the project and its capabilities..."
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Technologies Used (Comma-separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, TypeScript, Tailwind CSS, Vite"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                />
              </div>

              {/* Main Image Upload or URL */}
              <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-3">
                <label className="text-xs font-mono text-slate-300 block">Main Project Cover Image</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL or upload file..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                  />
                  <input
                    ref={mainImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => mainImageInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyber-purple text-white hover:bg-cyber-purple/90 flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload File
                  </button>
                </div>
                {formData.image && (
                  <div className="w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                    <img src={formData.image} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Additional Screenshots */}
              <div className="p-4 rounded-xl bg-dark-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-300">Additional Project Screenshots</label>
                  <input
                    ref={screenshotInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5"
                  >
                    <Upload className="w-3 h-3" />
                    Add Screenshots
                  </button>
                </div>

                {formData.screenshots.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.screenshots.map((s, idx) => (
                      <div key={idx} className="relative w-20 h-14 rounded-lg overflow-hidden border border-slate-700 group">
                        <img src={s} alt="screenshot" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(idx)}
                          className="absolute inset-0 bg-black/70 flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Live Demo URL (Leave empty if none)</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-400">Source Code URL (Leave empty if none)</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingProjectId ? 'Save Project Changes' : 'Publish Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


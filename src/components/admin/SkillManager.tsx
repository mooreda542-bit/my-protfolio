import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Skill } from '../../types/portfolio';
import { Plus, Edit2, Trash2, Check, X, Wrench, Layers } from 'lucide-react';

interface SkillManagerProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const SkillManager: React.FC<SkillManagerProps> = ({ onShowToast }) => {
  const { skills, addSkill, updateSkill, deleteSkill } = usePortfolio();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    category: Skill['category'];
    description: string;
  }>({
    name: '',
    category: 'Libraries & Frameworks',
    description: '',
  });

  const categories: Skill['category'][] = [
    'Languages & Core',
    'Libraries & Frameworks',
    'Styling & Design',
    'Tools & Environment',
  ];

  const handleOpenAdd = () => {
    setEditingSkillId(null);
    setFormData({
      name: '',
      category: 'Libraries & Frameworks',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setFormData({
      name: skill.name,
      category: skill.category,
      description: skill.description || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Delete skill "${name}"?`)) {
      try {
        await deleteSkill(id);
        onShowToast(`Deleted skill "${name}"`);
      } catch (err: any) {
        onShowToast(`Failed to delete skill: ${err.message || 'Unknown error'}`, 'error');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingSkillId) {
        await updateSkill(editingSkillId, formData);
        onShowToast(`Updated skill "${formData.name}"`);
      } else {
        await addSkill(formData);
        onShowToast(`Added skill "${formData.name}"`);
      }
      setIsModalOpen(false);
    } catch (err) {
      onShowToast('Failed to save skill', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900/60 border border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white font-display">Manage Skills & Technologies</h3>
          <p className="text-xs text-slate-400">
            Add new technical competencies, update category tags, or remove skills.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Skill
        </button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="p-4 rounded-xl bg-dark-900/40 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 group transition-all"
          >
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyber-cyan border border-slate-700">
                {skill.category}
              </span>
              <h4 className="text-sm font-bold text-white font-display mt-1.5 truncate">
                {skill.name}
              </h4>
              {skill.description && (
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {skill.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleOpenEdit(skill)}
                className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Edit skill"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleDelete(skill.id, skill.name)}
                className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 transition-colors"
                title="Delete skill"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            className="w-full max-w-md bg-dark-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-cyber-purple/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-5">
              <h3 className="text-lg font-bold font-display text-white">
                {editingSkillId ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Skill Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Next.js, Redux, Three.js"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Skill Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-400">Short Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Modern server-side rendering and routing"
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};


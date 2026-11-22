import React, { useState, useRef } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { uploadAssetToSupabase } from '../../lib/supabase';
import { Upload, Trash2, RotateCcw, Save, Check, User, Phone, Mail, Github, MapPin, Sparkles } from 'lucide-react';

interface ProfileManagerProps {
  onShowToast: (msg: string, type?: 'success' | 'error') => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ onShowToast }) => {
  const { profile, updateProfile } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: profile.name,
    displayName: profile.displayName,
    title: profile.title,
    location: profile.location,
    phone: profile.phone,
    email: profile.email,
    github: profile.github,
    about: profile.about,
    heroGreeting: profile.heroGreeting,
    heroDescription: profile.heroDescription,
    photoUrl: profile.photoUrl,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Try uploading to Supabase Storage if configured
      const cloudUrl = await uploadAssetToSupabase(file);
      if (cloudUrl) {
        setFormData((prev) => ({ ...prev, photoUrl: cloudUrl }));
        onShowToast('Photo uploaded to Supabase Storage!');
        setIsUploading(false);
        return;
      }

      // 2. Fallback to Local Base64 Data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData((prev) => ({ ...prev, photoUrl: base64 }));
        onShowToast('Photo updated locally (Base64)!');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed', err);
      onShowToast('Photo upload failed', 'error');
      setIsUploading(false);
    }
  };

  const handleResetPhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '/mohamed-reda.jpg' }));
    onShowToast('Reset to default profile photo');
  };

  const handleDeletePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    }));
    onShowToast('Profile photo removed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      onShowToast('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      onShowToast('Failed to save profile changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      
      {/* Photo Management Section */}
      <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-cyber-purple" />
          Profile Photograph
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-cyber-purple/50 bg-black/60 shadow-glass shrink-0">
            <img
              src={formData.photoUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/mohamed-reda.jpg';
              }}
            />
          </div>

          <div className="space-y-3 flex-1 text-center sm:text-left">
            <p className="text-sm text-slate-300 font-medium">
              Update Mohamed Reda's personal photograph
            </p>
            <p className="text-xs text-slate-500">
              Supported formats: JPG, PNG, WEBP. Maximum file size: 5MB.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyber-purple text-white hover:bg-cyber-purple/90 transition-all flex items-center gap-1.5 shadow-glow-purple"
              >
                <Upload className="w-3.5 h-3.5" />
                {isUploading ? 'Uploading...' : 'Upload New Photo'}
              </button>

              <button
                type="button"
                onClick={handleResetPhoto}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Original
              </button>

              <button
                type="button"
                onClick={handleDeletePhoto}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Basic & Contact Info */}
      <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 space-y-6">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <User className="w-4 h-4 text-cyber-cyan" />
          General & Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Full Official Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Display Name</label>
            <input
              type="text"
              name="displayName"
              required
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Professional Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Location</label>
            <input
              type="text"
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Phone Number (Clickable tel:)</label>
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-400">Email Address (Clickable mailto:)</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-mono text-slate-400">GitHub Profile URL</label>
            <input
              type="url"
              name="github"
              required
              value={formData.github}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Hero & About Text */}
      <div className="p-6 rounded-2xl bg-dark-900/60 border border-slate-800/80 space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Hero & About Narrative
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400">Hero Greeting Heading</label>
          <input
            type="text"
            name="heroGreeting"
            value={formData.heroGreeting}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400">Hero Subtitle Description</label>
          <textarea
            name="heroDescription"
            rows={2}
            value={formData.heroDescription}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400">About Me Full Narrative</label>
          <textarea
            name="about"
            rows={4}
            value={formData.about}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-800 text-white text-sm focus:border-cyber-purple focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cyber-purple to-cyber-blue text-white shadow-glow-purple hover:opacity-95 transition-all flex items-center gap-2 text-sm"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </div>

    </form>
  );
};


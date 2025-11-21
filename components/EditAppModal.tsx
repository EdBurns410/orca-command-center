
import React, { useState, useEffect } from 'react';
import { X, Save, Globe, Type, Cloud } from 'lucide-react';
import { AppProject } from '../types';

interface EditAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppProject | null;
  onSave: (app: AppProject) => void;
}

export const EditAppModal: React.FC<EditAppModalProps> = ({ isOpen, onClose, app, onSave }) => {
  const [formData, setFormData] = useState<Partial<AppProject>>({});

  useEffect(() => {
    if (app) {
      setFormData({ ...app });
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleSave = () => {
    onSave({ ...app, ...formData } as AppProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-slate-950 p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe size={18} className="text-cyan-400" />
            Edit App Metadata
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Type size={12} /> App Name
            </label>
            <input 
              type="text" 
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-cyan-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
            <textarea 
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded p-3 text-white focus:border-cyan-500 outline-none resize-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Cloud size={12} className="text-green-400" /> Production URL (Google Cloud Run)
            </label>
            <input 
              type="url" 
              value={formData.url || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="https://myapp-xyz.a.run.app"
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-green-400 font-mono text-sm focus:border-green-500 outline-none"
            />
            <p className="text-[10px] text-slate-600">
              Enter the URL provided by Google Cloud Run after deployment.
            </p>
          </div>

          <button 
            onClick={handleSave}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

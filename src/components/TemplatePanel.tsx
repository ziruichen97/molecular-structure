import { useState } from 'react';
import { useMoleculeStore } from '../store/useMoleculeStore';
import { MOLECULE_TEMPLATES } from '../data/templates';
import type { MoleculeTemplate } from '../types/chemistry';

export function TemplatePanel() {
  const { loadTemplate, saveAsTemplate, deleteCustomTemplate, getCustomTemplates, atoms } = useMoleculeStore();
  const [templateName, setTemplateName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [customTemplates, setCustomTemplates] = useState<MoleculeTemplate[]>(getCustomTemplates());

  const handleSave = () => {
    if (!templateName.trim()) return;
    saveAsTemplate(templateName.trim());
    setCustomTemplates(getCustomTemplates());
    setTemplateName('');
    setShowSaveInput(false);
  };

  const handleDelete = (name: string) => {
    deleteCustomTemplate(name);
    setCustomTemplates(getCustomTemplates());
  };

  return (
    <div className="p-3 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Save Template
          </h3>
        </div>
        {showSaveInput ? (
          <div className="flex gap-1.5 mb-3">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Template name..."
              className="flex-1 bg-gray-50 text-gray-800 rounded px-2 py-1.5 text-sm border border-gray-200 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={!templateName.trim() || atoms.length === 0}
              className="px-2 py-1.5 rounded bg-blue-600 text-white text-xs hover:bg-blue-500 disabled:opacity-40"
            >
              Save
            </button>
            <button
              onClick={() => { setShowSaveInput(false); setTemplateName(''); }}
              className="px-2 py-1.5 rounded bg-gray-100 text-gray-600 text-xs hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSaveInput(true)}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-3"
          >
            + Save Current as Template
          </button>
        )}
      </div>

      {customTemplates.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Custom Templates
          </h3>
          <div className="space-y-1.5">
            {customTemplates.map((template, idx) => (
              <div
                key={`custom-${idx}`}
                className="w-full text-left px-3 py-2 rounded bg-green-50 border border-green-200 hover:border-green-400 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => loadTemplate(template)}
                    className="flex-1 text-left"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {template.name}
                    </span>
                    <span className="text-xs font-mono text-green-600 ml-2">{template.formula}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(template.name)}
                    className="ml-2 px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-xs hover:bg-red-200"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-0.5">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Built-in Templates
        </h3>
        <div className="space-y-1.5">
          {MOLECULE_TEMPLATES.map(template => (
            <button
              key={template.name}
              onClick={() => loadTemplate(template)}
              className="w-full text-left px-3 py-2 rounded bg-gray-50 border border-gray-200 hover:border-blue-400 hover:bg-gray-100 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {template.name}
                  </span>
                </div>
                <span className="text-xs font-mono text-blue-500">{template.formula}</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

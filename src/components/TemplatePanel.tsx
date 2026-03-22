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
    <div className="p-4 space-y-5">
      <div>
        {showSaveInput ? (
          <div className="flex gap-1.5 mb-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Template name..."
              className="flex-1 bg-surface-container text-on-surface rounded-lg px-3 py-2 text-sm border border-outline-variant focus:border-primary focus:outline-none"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={!templateName.trim() || atoms.length === 0}
              className="px-3 py-2 rounded-lg bg-primary text-on-primary text-xs font-medium hover:bg-primary-hover disabled:opacity-30"
            >
              Save
            </button>
            <button
              onClick={() => { setShowSaveInput(false); setTemplateName(''); }}
              className="px-3 py-2 rounded-lg bg-surface-container text-on-surface-variant text-xs font-medium hover:bg-surface-container-high"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowSaveInput(true)}
            disabled={atoms.length === 0}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-sm font-medium hover:bg-surface-container-high border border-dashed border-outline disabled:opacity-30 disabled:cursor-not-allowed transition-colors mb-4"
          >
            + Save Current as Template
          </button>
        )}
      </div>

      {customTemplates.length > 0 && (
        <div>
          <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
            Custom Templates
          </h3>
          <div className="space-y-1.5">
            {customTemplates.map((template, idx) => (
              <div
                key={`custom-${idx}`}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-success-light hover:shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => loadTemplate(template)}
                    className="flex-1 text-left"
                  >
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary">
                      {template.name}
                    </span>
                    <span className="text-xs font-mono text-success ml-2">{template.formula}</span>
                  </button>
                  <button
                    onClick={() => handleDelete(template.name)}
                    className="ml-2 w-6 h-6 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-danger-light hover:text-danger text-xs"
                  >
                    &times;
                  </button>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
          Built-in Templates
        </h3>
        <div className="space-y-1">
          {MOLECULE_TEMPLATES.map(template => (
            <button
              key={template.name}
              onClick={() => loadTemplate(template)}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-container transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface group-hover:text-primary">
                  {template.name}
                </span>
                <span className="text-xs font-mono text-primary opacity-70">{template.formula}</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-0.5">{template.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

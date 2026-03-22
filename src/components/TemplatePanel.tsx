import { useMoleculeStore } from '../store/useMoleculeStore';
import { MOLECULE_TEMPLATES } from '../data/templates';

export function TemplatePanel() {
  const { loadTemplate } = useMoleculeStore();

  return (
    <div className="p-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        分子模板
      </h3>
      <div className="space-y-1.5">
        {MOLECULE_TEMPLATES.map(template => (
          <button
            key={template.name}
            onClick={() => loadTemplate(template)}
            className="w-full text-left px-3 py-2 rounded bg-gray-700/50 border border-gray-600 hover:border-blue-500 hover:bg-gray-700 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">
                  {template.nameCN}
                </span>
                <span className="text-xs text-gray-500 ml-2">{template.name}</span>
              </div>
              <span className="text-xs font-mono text-blue-400">{template.formula}</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

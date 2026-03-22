import { useState } from 'react';
import { ElementSelector } from './ElementSelector';
import { TemplatePanel } from './TemplatePanel';
import { PropertiesPanel } from './PropertiesPanel';
import { SettingsPanel } from './SettingsPanel';
import { FilePanel } from './FilePanel';

type Tab = 'elements' | 'templates' | 'properties' | 'settings' | 'file';

const tabs: { id: Tab; label: string }[] = [
  { id: 'elements', label: 'Elements' },
  { id: 'templates', label: 'Templates' },
  { id: 'properties', label: 'Properties' },
  { id: 'file', label: 'File' },
  { id: 'settings', label: 'Settings' },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('elements');

  return (
    <div className="w-72 bg-surface border-l border-outline-variant flex flex-col h-full">
      <div className="flex px-2 pt-1 gap-0.5 border-b border-outline-variant">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-2.5 py-2 text-[12px] font-medium transition-colors rounded-t-lg ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            title={tab.label}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'elements' && <ElementSelector />}
        {activeTab === 'templates' && <TemplatePanel />}
        {activeTab === 'properties' && <PropertiesPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
        {activeTab === 'file' && <FilePanel />}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ElementSelector } from './ElementSelector';
import { TemplatePanel } from './TemplatePanel';
import { PropertiesPanel } from './PropertiesPanel';
import { SettingsPanel } from './SettingsPanel';
import { FilePanel } from './FilePanel';

type Tab = 'elements' | 'templates' | 'properties' | 'settings' | 'file';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'elements', label: 'Elements', icon: '⚛' },
  { id: 'templates', label: 'Templates', icon: '📦' },
  { id: 'properties', label: 'Properties', icon: '📊' },
  { id: 'file', label: 'File', icon: '💾' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('elements');

  return (
    <div className="w-64 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-1 py-2 text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            title={tab.label}
          >
            <span className="block text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
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

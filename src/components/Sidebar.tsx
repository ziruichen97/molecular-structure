import { useState } from 'react';
import { ElementSelector } from './ElementSelector';
import { TemplatePanel } from './TemplatePanel';
import { PropertiesPanel } from './PropertiesPanel';
import { SettingsPanel } from './SettingsPanel';
import { FilePanel } from './FilePanel';

type Tab = 'elements' | 'templates' | 'properties' | 'settings' | 'file';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'elements', label: '元素', icon: '⚛' },
  { id: 'templates', label: '模板', icon: '📦' },
  { id: 'properties', label: '属性', icon: '📊' },
  { id: 'file', label: '文件', icon: '💾' },
  { id: 'settings', label: '设置', icon: '⚙' },
];

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>('elements');

  return (
    <div className="w-64 bg-gray-800 border-l border-gray-700 flex flex-col h-full">
      <div className="flex border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-1 py-2 text-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-750'
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

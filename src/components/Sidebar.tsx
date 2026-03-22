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

function IconChevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === 'right'
        ? <path d="M6 3l5 5-5 5" />
        : <path d="M10 3l-5 5 5 5" />
      }
    </svg>
  );
}

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<Tab>('elements');

  return (
    <div className="relative flex h-full">
      <button
        onClick={onToggle}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-14 flex items-center justify-center bg-surface border border-outline-variant rounded-l-xl shadow-md hover:bg-surface-container-high transition-colors"
        title={open ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <IconChevron direction={open ? 'right' : 'left'} />
      </button>

      <div
        className={`bg-surface border-l border-outline-variant flex flex-col h-full overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'w-80 opacity-100' : 'w-0 opacity-0'
        }`}
      >
        <div className="flex px-3 pt-2 pb-0 gap-1 border-b border-outline-variant min-w-80">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-3.5 py-3 text-[13px] font-medium transition-colors rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
              title={tab.label}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-w-80">
          {activeTab === 'elements' && <ElementSelector />}
          {activeTab === 'templates' && <TemplatePanel />}
          {activeTab === 'properties' && <PropertiesPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
          {activeTab === 'file' && <FilePanel />}
        </div>
      </div>
    </div>
  );
}

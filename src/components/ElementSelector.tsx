import { useMoleculeStore } from '../store/useMoleculeStore';
import { ELEMENTS, COMMON_ELEMENTS } from '../data/elements';
import type { BondType } from '../types/chemistry';

const bondTypes: { type: BondType; label: string; symbol: string }[] = [
  { type: 'single', label: 'Single', symbol: '\u2014' },
  { type: 'double', label: 'Double', symbol: '=' },
  { type: 'triple', label: 'Triple', symbol: '\u2261' },
  { type: 'aromatic', label: 'Aromatic', symbol: '\u25CE' },
];

export function ElementSelector() {
  const {
    selectedElement,
    setSelectedElement,
    selectedBondType,
    setSelectedBondType,
    toolMode,
  } = useMoleculeStore();

  return (
    <div className="p-5 space-y-7">
      <div>
        <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
          Element
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {COMMON_ELEMENTS.map(symbol => {
            const el = ELEMENTS[symbol];
            const isActive = selectedElement === symbol;
            return (
              <button
                key={symbol}
                onClick={() => setSelectedElement(symbol)}
                className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-light ring-2 ring-primary shadow-sm'
                    : 'bg-surface-container hover:bg-surface-container-high'
                }`}
                title={`${el.name} - Atomic Mass: ${el.atomicMass}`}
              >
                <div
                  className="w-6 h-6 rounded-full mb-1.5 shadow-sm"
                  style={{ backgroundColor: el.color, border: '1.5px solid rgba(0,0,0,0.1)' }}
                />
                <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                  {symbol}
                </span>
                <span className="text-[9px] text-on-surface-variant mt-0.5">{el.atomicNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {(toolMode === 'addBond' || toolMode === 'select') && (
        <div>
          <h3 className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
            Bond Type
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {bondTypes.map(bt => {
              const isActive = selectedBondType === bt.type;
              return (
                <button
                  key={bt.type}
                  onClick={() => setSelectedBondType(bt.type)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-primary-light text-primary ring-2 ring-primary shadow-sm font-medium'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="text-lg leading-none">{bt.symbol}</span>
                  <span>{bt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

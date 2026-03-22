import { useMoleculeStore } from '../store/useMoleculeStore';
import { ELEMENTS, COMMON_ELEMENTS } from '../data/elements';
import type { BondType } from '../types/chemistry';

const bondTypes: { type: BondType; label: string; symbol: string }[] = [
  { type: 'single', label: 'Single', symbol: '—' },
  { type: 'double', label: 'Double', symbol: '=' },
  { type: 'triple', label: 'Triple', symbol: '≡' },
  { type: 'aromatic', label: 'Aromatic', symbol: '◎' },
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
    <div className="p-3 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Element Selection
        </h3>
        <div className="grid grid-cols-5 gap-1.5">
          {COMMON_ELEMENTS.map(symbol => {
            const el = ELEMENTS[symbol];
            const isActive = selectedElement === symbol;
            return (
              <button
                key={symbol}
                onClick={() => setSelectedElement(symbol)}
                className={`relative flex flex-col items-center justify-center p-1.5 rounded border transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-100 ring-1 ring-blue-500'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                }`}
                title={`${el.name} - Atomic Mass: ${el.atomicMass}`}
              >
                <div
                  className="w-4 h-4 rounded-full mb-0.5 border border-gray-300"
                  style={{ backgroundColor: el.color }}
                />
                <span className="text-sm font-bold text-gray-700">{symbol}</span>
                <span className="text-[9px] text-gray-400">{el.atomicNumber}</span>
              </button>
            );
          })}
        </div>
      </div>

      {(toolMode === 'addBond' || toolMode === 'select') && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Bond Type
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {bondTypes.map(bt => {
              const isActive = selectedBondType === bt.type;
              return (
                <button
                  key={bt.type}
                  onClick={() => setSelectedBondType(bt.type)}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded border text-sm transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-100 text-gray-900'
                      : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{bt.symbol}</span>
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

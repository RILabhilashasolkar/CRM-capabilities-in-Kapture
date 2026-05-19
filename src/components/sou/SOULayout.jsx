import { User } from 'lucide-react';

export default function SOULayout({ children, title, onBack }) {
  return (
    <div className="sou-root">
      {/* Blue header */}
      <div className="sou-header">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="text-white opacity-80 hover:opacity-100 mr-1 text-sm flex items-center gap-1">
              ←
            </button>
          )}
          {/* JioMart logo placeholder */}
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-blue-800" style={{ fontSize: 9 }}>JMD</span>
          </div>
          <span className="sou-header-title">Service Order Utility</span>
        </div>
        <button className="text-white opacity-80 hover:opacity-100">
          <User size={20} />
        </button>
      </div>
      {children}
    </div>
  );
}

import { Bell, GraduationCap, ChevronDown, RefreshCw } from 'lucide-react';
import { currentUser } from '../../data/dummyData';

export default function Header({ title }) {
  return (
    <div className="k-header flex items-center justify-between px-4 h-10 flex-shrink-0" style={{ minHeight: 40 }}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-gray-800 text-sm">{title || 'Tickets'}</span>
      </div>
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 border border-gray-200 rounded px-2 py-1">
          <GraduationCap size={13} />
          <span>KM Portal</span>
        </button>
        <button className="text-gray-400 hover:text-gray-600 relative">
          <Bell size={16} />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white" style={{ fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </button>
        <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-0.5">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-xs text-gray-600">Active</span>
        </div>
        <button className="flex items-center gap-1 text-xs text-gray-700 hover:text-gray-900">
          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            {currentUser.avatar}
          </div>
          <span>{currentUser.name}</span>
          <ChevronDown size={12} />
        </button>
        <button className="text-gray-400 hover:text-gray-600">
          <RefreshCw size={15} />
        </button>
      </div>
    </div>
  );
}

import { Bell, GraduationCap, ChevronDown, RefreshCw } from 'lucide-react';
import { currentUser } from '../../data/dummyData';

export default function Header({ title = 'Tickets' }) {
  return (
    <div className="k-top-bar">
      <span className="font-semibold text-gray-800 text-sm flex-1">{title}</span>
      <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 border border-gray-200 rounded px-2 py-1 mr-1">
        <GraduationCap size={13} /><span>KM Portal</span>
      </button>
      <button className="text-gray-400 hover:text-gray-600 relative mr-2">
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white flex items-center justify-center" style={{ fontSize: 8 }}>3</span>
      </button>
      <div className="flex items-center gap-1 border border-gray-200 rounded px-2 py-0.5 mr-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span className="text-xs text-gray-600">Active</span>
      </div>
      <button className="flex items-center gap-1 text-xs text-gray-700 mr-2">
        <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{currentUser.avatar}</div>
        <span>{currentUser.name}</span>
        <ChevronDown size={12} />
      </button>
      <RefreshCw size={14} className="text-gray-400" />
    </div>
  );
}

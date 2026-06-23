import React from "react";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Database, 
  Terminal, 
  BookOpen, 
  Radio, 
  FileSpreadsheet, 
  User,
  Activity,
  Award
} from "lucide-react";
import { ViewType } from "../types";

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Security Dashboard", icon: LayoutDashboard },
    { id: "library", label: "Attack Library", icon: Database },
    { id: "engine", label: "Automated Attack Engine", icon: Terminal },
    { id: "owasp", label: "OWASP Top 10 Map", icon: Award },
    { id: "threat-intel", label: "Threat Intelligence", icon: Radio },
    { id: "reports", label: "Executive Reports", icon: FileSpreadsheet },
  ] as const;

  return (
    <aside className="w-64 bg-[#0D0E14] border-r border-slate-800/60 text-slate-300 flex flex-col justify-between h-screen shrink-0 font-sans sticky top-0">
      <div>
        {/* Banner Logo */}
        <div className="p-6 border-b border-slate-800/60 flex items-center space-x-3 bg-[#0D0E14]">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-lg shadow-red-900/40">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight uppercase text-lg block leading-none">
              ModelSentinel
            </span>
            <span className="text-[10px] text-slate-500 font-mono block tracking-widest uppercase mt-1">
              assessment platform
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono font-bold pl-3 mb-2">
            Operations
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-btn-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer text-left group ${
                  isActive 
                    ? "bg-red-650/10 border-l-2 border-red-600 text-red-500 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-white border-l-2 border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-200 group-hover:scale-105 ${
                  isActive ? "text-red-500" : "text-slate-500 group-hover:text-slate-300"
                }`} />
                <span className="flex-1 truncate">{item.label}</span>
                {item.id === "threat-intel" && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operator Metadata section */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/20">
        <div className="flex items-center space-x-3 p-2 rounded bg-slate-800/30 border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-white block truncate leading-none">
              J. Donovan
            </span>
            <span className="text-[10px] text-slate-500 font-mono truncate block mt-1 font-bold uppercase">
              CISO Admin
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-bold uppercase">Engine Idle</span>
          </div>
          <div>v2.4.0</div>
        </div>
      </div>
    </aside>
  );
}

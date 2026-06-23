import React from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  FileText, 
  Globe, 
  TrendingUp, 
  Activity,
  Maximize2
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { AuditSessionInstance } from "../types";

interface DashboardViewProps {
  auditLogs: AuditSessionInstance[];
  onNavigateToEngine: () => void;
}

export default function DashboardView({ auditLogs, onNavigateToEngine }: DashboardViewProps) {
  // Aggregate Metrics from Logs
  const totalAttacks = auditLogs.length;
  const vulnerabilityRuns = auditLogs.filter(log => log.verdict === "Vulnerable");
  const vulnerabilityCount = vulnerabilityRuns.length;
  const attackSuccessRate = totalAttacks > 0 ? Math.round((vulnerabilityCount / totalAttacks) * 100) : 40; // fallback to fallback seed if empty

  // Calculate Average Security Rating
  let ratingCode = "A+";
  let ratingColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
  let ratingLabel = "Excellent Resistance";

  if (attackSuccessRate > 60) {
    ratingCode = "F";
    ratingColor = "text-red-500 bg-red-500/10 border-red-500/30";
    ratingLabel = "Critical Vulnerability Exposure";
  } else if (attackSuccessRate > 40) {
    ratingCode = "C-";
    ratingColor = "text-amber-500 bg-amber-500/10 border-amber-500/30";
    ratingLabel = "Moderate Safety Risks";
  } else if (attackSuccessRate > 20) {
    ratingCode = "B";
    ratingColor = "text-blue-500 bg-blue-500/10 border-blue-500/30";
    ratingLabel = "Defended Stronghold";
  }

  // Calculate Vulnerability Counts by Category
  const categoryCounts = auditLogs.reduce((acc, log) => {
    if (log.verdict === "Vulnerable") {
      acc[log.category] = (acc[log.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Built-in sample metrics to show a beautiful chart in all cases
  const safetyHistoryData = [
    { name: "Mon 01", resistance: 88, attacks: 4 },
    { name: "Tue 02", resistance: 85, attacks: 8 },
    { name: "Wed 03", resistance: 90, attacks: 12 },
    { name: "Thu 04", resistance: 78, attacks: 15 },
    { name: "Fri 05", resistance: 82, attacks: 9 },
    { name: "Sat 06", resistance: 94, attacks: 3 },
    { name: "Today", resistance: 100 - attackSuccessRate, attacks: totalAttacks }
  ];

  // Scoring by Vectors for Radar Chart
  const radarData = [
    { subject: "Prompt Injection", A: 100 - (categoryCounts["Prompt Injection"] ? categoryCounts["Prompt Injection"] * 20 : 15), fullMark: 100 },
    { subject: "Jailbreaks", A: 100 - (categoryCounts["Jailbreak"] ? categoryCounts["Jailbreak"] * 20 : 25), fullMark: 100 },
    { subject: "Data Leakage", A: 100 - (categoryCounts["Data Extraction"] ? categoryCounts["Data Extraction"] * 20 : 10), fullMark: 100 },
    { subject: "Tool Abuse", A: 100 - (categoryCounts["Tool Abuse"] ? categoryCounts["Tool Abuse"] * 20 : 20), fullMark: 100 },
    { subject: "Social Eng", A: 100 - (categoryCounts["Social Engineering"] ? categoryCounts["Social Engineering"] * 20 : 30), fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <div className="flex justify-between items-center bg-[#0D0E14] p-6 rounded-lg border border-slate-800/60">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">AI Red Teaming Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Analyze safety posture compliance, execute active vulnerabilities probe, and evaluate prompt injections risk ratings.
          </p>
        </div>
        <button
          onClick={onNavigateToEngine}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded uppercase transition-colors shadow-lg shadow-red-950/40 cursor-pointer flex items-center space-x-2"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Launch Attack Engine</span>
        </button>
      </div>

      {/* Metric Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Posture Rating */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-lg flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 tracking-wider font-mono font-bold uppercase block">
              Security Posture
            </span>
            <span className="text-[15px] font-bold text-white block truncate max-w-[150px]">{ratingLabel}</span>
            <span className="text-[10px] text-slate-600 block font-mono">Based on live audits</span>
          </div>
          <div className={`w-12 h-12 rounded border flex flex-col justify-center items-center font-mono ${ratingColor}`}>
            <span className="text-xl font-extrabold tracking-tight leading-none">{ratingCode}</span>
          </div>
        </div>

        {/* Attack Success Rate */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 tracking-wider font-mono font-bold uppercase block">
                Attack Success Rate
              </span>
              <span className="text-2xl font-bold font-mono text-white block">
                {attackSuccessRate}%
              </span>
            </div>
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
              <Flame className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-3 leading-none">
            Vulnerable Runs: <span className="text-red-400 font-bold">{vulnerabilityCount}</span> / {totalAttacks}
          </p>
        </div>

        {/* Blocked Attacks */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 tracking-wider font-mono font-bold uppercase block">
                Secured Resistance
              </span>
              <span className="text-2xl font-bold font-mono text-white block">
                {totalAttacks > 0 ? (totalAttacks - vulnerabilityCount) : 0}
              </span>
            </div>
            <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-3 leading-none">
            Bypasses Deflected: <span className="text-emerald-400 font-bold">{totalAttacks - vulnerabilityCount}</span>
          </p>
        </div>

        {/* Global LLM Posture Score */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-lg flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 tracking-wider font-mono font-bold uppercase block">
                Active Audit Targets
              </span>
              <span className="text-2xl font-bold font-mono text-white block">
                3
              </span>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded border border-blue-500/20">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-mono mt-3 leading-none">
            GPT-4o, Claude 3.5, Llama-3-70B
          </p>
        </div>
      </div>

      {/* Threat Posture Insights and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resistance Radar Chart */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-lg lg:col-span-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase">
              Vulnerability Footprint
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">Safety resistance rates categorized by security vectors.</p>
          </div>
          
          <div className="h-56 w-full flex items-center justify-center py-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569' }} />
                <Radar name="Resistance Score" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.25} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0E14', borderColor: '#1e293b', color: '#fff' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono flex justify-between">
            <span>Low Value = Vulnerable</span>
            <span>High Value = Defended</span>
          </div>
        </div>

        {/* Safety Trend Index */}
        <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-lg lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase">
                  Resistance Trend Index
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">Daily security posture resistance and attack density metrics.</p>
              </div>
              <span className="flex items-center space-x-1 font-mono text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+4.2%</span>
              </span>
            </div>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={safetyHistoryData}>
                <defs>
                  <linearGradient id="resistanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} stroke="#334155" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} stroke="#334155" domain={[0, 120]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0E14', borderColor: '#1e293b', color: '#fff', fontSize: 11 }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="resistance" name="Resistance %" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#resistanceGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[10px] text-slate-500 font-mono mt-2">
            *Resistance index represents the percentage of adversarial attacks successfully rejected by our safety engine.
          </p>
        </div>
      </div>

      {/* Latest Runs Feed */}
      <div className="bg-[#0D0E14]/40 border border-slate-800/60 rounded-lg overflow-hidden">
        <div className="p-5 border-b border-slate-800/60 flex justify-between items-center bg-[#0D0E14]/70">
          <div>
            <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase">
              Recent Red Teaming Runs
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time telemetry from automated simulation tasks.</p>
          </div>
          <button 
            onClick={onNavigateToEngine}
            className="text-xs text-red-500 hover:text-red-400 font-bold font-mono hover:underline cursor-pointer"
          >
            Launch Run Console &rarr;
          </button>
        </div>

        {auditLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs italic">
            No simulation logs registered in this session. Go to the{" "}
            <span onClick={onNavigateToEngine} className="text-red-500 cursor-pointer underline font-bold">
              Automated Attack Engine
            </span>{" "}
            to play individual tests!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 max-h-85 overflow-y-auto bg-[#0a0b10]/20">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-all border-b border-slate-800/40 last:border-0">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <span className={`shrink-0 px-2.5 py-0.5 text-[9px] font-mono tracking-wider uppercase font-bold rounded border ${
                    log.verdict === "Vulnerable" 
                      ? "bg-red-950/40 text-red-400 border-red-800/60" 
                      : "bg-emerald-900/40 text-emerald-400 border-emerald-800/60"
                  }`}>
                    {log.verdict}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {log.attackTitle}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-slate-500 mt-1">
                      <span>Target: <strong className="text-slate-400 font-normal">{log.targetModel}</strong></span>
                      <span>&bull;</span>
                      <span>Category: <strong className="text-slate-400 font-normal">{log.category}</strong></span>
                      <span>&bull;</span>
                      <span>OWASP: <strong className="text-slate-400 font-normal">{log.owaspCode}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0 justify-between self-end md:self-center font-mono">
                  <div className="text-right">
                    <span className="text-[9px] text-slate-500 block leading-none">Threat Rating</span>
                    <span className={`text-[11px] font-bold uppercase ${
                      log.threatScore > 70 ? "text-red-500" : log.threatScore > 40 ? "text-amber-500" : "text-emerald-500"
                    }`}>
                      {log.threatScore} / 100 ({log.riskLevel})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

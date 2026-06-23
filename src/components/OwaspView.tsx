import React, { useState } from "react";
import { 
  Award, 
  AlertOctagon, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Flame, 
  FileCheck2,
  ListCollapse,
  ChevronDown,
  Info
} from "lucide-react";
import { OWASP_LLM_TOP_10, AuditSessionInstance } from "../types";

interface OwaspViewProps {
  auditLogs: AuditSessionInstance[];
}

export default function OwaspView({ auditLogs }: OwaspViewProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(OWASP_LLM_TOP_10[0]?.code || null);

  // Group failures by OWASP code inside audit results
  const failedOwaspMapping = auditLogs.reduce((acc, log) => {
    if (log.verdict === "Vulnerable") {
      acc[log.owaspCode] = (acc[log.owaspCode] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const activeTopicDetails = OWASP_LLM_TOP_10.find(topic => topic.code === selectedTopic) || OWASP_LLM_TOP_10[0];

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "Critical": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Medium": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900/40 p-5 rounded-lg border border-slate-800/60">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span>Interactive OWASP LLM Top 10 Map</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Examine vulnerability records mapped against enterprise standards for industrial compliance validation.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Grid Selector */}
        <div className="lg:col-span-5 space-y-3">
          <p className="text-[10px] uppercase font-mono text-slate-500 font-bold tracking-wider pl-1">
            OWASP Vulnerabilities Directory
          </p>

          <div className="space-y-2">
            {OWASP_LLM_TOP_10.map((topic) => {
              const active = selectedTopic === topic.code;
              const failures = failedOwaspMapping[topic.code] || 0;

              return (
                <button
                  key={topic.code}
                  onClick={() => setSelectedTopic(topic.code)}
                  className={`w-full text-left p-3.5 rounded border transition-all flex items-center justify-between cursor-pointer group ${
                    active 
                      ? "bg-slate-900 border-slate-700 text-white" 
                      : "bg-slate-900/15 border-slate-800/60 hover:bg-slate-900/40"
                  }`}
                >
                  <div className="min-w-0 pr-3">
                    <span className="text-[10px] uppercase font-mono text-slate-505 block">
                      Compliance Section
                    </span>
                    <span className={`text-xs font-bold transition-colors block ${active ? "text-red-400" : "text-slate-305 group-hover:text-slate-200"}`}>
                      {topic.code}: {topic.title}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center space-x-2.5">
                    {failures > 0 ? (
                      <span className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded bg-red-500/10 text-red-500 border border-red-505/20">
                        <Flame className="w-3 h-3 animate-pulse" />
                        <span>{failures} Vuln</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-955 text-slate-500 rounded border border-slate-900">
                        Secure
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/60 rounded-lg p-5 self-start space-y-5">
          <div className="border-b border-slate-800 pb-3 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-yellow-500 font-mono text-xs font-bold uppercase tracking-wider block">
                Vulnerability Specifications
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeTopicDetails.code} &mdash; {activeTopicDetails.title}
              </h2>
            </div>

            <span className={`px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded border shrink-0 ${getSeverityColor(activeTopicDetails.threatLevel)}`}>
              Severity {activeTopicDetails.threatLevel}
            </span>
          </div>

          {/* Description Section */}
          <div className="space-y-1">
            <h3 className="text-xs uppercase font-mono text-slate-505 font-bold tracking-widest leading-none">
              vulnerability overview
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed pt-1.5 font-sans">
              {activeTopicDetails.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Exploit Vector block */}
            <div className="bg-slate-950/40 p-3.5 rounded border border-slate-850 space-y-2">
              <span className="text-[10px] uppercase font-mono text-red-400 font-bold tracking-wider block">
                Adversarial Attack Vectors
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {activeTopicDetails.exploitVector}
              </p>
            </div>

            {/* Shield Remediation recommend */}
            <div className="bg-slate-950/40 p-3.5 rounded border border-slate-850 space-y-2">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold tracking-wider block">
                mitigation & remediation guidelines
              </span>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                {activeTopicDetails.remediation}
              </p>
            </div>
          </div>

          {/* Connected Audit Logs count */}
          <div className="mt-2 pt-4 border-t border-slate-800/60 space-y-3">
            <h3 className="text-xs uppercase font-mono text-slate-500 font-bold tracking-widest leading-none">
              Associated Incident Telemetry logs
            </h3>

            {auditLogs.filter(log => log.owaspCode === activeTopicDetails.code).length === 0 ? (
              <p className="text-xs text-slate-550 italic font-mono pl-0.5">
                No active target exploits registered against code compliance framework {activeTopicDetails.code}. Target model security looks solid.
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto font-mono text-[11px] divide-y divide-slate-850/50 pr-2">
                {auditLogs
                  .filter(log => log.owaspCode === activeTopicDetails.code)
                  .map((log) => (
                    <div key={log.id} className="pt-2 flex justify-between items-start gap-4">
                      <div>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold mr-2 ${
                          log.verdict === "Vulnerable" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                        }`}>
                          {log.verdict}
                        </span>
                        <span className="text-slate-300 font-semibold">{log.attackTitle}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{log.timestamp.slice(11, 19)}</span>
                    </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

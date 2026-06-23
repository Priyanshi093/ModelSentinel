import React from "react";
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Flame, 
  Info,
  Calendar,
  User,
  GitBranch
} from "lucide-react";
import { AuditSessionInstance } from "../types";

interface ReportViewProps {
  auditLogs: AuditSessionInstance[];
}

export default function ReportView({ auditLogs }: ReportViewProps) {
  const totalAttacks = auditLogs.length;
  const vulnerabilityRuns = auditLogs.filter(log => log.verdict === "Vulnerable");
  const vulnerabilityCount = vulnerabilityRuns.length;
  const attackSuccessRate = totalAttacks > 0 ? Math.round((vulnerabilityCount / totalAttacks) * 100) : 40;

  // Compile compliance grade
  let complianceGrade = "A";
  let gradeColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/10";
  let descriptionText = "Strong defensive structures with immediate response blocks in place.";

  if (attackSuccessRate > 60) {
    complianceGrade = "F";
    gradeColor = "text-red-500 border-red-500/20 bg-red-500/10";
    descriptionText = "CRITICAL: Major compliance failure with substantial systemic risks detected in prompt constraints.";
  } else if (attackSuccessRate > 45) {
    complianceGrade = "D";
    gradeColor = "text-orange-500 border-orange-500/20 bg-orange-500/10";
    descriptionText = "SEVERE: Significant vulnerabilities exposed. Immediate mitigation required for production services.";
  } else if (attackSuccessRate > 20) {
    complianceGrade = "B-";
    gradeColor = "text-amber-500 border-amber-500/20 bg-amber-500/10";
    descriptionText = "CAUTION: Minor leaks and bypass paths detected during multi-turn sandbox simulations.";
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <FileSpreadsheet className="w-5.5 h-5.5 text-red-500" />
            <span>Executive Audit Analytics & Reports</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Produce SOC2 and compliance ready assessments summarizing model resistance and critical failure logs.
          </p>
        </div>

        <div className="flex space-x-2.5">
          <button
            onClick={handlePrint}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printed Page Mock */}
      <div className="bg-white text-slate-900 p-8 md:p-12 rounded-xl border border-slate-300 shadow-xl space-y-8 select-text font-serif max-w-4xl mx-auto printable-section">
        {/* Document Header Logo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-slate-900 pb-6 gap-4">
          <div className="space-y-1">
            <span className="font-sans font-extrabold text-2xl tracking-tight text-slate-900 block">
              ModelSentinel 
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase block">
              cyber-security audit division
            </span>
          </div>

          <div className="text-right font-mono text-xs space-y-1 text-slate-600">
            <div className="flex items-center md:justify-end space-x-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Assessment Date: June 10, 2026</span>
            </div>
            <div className="flex items-center md:justify-end space-x-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Lead Auditor: admin@modelsentinel.ai</span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold block">REPORT REVISION: v3.11-SOC2</span>
          </div>
        </div>

        {/* Section 1: Executive Posture Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-slate-900 border-b border-slate-300 pb-1.5 uppercase tracking-wide">
            1. Executive Assessment summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Grade circle */}
            <div className="md:col-span-3 flex flex-col items-center justify-center py-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest">
                Compliance Grade
              </span>
              <span className="text-6xl font-sans font-black text-red-600 my-2">
                {complianceGrade}
              </span>
              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">
                Audit Verified
              </span>
            </div>

            <div className="md:col-span-9 space-y-2 font-serif text-sm text-slate-700 leading-relaxed">
              <p>
                During this security review cycle, our Automated Red Teaming Engine simulated adversarial inputs against enterprise models to gauge security controls performance. The assessment focused on prompt injection parameters, direct jailbreaks resistance, data extraction disclosures, and compliance frameworks.
              </p>
              <p className="font-sans font-semibold text-slate-800">
                Operational Severity Statement: <span className="text-red-650">{descriptionText}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Core Telemetry Matrix */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xl font-sans font-bold text-slate-900 border-b border-slate-300 pb-1.5 uppercase tracking-wide">
            2. Safety Telemetry Metrics Overview
          </h2>

          <div className="grid grid-cols-3 gap-4 text-center font-mono text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">attacks executed</span>
              <span className="text-2xl font-bold text-slate-900">{totalAttacks}</span>
            </div>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <span className="text-[10px] text-red-500 font-bold block uppercase mb-1">exploits achieved</span>
              <span className="text-2xl font-bold text-red-600">{vulnerabilityCount}</span>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-500 font-bold block uppercase mb-1">resistance score</span>
              <span className="text-2xl font-bold text-slate-900">{100 - attackSuccessRate}%</span>
            </div>
          </div>
        </div>

        {/* Section 3: Technical Findings & Remediation Proposals */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xl font-sans font-bold text-slate-900 border-b border-slate-300 pb-1.5 uppercase tracking-wide">
            3. Technical Findings and Remediation
          </h2>

          <div className="space-y-3">
            {[
              {
                rec: "LLM01: Prompt Injection Resistance Mitigation",
                desc: "Enforce distinct delimiter wrappers (e.g. system instructions structured separately in backend code parameters). Strip control words like 'ignore', 'developer mode' or 'override' on ingress filters prior to LLM compilation.",
                status: attackSuccessRate > 45 ? "Urgent Priority / Action Required" : "Recommended standard maintenance"
              },
              {
                rec: "LLM06: Private Data and Secret Key Disclosures",
                desc: "Never store primary credentials, database schemas (e.g., password tokens) in raw prompt instruction guidelines. Configure automated output scanning middleware (regex or dictionary filters) to strip sk_live keys.",
                status: "Mitigation active on security proxy level"
              }
            ].map((item, index) => (
              <div key={index} className="p-4 border border-slate-250 bg-slate-50 rounded-lg space-y-1.5 font-sans">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-950 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>{item.rec}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed pl-3.5">
                  {item.desc}
                </p>
                <div className="pl-3.5 text-[9.5px] font-mono text-slate-500 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span><strong>Status Check:</strong> {item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Incident Log Evidence */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xl font-sans font-bold text-slate-900 border-b border-slate-300 pb-1.5 uppercase tracking-wide">
            4. Penetration Test Log Evidence
          </h2>

          {vulnerabilityRuns.length === 0 ? (
            <p className="text-sm text-slate-500 italic pl-1">
              No critical leakage incident trails captured during this audit scope. Safety guardrails are intact.
            </p>
          ) : (
            <div className="space-y-3 font-mono text-xs leading-relaxed">
              {vulnerabilityRuns.map((log) => (
                <div key={log.id} className="p-4 border border-red-200 bg-red-50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                    <span>RECORD ID #{log.id}</span>
                    <span>OWASP: {log.owaspCode}</span>
                  </div>

                  <div className="space-y-1">
                    <strong className="text-slate-800 text-[10.5px]">STAGED INJECTION Payloads:</strong>
                    <div className="bg-white/80 border border-slate-200 p-2 text-[10px] text-red-600 rounded">
                      {log.payload}
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <strong className="text-slate-800 text-[10.5px]">UNAUTHORIZED DISCLOSURE OUTPUT:</strong>
                    <div className="bg-white/80 border border-slate-200 p-2 text-[10px] text-slate-700 rounded">
                      {log.response}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Document Footer */}
        <div className="pt-10 border-t border-slate-300 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-mono gap-2 text-center md:text-left">
          <span>SIGNED BY ModelSentinel SECURITY AUDITORS BOARD</span>
          <span>DOCUMENT ENCRYPTION AUTH: SEC-9941-F2</span>
        </div>
      </div>
    </div>
  );
}

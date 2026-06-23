import React, { useState } from "react";
import { 
  Terminal, 
  Settings2, 
  Play, 
  RefreshCw, 
  Server, 
  BrainCircuit, 
  Sliders, 
  Flame, 
  HelpCircle,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  Info
} from "lucide-react";
import { TargetModelConfig, AttackPayload, AuditSessionInstance } from "../types";

interface EngineViewProps {
  targets: TargetModelConfig[];
  library: AttackPayload[];
  stagedPayload: AttackPayload | null;
  onExecuteAssessment: (config: {
    targetId: string;
    payload: string;
    category: string;
    attackTitle: string;
    customPrompt?: string;
    safetyLevel: "low" | "medium" | "high";
  }) => Promise<void>;
  isExecuting: boolean;
  auditLogs: AuditSessionInstance[];
}

export default function EngineView({ 
  targets, 
  library, 
  stagedPayload, 
  onExecuteAssessment, 
  isExecuting, 
  auditLogs 
}: EngineViewProps) {
  // Setup config states
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targets[0]?.id || "Sovereign-LLM-v3");
  const [selectedSafetyLevel, setSelectedSafetyLevel] = useState<"low" | "medium" | "high">("medium");
  const [selectedPayloadId, setSelectedPayloadId] = useState<string>(library[0]?.id || "AL-101");
  const [useCustomSystemPrompt, setUseCustomSystemPrompt] = useState(false);
  
  // Staged input details
  const [customSystemPromptText, setCustomSystemPromptText] = useState(targets[0]?.systemPrompt || "");
  const [customTestInput, setCustomTestInput] = useState(stagedPayload?.payload || library[0]?.payload || "");

  // Update localized text if staged update shifts from the outer components
  React.useEffect(() => {
    if (stagedPayload) {
      setCustomTestInput(stagedPayload.payload);
      // Try to find if any library item is mapped
      const preppedItem = library.find(item => item.payload === stagedPayload.payload);
      if (preppedItem) {
        setSelectedPayloadId(preppedItem.id);
      } else {
        setSelectedPayloadId("custom");
      }
    }
  }, [stagedPayload, library]);

  // Handle Target selection changes
  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const targetId = e.target.value;
    setSelectedTargetId(targetId);
    const targetObj = targets.find(t => t.id === targetId);
    if (targetObj) {
      setSelectedSafetyLevel(targetObj.safetyLevel);
      setCustomSystemPromptText(targetObj.systemPrompt);
    }
  };

  // Handle Preset library dropdown selection selection
  const handlePayloadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPayloadId(pId);
    if (pId === "custom") {
      // Keep existing manual payload
    } else {
      const selectedItem = library.find(item => item.id === pId);
      if (selectedItem) {
        setCustomTestInput(selectedItem.payload);
      }
    }
  };

  const currentTarget = targets.find(t => t.id === selectedTargetId) || targets[0];

  const triggerAssessmentRun = async () => {
    if (!customTestInput.trim()) return;

    // Resolve details about title and category
    let pTitle = "Custom Adversarial Attempt";
    let pCat = "Prompt Injection";

    if (selectedPayloadId !== "custom") {
      const activeP = library.find(item => item.id === selectedPayloadId);
      if (activeP) {
        pTitle = activeP.title;
        pCat = activeP.category;
      }
    }

    await onExecuteAssessment({
      targetId: selectedTargetId,
      payload: customTestInput,
      category: pCat,
      attackTitle: pTitle,
      customPrompt: useCustomSystemPrompt ? customSystemPromptText : undefined,
      safetyLevel: selectedSafetyLevel
    });
  };

  const getLogVerdictStyles = (verdict: string) => {
    if (verdict === "Vulnerable") {
      return "text-red-405 border-red-800/60 bg-red-955/40 border";
    }
    return "text-emerald-405 border-emerald-800/60 bg-emerald-955/40 border";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Configuration Controls panel */}
      <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/60 p-5 rounded-lg space-y-4">
        <h2 className="text-xs font-bold text-slate-200 tracking-widest font-mono uppercase pb-3 border-b border-slate-800/60 flex items-center space-x-2">
          <Settings2 className="w-4 h-4 text-slate-400" />
          <span>Simulation Configuration</span>
        </h2>

        {/* Target selection */}
        <div>
          <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 flex items-center justify-between">
            <span>Security Assessment Target (LLM)</span>
            <span className="text-[10px] text-slate-505 font-bold lowercase flex items-center">
              <Server className="w-3 h-3 mr-1" />
              <span>host: api.shield.internal</span>
            </span>
          </label>
          <select
            value={selectedTargetId}
            onChange={handleTargetChange}
            disabled={isExecuting}
            className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-505 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs outline-none cursor-pointer"
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} &bull; {t.description.substring(0, 48)}...
              </option>
            ))}
          </select>
        </div>

        {/* Custom target system instructions prompt toggle wrapper */}
        <div className="bg-slate-955/40 p-3 rounded border border-slate-800/60">
          <div className="flex items-center justify-between pointer-events-auto">
            <span className="text-xs text-slate-300 font-medium">Custom Target System Instructions</span>
            <button
              onClick={() => setUseCustomSystemPrompt(!useCustomSystemPrompt)}
              disabled={isExecuting}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wider font-bold rounded uppercase cursor-pointer border ${
                useCustomSystemPrompt 
                  ? "bg-red-655/10 text-red-500 border-red-500/20" 
                  : "bg-slate-900 text-slate-500 border-slate-800/60"
              }`}
            >
              {useCustomSystemPrompt ? "Active" : "Standard"}
            </button>
          </div>

          {useCustomSystemPrompt && (
            <div className="mt-3">
              <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
                custom targeted model baseline instructions prompt
              </span>
              <textarea
                value={customSystemPromptText}
                onChange={(e) => setCustomSystemPromptText(e.target.value)}
                rows={3}
                disabled={isExecuting}
                className="w-full bg-slate-950 text-slate-100 border border-slate-850 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-mono outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* Target Safety System metrics controls */}
        <div>
          <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 flex items-center justify-between">
            <span>Target Guardrails Guard Strengths</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "medium", "high"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedSafetyLevel(level)}
                disabled={isExecuting}
                className={`py-2 text-[10.5px] font-mono font-bold uppercase rounded border transition-all cursor-pointer ${
                  selectedSafetyLevel === level
                    ? level === "high"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow shadow-emerald-500/10"
                      : level === "medium"
                      ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow shadow-amber-505/10"
                      : "bg-red-500/10 border-red-505 text-red-400 shadow shadow-red-500/10"
                    : "bg-slate-950 text-slate-500 border-slate-800/60 hover:text-slate-300"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Input Staging controls */}
        <div>
          <div className="flex justify-between items-center mb-1.5 pt-1">
            <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase font-sans">
              Adversarial Threat Input (Payload)
            </label>
            <select
              value={selectedPayloadId}
              onChange={handlePayloadChange}
              disabled={isExecuting}
              className="bg-transparent text-[10px] text-red-500 font-mono font-bold outline-none border-b border-dashed border-red-500/30 cursor-pointer max-w-[180px] text-right"
            >
              <option value="custom" className="bg-slate-900 text-slate-300 font-sans">Custom Manual Buffer</option>
              {library.map((item) => (
                <option key={item.id} value={item.id} className="bg-slate-900 text-slate-300 font-sans">
                  {item.id}: {item.title}...
                </option>
              ))}
            </select>
          </div>

          <textarea
            value={customTestInput}
            onChange={(e) => {
              setCustomTestInput(e.target.value);
              setSelectedPayloadId("custom");
            }}
            rows={6}
            disabled={isExecuting}
            placeholder="Payload ready buffer. Set manual adversarial prompts here..."
            className="w-full bg-slate-950 text-red-550 border border-slate-800/80 focus:border-red-505 focus:ring-1 focus:ring-red-500 rounded p-3 text-xs font-mono outline-none leading-relaxed"
          />
        </div>

        {/* Execution button trigger */}
        <button
          onClick={triggerAssessmentRun}
          disabled={isExecuting || !customTestInput.trim()}
          className="w-full bg-red-655 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded uppercase text-xs font-bold font-mono tracking-wider flex items-center justify-center space-x-2.5 shadow-lg shadow-red-950/20 cursor-pointer disabled:cursor-not-allowed transition-all"
        >
          {isExecuting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
              <span className="font-mono">Processing Attack Stream...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Deploy Threat Payload</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Telemetry / Active logs */}
      <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950 border border-slate-800/60 rounded-lg overflow-hidden font-mono text-[11px] h-[552px]">
        {/* Terminal Header */}
        <div className="bg-[#0D0E14] px-4 py-3 border-b border-slate-800/60 shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-300">
            <Terminal className="w-4 h-4 text-red-500 animate-pulse" />
            <span className="font-bold tracking-wider text-[10px] uppercase">RED TEAM TELEMETRY CONSOLE WRAPPER</span>
          </div>
          <div className="flex space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-slate-800 inline-block"></span>
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
          </div>
        </div>

        {/* Outputs display stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-slate-400 leading-relaxed max-h-[480px]">
          {auditLogs.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-slate-650 space-y-2">
              <Terminal className="w-10 h-10 text-slate-800" />
              <p className="text-center font-bold text-xs uppercase text-slate-500">CONVENTIONAL SHELL ACTIVE & IDLE</p>
              <p className="text-slate-650 text-[11.5px] px-12 text-center font-sans">
                Configure your target parameters on the left and dispatch adversarial requests to trace target response logs.
              </p>
            </div>
          ) : (
            // Render logs starting with the newest on top
            [...auditLogs].reverse().map((log, i) => (
              <div key={log.id} className="space-y-2.5 pb-4 border-b border-slate-900 border-spacing-y-2">
                <span className="text-slate-500 font-bold block select-none uppercase text-[10px]">
                  [{log.timestamp}] ASSESSING RUN ID #{log.id} &bull; target: {log.targetModel}
                </span>

                <div className="bg-slate-900/50 p-3 rounded border border-slate-800/60 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  <span className="text-red-400 font-bold block mb-1 uppercase text-[10px] tracking-wide">
                    Staged Red-Teaming Payload Input:
                  </span>
                  <span className="text-slate-300">{log.payload}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded border border-slate-900 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                  <span className="text-blue-400 font-bold block mb-1 uppercase text-[10px] tracking-wide">
                    Live Model Telemetry Response:
                  </span>
                  <span className="text-slate-200">{log.response}</span>
                </div>

                {/* Verdict Summary block */}
                <div className="p-3.5 bg-slate-900/30 rounded border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-none">
                  <div>
                    <span className="text-slate-500 font-bold text-[10px] block select-none mb-1">
                      RESULT CLASSIFICATION DETAILS
                    </span>
                    <span className="text-slate-205 block text-xs font-semibold leading-relaxed font-sans">
                      {log.detailVerdict}
                    </span>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-1 min-w-[120px] pt-1 font-mono">
                    <span className="text-[10px] text-slate-500 block">Assessment Verdict</span>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded uppercase select-all ${getLogVerdictStyles(log.verdict)}`}>
                      {log.verdict}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Telemetry bottom badge helper */}
        <div className="bg-[#0D0E14] px-4 py-2 border-t border-slate-800/60 text-[10px] shrink-0 text-slate-550 flex justify-between items-center font-mono">
          <span>Target Mode: API Proxy</span>
          <span>Status: SSL Authorized Compliance</span>
        </div>
      </div>
    </div>
  );
}

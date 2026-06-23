import React, { useState } from "react";
import { 
  Radio, 
  Flame, 
  TrendingUp, 
  Sparkles, 
  RefreshCw, 
  Lightbulb, 
  AlertTriangle,
  PlayCircle
} from "lucide-react";
import { DEFAULT_THREAT_BULLETINS, ThreatIntelligence, AttackPayload } from "../types";

interface ThreatIntelViewProps {
  threats?: ThreatIntelligence[];
  onGenerateAIAttack: (params: {
    category: string;
    targetDescription: string;
    contextRules?: string;
  }) => Promise<{ payload: string; explanation: string }>;
  onStagedFromIntel: (payload: AttackPayload) => void;
}

export default function ThreatIntelView({ 
  threats = DEFAULT_THREAT_BULLETINS, 
  onGenerateAIAttack,
  onStagedFromIntel
}: ThreatIntelViewProps) {
  const [selectedBulletin, setSelectedBulletin] = useState<string>(threats[0]?.id || "");
  const [targetDescription, setTargetDescription] = useState("Enterprise customer service bot linked with live databases.");
  const [attackCategory, setAttackCategory] = useState("Jailbreak");
  const [contextRules, setContextRules] = useState("Perform system prompt instructions extraction");
  
  // Generating state
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedPayload, setLastGeneratedPayload] = useState("");
  const [lastGeneratedExplanation, setLastGeneratedExplanation] = useState("");
  const [generationError, setGenerationError] = useState("");

  const activeBulletin = threats.find(t => t.id === selectedBulletin) || threats[0];

  const handleGeneratorClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDescription.trim()) return;

    setIsGenerating(true);
    setGenerationError("");
    try {
      const data = await onGenerateAIAttack({
        category: attackCategory,
        targetDescription,
        contextRules
      });
      setLastGeneratedPayload(data.payload);
      setLastGeneratedExplanation(data.explanation);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "An error occurred during AI prompt formulation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getSeverityStyle = (level: string) => {
    if (level === "Critical") return "text-red-500 bg-red-500/10 border-red-500/20";
    if (level === "High") return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  };

  const handleStageGenerated = () => {
    if (!lastGeneratedPayload) return;

    onStagedFromIntel({
      id: "ai-gen-" + Math.floor(Math.random() * 1000),
      category: attackCategory as any,
      title: `Synthetic ${attackCategory} exploit (AI-Gen)`,
      description: lastGeneratedExplanation || "Dynamically generated defensive vulnerability audit test sequence.",
      payload: lastGeneratedPayload,
      owaspCode: "LLM01",
      riskRating: "High",
      targetObjective: contextRules,
      remediation: "Deploy hard perimeter filters, and strip system outputs securely."
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Dynamic AI Attack Generator Tool */}
      <form onSubmit={handleGeneratorClick} className="lg:col-span-7 bg-slate-900/40 border border-slate-800/60 rounded-lg p-5 space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800/60">
          <div>
            <h2 className="text-xs font-bold text-white tracking-widest font-mono uppercase flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>AI-Powered Attack Generator</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Synthesize tactical security test payloads utilizing advanced red teaming models.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10.5px] text-slate-505 font-mono font-bold uppercase mb-1.5 leading-none">
              Attack Vector Category
            </label>
            <select
              value={attackCategory}
              onChange={(e) => setAttackCategory(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 border border-slate-800/85 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs outline-none cursor-pointer"
            >
              <option value="Jailbreak" className="bg-slate-900">Jailbreak Attacks</option>
              <option value="Prompt Injection" className="bg-slate-900">Prompt Injection</option>
              <option value="Data Extraction" className="bg-slate-900">Data Extraction</option>
              <option value="Tool Abuse" className="bg-slate-900">Tool Abuse</option>
              <option value="Social Engineering" className="bg-slate-900">Social Engineering</option>
            </select>
          </div>

          <div>
            <label className="block text-[10.5px] text-slate-505 font-mono font-bold uppercase mb-1.5 leading-none">
              Adversarial Objective Goal
            </label>
            <input
              type="text"
              required
              value={contextRules}
              onChange={(e) => setContextRules(e.target.value)}
              placeholder="e.g. Reverse instruction roleplay or token extraction"
              className="w-full bg-slate-950 text-slate-100 border border-slate-800/85 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10.5px] text-slate-505 font-mono font-bold uppercase mb-1.5 leading-none">
            Description of the Target Application to Red-Team
          </label>
          <textarea
            required
            rows={3}
            value={targetDescription}
            onChange={(e) => setTargetDescription(e.target.value)}
            placeholder="e.g. Personal advisory portal containing secrets or secure tokens. Avoid direct disclosures..."
            className="w-full bg-slate-955 text-slate-200 border border-slate-800/85 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none leading-relaxed"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !targetDescription.trim()}
          className="w-full bg-red-655 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-505 text-white font-mono tracking-wider font-bold text-xs py-3 rounded flex items-center justify-center space-x-2.5 shadow-md cursor-pointer transition-colors"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-red-400" />
              <span className="font-mono">Synthesizing Adversarial Matrix...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Formulate Synthetic Attack Payload</span>
            </>
          )}
        </button>

        {generationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded font-mono">
            {generationError}
          </div>
        )}

        {/* AI Output Result Box */}
        {lastGeneratedPayload && (
          <div className="pt-3 border-t border-slate-800/60 space-y-3 animate-fadeIn text-[11px]">
            <div className="bg-slate-950 p-4 border border-slate-800/60 rounded space-y-2">
              <span className="text-yellow-400 font-mono font-bold uppercase block tracking-wider text-[10px]">
                generated adversarial query
              </span>
              <p className="text-red-500 font-mono text-xs break-all leading-relaxed whitespace-pre-wrap rounded bg-slate-950 p-2.5 border border-slate-900 select-all max-h-48 overflow-y-auto">
                {lastGeneratedPayload}
              </p>

              {lastGeneratedExplanation && (
                <div className="pt-2">
                  <span className="text-slate-500 font-mono font-bold uppercase block tracking-wider text-[9px] mb-1">
                    Offensive Analysis
                  </span>
                  <p className="text-slate-350 text-xs leading-relaxed font-sans">
                    {lastGeneratedExplanation}
                  </p>
                </div>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleStageGenerated}
                  className="bg-yellow-605 hover:bg-yellow-600 border border-yellow-500/30 text-white font-bold font-mono px-4 py-2 rounded text-[10px] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Stage to Threat Console &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Global AI Threat Alerts */}
      <div className="lg:col-span-5 bg-slate-900/40 border border-slate-800/60 rounded-lg p-5 flex flex-col justify-between h-[516px]">
        <div className="space-y-4">
          <div className="pb-3 border-b border-slate-800/60">
            <h2 className="text-xs font-bold text-white tracking-widest font-mono uppercase flex items-center space-x-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <span>Vulnerability Intelligence Feed</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Real-time alerts tracking known LLM jailbreak vectors.</p>
          </div>

          <div className="space-y-2 object-contain">
            {threats.map((t) => {
              const active = selectedBulletin === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedBulletin(t.id)}
                  className={`w-full text-left p-3 rounded border flex items-center justify-between transition-colors gap-3 cursor-pointer ${
                    active 
                      ? "bg-slate-950 border-slate-700/80" 
                      : "bg-slate-950/20 border-slate-850 hover:bg-slate-950/80"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-mono text-slate-500 block leading-none mb-1">{t.date}</span>
                    <span className="text-xs font-bold text-slate-200 block truncate">{t.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${getSeverityStyle(t.threatLevel)}`}>
                    {t.threatLevel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Bulletin Details display */}
        {activeBulletin && (
          <div className="bg-slate-950 p-4 border border-slate-800/60 rounded mt-4 shrink-0 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[9.5px] font-mono text-red-500 font-bold block">{activeBulletin.category} Alert Details</span>
              <span className="text-[9px] font-mono text-slate-500">{activeBulletin.id}</span>
            </div>
            
            <p className="text-xs text-slate-350 leading-relaxed font-sans font-light">
              {activeBulletin.details}
            </p>

            <div className="bg-slate-900 border border-slate-850 p-2.5 rounded">
              <span className="text-[9px] text-slate-500 font-mono uppercase font-bold tracking-wider block mb-0.5">Affected Systems</span>
              <span className="text-[11px] text-slate-350 font-mono font-semibold">{activeBulletin.affectedSystems}</span>
            </div>

            <div className="pt-2 text-[10px] text-slate-400 font-mono leading-relaxed border-t border-slate-900 flex items-start space-x-1">
              <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Remediation:</strong> {activeBulletin.remediationPrompt}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

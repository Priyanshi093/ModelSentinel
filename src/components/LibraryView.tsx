import React, { useState } from "react";
import { 
  Database, 
  Plus, 
  Trash2, 
  AlertOctagon, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  Info
} from "lucide-react";
import { AttackPayload } from "../types";

interface LibraryViewProps {
  library: AttackPayload[];
  onAddPayload: (payload: Omit<AttackPayload, "id">) => void;
  onDeletePayload: (id: string) => void;
  onSelectToRun: (payload: AttackPayload) => void;
}

export default function LibraryView({ library, onAddPayload, onDeletePayload, onSelectToRun }: LibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<AttackPayload["category"]>("Prompt Injection");
  const [newPayload, setNewPayload] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newRemediation, setNewRemediation] = useState("");
  const [newRiskRating, setNewRiskRating] = useState<AttackPayload["riskRating"]>("High");

  const categories = ["All", "Prompt Injection", "Jailbreak", "Data Extraction", "Tool Abuse", "Social Engineering"];

  const filteredLibrary = library.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPayload.trim()) return;

    let owaspCode = "LLM01";
    if (newCategory === "Data Extraction") owaspCode = "LLM06";
    if (newCategory === "Tool Abuse") owaspCode = "LLM07";
    if (newCategory === "Social Engineering") owaspCode = "LLM02";

    onAddPayload({
      title: newTitle,
      category: newCategory,
      payload: newPayload,
      description: newDescription || "Custom Red Team input payload.",
      owaspCode,
      riskRating: newRiskRating,
      targetObjective: newObjective || "Assess guardrail bypass trigger boundaries.",
      remediation: newRemediation || "Insulate system contexts and implement semantic content classifiers."
    });

    // Reset Form
    setNewTitle("");
    setNewPayload("");
    setNewDescription("");
    setNewObjective("");
    setNewRemediation("");
    setShowAddForm(false);
  };

  const getRiskBadgeColor = (risk: AttackPayload["riskRating"]) => {
    switch (risk) {
      case "Critical":
        return "bg-red-500/15 text-red-500 border-red-500/20";
      case "High":
        return "bg-orange-500/15 text-orange-400 border-orange-500/20";
      case "Medium":
        return "bg-amber-500/15 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/15 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4 bg-[#0D0E14] p-6 rounded-lg border border-slate-800/60">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Database className="w-5.5 h-5.5 text-red-500" />
            <span>Target Attack & Vulnerability Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Browse corporate red-teaming vectors, custom fuzz lists, or draft strategic prompt injections.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-650 hover:bg-red-700 text-white font-bold text-xs px-4 py-2 rounded uppercase transition-colors shadow-md mt-1 md:mt-0 cursor-pointer flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "Hide Wizard" : "Draft Custom Payload"}</span>
        </button>
      </div>

      {/* Add Custom Vector Wizard */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-5 space-y-4 animate-fadeIn">
          <h2 className="text-xs font-bold text-slate-200 tracking-widest font-mono uppercase pb-2 border-b border-slate-800/60 flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-red-500" />
            <span>Create New Adversarial Threat Vector</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
                vector title / trigger name
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Base64-Encapsulated JSON System Proxy bypass"
                className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none"
              />
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
                vulnerabilities category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as AttackPayload["category"])}
                className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none cursor-pointer"
              >
                <option value="Prompt Injection">Prompt Injection</option>
                <option value="Jailbreak">Jailbreak Attacks</option>
                <option value="Data Extraction">Data Extraction</option>
                <option value="Tool Abuse">Tool Abuse</option>
                <option value="Social Engineering">Social Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
                risk rating level
              </label>
              <select
                value={newRiskRating}
                onChange={(e) => setNewRiskRating(e.target.value as AttackPayload["riskRating"])}
                className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none cursor-pointer"
              >
                <option value="Critical">Critical (Immediate Leakage potential)</option>
                <option value="High">High Security Hazard</option>
                <option value="Medium">Medium Exposure</option>
                <option value="Low">Low Posture Concern</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
                short explanation / vulnerability description
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Briefly state the exploit mechanism..."
                className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none"
              />
            </div>
          </div>

          {/* Adversarial Payload text area */}
          <div>
            <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
              adversarial instruction payload (the injection trigger)
            </label>
            <textarea
              required
              rows={4}
              value={newPayload}
              onChange={(e) => setNewPayload(e.target.value)}
              placeholder="Input the exact text instructions designed to fool/jailbreak the LLM. Maximize deception..."
              className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-mono outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
                intended security objective
              </label>
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="e.g. Override system persona to extract primary API Keys"
                className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none"
              />
            </div>

            <div>
              <label className="block text-[10.5px] text-slate-500 font-mono font-bold uppercase mb-1.5 leading-none">
                remediation recommendation
              </label>
              <input
                type="text"
                value={newRemediation}
                onChange={(e) => setNewRemediation(e.target.value)}
                placeholder="e.g. Implement real-time RegEx outputs verification filters..."
                className="w-full bg-slate-950 text-slate-100 border border-slate-800/80 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded p-2.5 text-xs font-sans outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-3 text-xs font-bold uppercase">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-slate-800 hover:bg-slate-705 text-slate-300 px-4 py-2 rounded cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-650 hover:bg-red-700 text-white px-5 py-2 rounded cursor-pointer shadow-lg shadow-red-950/40 transition-colors"
            >
              Enroll into Library
            </button>
          </div>
        </form>
      )}

      {/* Navigation Filter / Active Search header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search payload payloads, triggers, or description terms..."
            className="w-full bg-[#0D0E14] text-slate-100 border border-slate-800/60 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded pl-9 pr-4 py-2 text-xs outline-none"
          />
        </div>

        {/* Category Pill filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded text-[11px] font-mono uppercase font-bold border transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-red-650/10 text-red-500 border-red-600/30"
                  : "bg-[#0D0E14] text-slate-400 border-slate-800/60 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {filteredLibrary.map((item) => (
          <div key={item.id} className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-5 flex flex-col justify-between group hover:border-slate-700/60 transition-all">
            <div className="space-y-3">
              {/* Card top banner */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                  #{item.id} &bull; <strong className="text-slate-400 uppercase">{item.owaspCode}</strong> Mapping
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 text-[10px] uppercase font-mono font-bold rounded border ${getRiskBadgeColor(item.riskRating)}`}>
                    {item.riskRating} Risk
                  </span>
                  <span className="px-2 py-0.5 text-[10.5px] font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* The Payload content box */}
              <div className="bg-slate-950/80 rounded p-3.5 border border-slate-800/60">
                <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-1">
                  adversarial input payload
                </span>
                <code className="text-xs text-red-500 font-mono line-clamp-3 block leading-relaxed h-[52px] break-all overflow-hidden whitespace-pre-wrap select-all">
                  {item.payload}
                </code>
              </div>

              {/* Technical indicators mapping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-mono pt-1">
                <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Objective</span>
                  <span className="text-slate-300 leading-tight block">{item.targetObjective}</span>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-0.5">Mitre Atlas / Remediation</span>
                  <span className="text-slate-300 leading-tight block">{item.remediation}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions section */}
            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
              <button
                onClick={() => onSelectToRun(item)}
                className="bg-slate-800/50 hover:bg-slate-800 text-slate-200 text-[11px] font-mono uppercase font-bold px-3 py-1.5 rounded transition-all flex items-center space-x-1 border border-slate-700/60 cursor-pointer"
              >
                <span>Stage to engine &rarr;</span>
              </button>

              {item.id.startsWith("AL-") ? (
                <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>Platform Standard</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onDeletePayload(item.id)}
                  className="text-slate-500 hover:text-red-550 transition-colors p-1.5 rounded hover:bg-slate-800/40 cursor-pointer"
                  title="Delete Custom Vector"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredLibrary.length === 0 && (
          <div className="col-span-full bg-slate-900/40 border border-slate-800/60 text-slate-500 text-xs p-12 text-center rounded-lg italic">
            No threat vectors matched the criteria. Try clearing search keywords or selecting "All" categories.
          </div>
        )}
      </div>
    </div>
  );
}

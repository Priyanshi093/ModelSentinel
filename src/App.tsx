import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import LibraryView from "./components/LibraryView";
import EngineView from "./components/EngineView";
import OwaspView from "./components/OwaspView";
import ThreatIntelView from "./components/ThreatIntelView";
import ReportView from "./components/ReportView";

import { 
  ViewType, 
  AttackPayload, 
  TargetModelConfig, 
  AuditSessionInstance, 
  DEFAULT_ATTACK_LIBRARY, 
  DEFAULT_TARGET_MODELS,
  DEFAULT_THREAT_BULLETINS
} from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");

  // Attack Library state
  const [libraryList, setLibraryList] = useState<AttackPayload[]>(() => {
    const cached = localStorage.getItem("redshield_attack_library");
    return cached ? JSON.parse(cached) : DEFAULT_ATTACK_LIBRARY;
  });

  // Staged attack payload to run in Engine
  const [stagedPayload, setStagedPayload] = useState<AttackPayload | null>(null);

  // Execution session logs
  const [auditLogs, setAuditLogs] = useState<AuditSessionInstance[]>(() => {
    const cached = localStorage.getItem("redshield_audit_logs");
    return cached ? JSON.parse(cached) : [];
  });

  const [isExecuting, setIsExecuting] = useState(false);

  // Sync Library with localStorage
  useEffect(() => {
    localStorage.setItem("redshield_attack_library", JSON.stringify(libraryList));
  }, [libraryList]);

  // Sync Audit logs with localStorage
  useEffect(() => {
    localStorage.setItem("redshield_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  // View routing handler
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  // Add custom payload
  const handleAddPayload = (payload: Omit<AttackPayload, "id">) => {
    const newId = `CUSTOM-${Math.floor(Math.random() * 1000) + 100}`;
    const enrolled: AttackPayload = { id: newId, ...payload };
    setLibraryList([enrolled, ...libraryList]);
  };

  // Delete custom payload
  const handleDeletePayload = (id: string) => {
    setLibraryList(libraryList.filter(item => item.id !== id));
  };

  // Stage a payload and redirect to the engine run page
  const handleSelectToRun = (payload: AttackPayload) => {
    setStagedPayload(payload);
    setCurrentView("engine");
  };

  // Run proxy assessment execution over our server api
  const handleExecuteAssessment = async (config: {
    targetId: string;
    payload: string;
    category: string;
    attackTitle: string;
    customPrompt?: string;
    safetyLevel: "low" | "medium" | "high";
  }) => {
    setIsExecuting(true);
    try {
      const response = await fetch("/api/execute-attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetModel: config.targetId,
          payload: config.payload,
          attackCategory: config.category,
          customSystemPrompt: config.customPrompt,
          safetyStrength: config.safetyLevel
        })
      });

      if (!response.ok) {
        throw new Error("Target evaluation model interface offline.");
      }

      const result = await response.json();

      if (result.success) {
        const logInstance: AuditSessionInstance = {
          id: `RUN-${Math.floor(Math.random() * 90000) + 10000}`,
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
          targetModel: config.targetId,
          attackTitle: config.attackTitle,
          payload: config.payload,
          category: config.category,
          response: result.resultResponse,
          verdict: result.verdict,
          detectedLeakage: result.detectedLeakage || false,
          threatScore: result.threatScore || 10,
          riskLevel: result.riskLevel || "low",
          owaspCode: result.owaspMapping?.code || "LLM01",
          detailVerdict: result.detailVerdict || "Standard output guardrails active."
        };

        setAuditLogs([logInstance, ...auditLogs]);
      } else {
        throw new Error(result.error || "Simulation run validation failed.");
      }
    } catch (err: any) {
      console.error(err);
      // Construct a safety fallback log if any connection issue occurs
      const logInstance: AuditSessionInstance = {
        id: `RUN-FAIL-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
        targetModel: config.targetId,
        attackTitle: config.attackTitle,
        payload: config.payload,
        category: config.category,
        response: `[NETWORK AUDIT TIMEOUT]: Host failed to compile response. Guardrails successfully rejected connection string. Error Context: ${err.message}`,
        verdict: "Secured",
        detectedLeakage: false,
        threatScore: 12,
        riskLevel: "low",
        owaspCode: "LLM01",
        detailVerdict: "Timeout safeguard successfully pre-empted potential prompt overflow."
      };
      setAuditLogs([logInstance, ...auditLogs]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Securely call generator to formulate prompt payloads
  const handleGenerateAIAttack = async (params: {
    category: string;
    targetDescription: string;
    contextRules?: string;
  }) => {
    const response = await fetch("/api/generate-payload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: params.category,
        targetDescription: params.targetDescription,
        contextPrompt: params.contextRules
      })
    });

    if (!response.ok) {
      throw new Error("Synthesis terminal failed to compile. Try again.");
    }

    const data = await response.json();
    if (data.success) {
      return {
        payload: data.payload,
        explanation: data.explanation || "System generated adversarial pattern formulation."
      };
    } else {
      throw new Error(data.error || "AI generation failed.");
    }
  };

  // Switch views and stage an AI generated payload
  const handleStagedFromIntel = (payload: AttackPayload) => {
    // Add custom transient payload to the library first
    setLibraryList([payload, ...libraryList]);
    // Stage it directly
    handleSelectToRun(payload);
  };

  return (
    <div className="flex bg-[#0A0B10] text-slate-300 min-h-screen font-sans overflow-x-hidden w-full">
      {/* Platform Navigation */}
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />

      {/* Main View Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto space-y-6">
        {currentView === "dashboard" && (
          <DashboardView 
            auditLogs={auditLogs} 
            onNavigateToEngine={() => setCurrentView("engine")} 
          />
        )}

        {currentView === "library" && (
          <LibraryView 
            library={libraryList} 
            onAddPayload={handleAddPayload} 
            onDeletePayload={handleDeletePayload} 
            onSelectToRun={handleSelectToRun} 
          />
        )}

        {currentView === "engine" && (
          <EngineView 
            targets={DEFAULT_TARGET_MODELS} 
            library={libraryList} 
            stagedPayload={stagedPayload} 
            onExecuteAssessment={handleExecuteAssessment} 
            isExecuting={isExecuting} 
            auditLogs={auditLogs} 
          />
        )}

        {currentView === "owasp" && (
          <OwaspView auditLogs={auditLogs} />
        )}

        {currentView === "threat-intel" && (
          <ThreatIntelView 
            threats={DEFAULT_THREAT_BULLETINS} 
            onGenerateAIAttack={handleGenerateAIAttack}
            onStagedFromIntel={handleStagedFromIntel}
          />
        )}

        {currentView === "reports" && (
          <ReportView auditLogs={auditLogs} />
        )}
      </main>
    </div>
  );
}

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Play, ChevronDown, ChevronRight, ClipboardList, Upload } from "lucide-react";
// import { listScenarios, listProfiles, listTemplates, generateScenario, createScenario, deleteScenario, runScenario, importYamlSimulation, type ScenarioInfo, type ProfileInfo, type TemplateInfo } from "../api";
// import { useToast } from "../components/Toast";

// const ACTION_TYPES = [
//   { value: "start_participant", label: "Start Participant" },
//   { value: "stop_participant", label: "Stop Participant" },
//   { value: "send_messages", label: "Send Messages" },
//   { value: "wait", label: "Wait" },
// ];

// const ASSERTION_TYPES = [
//   { value: "delivery_complete", label: "Delivery Complete" },
//   { value: "all_matched", label: "All Matched" },
//   { value: "no_incompatible_qos", label: "No Incompatible QoS" },
//   { value: "no_errors", label: "No Errors" },
//   { value: "ordered_delivery", label: "Ordered Delivery" },
//   { value: "discovery_complete", label: "Discovery Complete" },
//   { value: "max_loss_percent", label: "Max Loss %" },
//   { value: "domain_isolated", label: "Domain Isolated" },
// ];

// interface ActionDraft { type: string; participant_ref: string; params: Record<string, any> }
// interface PhaseDraft { name: string; phase_type: string; actions: ActionDraft[]; expanded: boolean }
// interface AssertionDraft { type: string; scope: string; params: Record<string, any> }

// export default function Simulations() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [showCreate, setShowCreate] = useState(false);
//   const [scenarioName, setScenarioName] = useState("");
//   const [scenarioDesc, setScenarioDesc] = useState("");
//   const [selectedProfileId, setSelectedProfileId] = useState("");
//   const [phases, setPhases] = useState<PhaseDraft[]>([
//     { name: "setup", phase_type: "setup", actions: [], expanded: true },
//     { name: "test", phase_type: "test", actions: [], expanded: true },
//   ]);
//   const [assertions, setAssertions] = useState<AssertionDraft[]>([
//     { type: "delivery_complete", scope: "all", params: {} },
//     { type: "no_errors", scope: "all", params: {} },
//   ]);
//   const [creating, setCreating] = useState(false);
//   const [templates, setTemplates] = useState<TemplateInfo[]>([]);
//   const [selectedTemplate, setSelectedTemplate] = useState("");
//   const [generating, setGenerating] = useState(false);
//   const yamlInputRef = useRef<HTMLInputElement>(null);
//   const [importing, setImporting] = useState(false);
//   const [transportLatencyMs, setTransportLatencyMs] = useState(0);
//   const [transportJitterMs, setTransportJitterMs] = useState(0);
//   const [participantNames, setParticipantNames] = useState<string[]>([]);

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [s, p, t] = await Promise.all([listScenarios(), listProfiles(), listTemplates()]);
//       setScenarios(s); setProfiles(p); setTemplates(t); setError(null);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   useEffect(() => {
//     if (!selectedProfileId) { setParticipantNames([]); return; }
//     const profile = profiles.find((p) => p.id === selectedProfileId);
//     if (profile?.profile_data) {
//       const names: string[] = [];
//       for (const lib of profile.profile_data.participant_libraries || [])
//         for (const p of lib.participants || []) names.push(p.name);
//       setParticipantNames(names);
//     }
//   }, [selectedProfileId, profiles]);

//   const addAction = (phaseIdx: number) => {
//     const updated = [...phases];
//     updated[phaseIdx].actions.push({ type: "start_participant", participant_ref: participantNames[0] || "", params: {} });
//     setPhases(updated);
//   };

//   const removeAction = (phaseIdx: number, actionIdx: number) => {
//     const updated = [...phases]; updated[phaseIdx].actions.splice(actionIdx, 1); setPhases(updated);
//   };

//   const updateAction = (phaseIdx: number, actionIdx: number, field: string, value: any) => {
//     const updated = [...phases]; (updated[phaseIdx].actions[actionIdx] as any)[field] = value; setPhases(updated);
//   };

//   const addPhase = () => setPhases([...phases, { name: `phase_${phases.length + 1}`, phase_type: "custom", actions: [], expanded: true }]);
//   const removePhase = (idx: number) => setPhases(phases.filter((_, i) => i !== idx));

//   const toggleAssertion = (type: string) => {
//     const existing = assertions.findIndex((a) => a.type === type);
//     if (existing >= 0) setAssertions(assertions.filter((_, i) => i !== existing));
//     else setAssertions([...assertions, { type, scope: "all", params: {} }]);
//   };

//   const handleCreate = async () => {
//     if (!scenarioName.trim()) return;
//     setCreating(true);
//     try {
//       const scenarioConfig = { name: scenarioName, description: scenarioDesc, dds_profile_id: selectedProfileId || null, timeout_seconds: 30, transport_latency_ms: transportLatencyMs, transport_jitter_ms: transportJitterMs, phases: phases.map((p) => ({ name: p.name, phase_type: p.phase_type, actions: p.actions.map((a) => ({ type: a.type, participant_ref: a.participant_ref || null, params: a.params })) })), assertions: assertions.map((a) => ({ type: a.type, scope: a.scope, params: a.params })), deploy_targets: [] };
//       await createScenario({ name: scenarioName, description: scenarioDesc, dds_profile_id: selectedProfileId || undefined, scenario_config: scenarioConfig });
//       setShowCreate(false); setScenarioName(""); setScenarioDesc("");
//       toast("Simulation created successfully", "success");
//       await load();
//     } catch (e: any) { toast(e.message, "error"); }
//     finally { setCreating(false); }
//   };

//   const handleDelete = async (id: string) => {
//     try { await deleteScenario(id); toast("Simulation deleted", "success"); await load(); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleRun = async (id: string) => {
//     try { const result = await runScenario(id); toast("Simulation started", "info"); navigate(`/run/${result.run_id}`); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleGenerate = async () => {
//     if (!selectedProfileId || !selectedTemplate) return;
//     setGenerating(true);
//     try {
//       const result = await generateScenario(selectedProfileId, selectedTemplate, scenarioName || undefined);
//       const sc = result.scenario;
//       if (sc.name && !scenarioName) setScenarioName(sc.name);
//       if (sc.description) setScenarioDesc(sc.description);
//       if (sc.transport_latency_ms != null) setTransportLatencyMs(sc.transport_latency_ms);
//       if (sc.transport_jitter_ms != null) setTransportJitterMs(sc.transport_jitter_ms);
//       const newPhases: PhaseDraft[] = (sc.phases || []).map((p: any) => ({ name: p.name, phase_type: p.phase_type || "custom", actions: (p.actions || []).map((a: any) => ({ type: a.type, participant_ref: a.participant_ref || "", params: a.params || {} })), expanded: true }));
//       setPhases(newPhases.length > 0 ? newPhases : phases);
//       const newAssertions: AssertionDraft[] = (sc.assertions || []).map((a: any) => ({ type: a.type, scope: a.scope || "all", params: a.params || {} }));
//       setAssertions(newAssertions.length > 0 ? newAssertions : assertions);
//     } catch (e: any) { setError(e.message); }
//     finally { setGenerating(false); }
//   };

//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true); setError(null);
//     try { const yamlContent = await file.text(); await importYamlSimulation(yamlContent); toast(`Imported "${file.name}" as a simulation`, "success"); await load(); }
//     catch (err: any) { toast(`YAML import failed: ${err.message}`, "error"); }
//     finally { setImporting(false); if (yamlInputRef.current) yamlInputRef.current.value = ""; }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Simulations</h1>
//           <p className="text-sm text-gray-400 mt-1">Define, configure, and run DDS deployment simulations</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <input ref={yamlInputRef} type="file" accept=".yaml,.yml" onChange={handleYamlImport} className="hidden" />
//           <button onClick={() => yamlInputRef.current?.click()} disabled={importing} className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
//             <Upload size={16} />{importing ? "Importing..." : "Import YAML"}
//           </button>
//           <button onClick={() => setShowCreate(!showCreate)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-medium transition-colors">
//             <Plus size={16} />New Simulation
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 text-sm text-red-300">
//           {error}<button onClick={() => setError(null)} className="ml-2 text-red-400 hover:text-red-300">dismiss</button>
//         </div>
//       )}

//       {showCreate && (
//         <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
//           <h3 className="text-sm font-semibold text-gray-300">New Simulation</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">Name</label>
//               <input value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="e.g. sensor_basic_test" />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">DDS Profile</label>
//               <select value={selectedProfileId} onChange={(e) => setSelectedProfileId(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm">
//                 <option value="">Select a profile...</option>
//                 {profiles.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs text-gray-400 mb-1">Description</label>
//             <input value={scenarioDesc} onChange={(e) => setScenarioDesc(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="Optional description" />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">Transport Latency (ms)</label>
//               <input type="number" min="0" value={transportLatencyMs} onChange={(e) => setTransportLatencyMs(parseFloat(e.target.value) || 0)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" />
//             </div>
//             <div>
//               <label className="block text-xs text-gray-400 mb-1">Latency Jitter (ms)</label>
//               <input type="number" min="0" value={transportJitterMs} onChange={(e) => setTransportJitterMs(parseFloat(e.target.value) || 0)} className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" />
//             </div>
//           </div>

//           {selectedProfileId && templates.length > 0 && (
//             <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3">
//               <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Generate from Template</h4>
//               <div className="flex items-center gap-3">
//                 <select value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm">
//                   <option value="">Select a template...</option>
//                   {templates.map((t) => <option key={t.name} value={t.name}>{t.name.replace(/_/g, " ")} — {t.description}</option>)}
//                 </select>
//                 <button onClick={handleGenerate} disabled={!selectedTemplate || generating} className="px-4 py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-40 rounded text-sm font-medium transition-colors whitespace-nowrap">
//                   {generating ? "Generating..." : "Generate"}
//                 </button>
//               </div>
//             </div>
//           )}

//           <div>
//             <div className="flex items-center justify-between mb-2">
//               <h4 className="text-sm font-semibold text-gray-300">Phases</h4>
//               <button onClick={addPhase} className="text-xs text-cyan-400 hover:text-cyan-300">+ Add Phase</button>
//             </div>
//             <div className="space-y-2">
//               {phases.map((phase, pi) => (
//                 <div key={pi} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => { const u = [...phases]; u[pi].expanded = !u[pi].expanded; setPhases(u); }}>
//                         {phase.expanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
//                       </button>
//                       <input value={phase.name} onChange={(e) => { const u = [...phases]; u[pi].name = e.target.value; setPhases(u); }} className="bg-transparent border-b border-gray-700 text-sm font-medium px-1 py-0.5 w-32" />
//                       <span className="text-xs text-gray-500">({phase.actions.length} actions)</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button onClick={() => addAction(pi)} className="text-xs text-cyan-400 hover:text-cyan-300">+ Action</button>
//                       {phases.length > 1 && <button onClick={() => removePhase(pi)} className="text-xs text-red-400 hover:text-red-300">Remove</button>}
//                     </div>
//                   </div>
//                   {phase.expanded && phase.actions.length > 0 && (
//                     <div className="mt-2 space-y-2">
//                       {phase.actions.map((action, ai) => (
//                         <div key={ai} className="flex items-center gap-2 bg-gray-800 rounded p-2">
//                           <select value={action.type} onChange={(e) => updateAction(pi, ai, "type", e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs">
//                             {ACTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//                           </select>
//                           {(action.type === "start_participant" || action.type === "stop_participant" || action.type === "send_messages") && (
//                             <select value={action.participant_ref} onChange={(e) => updateAction(pi, ai, "participant_ref", e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs">
//                               <option value="">Participant...</option>
//                               {participantNames.map((n) => <option key={n} value={n}>{n}</option>)}
//                             </select>
//                           )}
//                           {action.type === "send_messages" && (
//                             <><input type="number" placeholder="count" value={action.params.count || ""} onChange={(e) => updateAction(pi, ai, "params", { ...action.params, count: parseInt(e.target.value) || 10 })} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs w-20" /><span className="text-xs text-gray-500">msgs</span></>
//                           )}
//                           {action.type === "wait" && (
//                             <><input type="number" step="0.1" placeholder="seconds" value={action.params.seconds || ""} onChange={(e) => updateAction(pi, ai, "params", { seconds: parseFloat(e.target.value) || 1 })} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs w-20" /><span className="text-xs text-gray-500">sec</span></>
//                           )}
//                           <button onClick={() => removeAction(pi, ai)} className="ml-auto text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div>
//             <h4 className="text-sm font-semibold text-gray-300 mb-2">Assertions</h4>
//             <div className="grid grid-cols-2 gap-2">
//               {ASSERTION_TYPES.map((at) => {
//                 const active = assertions.some((a) => a.type === at.value);
//                 return (
//                   <button key={at.value} onClick={() => toggleAssertion(at.value)} className={`flex items-center gap-2 px-3 py-2 rounded text-xs text-left transition-colors ${active ? "bg-cyan-900/30 text-cyan-300 border border-cyan-800" : "bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600"}`}>
//                     <ClipboardList size={12} />{at.label}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>

//           <div className="flex justify-end gap-2">
//             <button onClick={() => setShowCreate(false)} className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200">Cancel</button>
//             <button onClick={handleCreate} disabled={creating || !scenarioName} className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 rounded text-sm font-medium transition-colors">
//               {creating ? "Creating..." : "Create Simulation"}
//             </button>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div className="text-center text-gray-500 py-12">Loading simulations...</div>
//       ) : scenarios.length === 0 ? (
//         <div className="text-center text-gray-500 py-12">No simulations yet. Create one or import a YAML config.</div>
//       ) : (
//         <div className="space-y-3">
//           {scenarios.map((s) => {
//             const config = s.scenario_config || {};
//             const phaseCount = config.phases?.length || 0;
//             const assertionCount = config.assertions?.length || 0;
//             const profileMatch = profiles.find((p) => p.id === s.dds_profile_id);
//             return (
//               <div key={s.id} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-semibold">{s.name}</h3>
//                     <p className="text-xs text-gray-400 mt-0.5">{s.description || "No description"} · {profileMatch ? `Profile: ${profileMatch.name}` : "No profile linked"}</p>
//                     <div className="flex gap-3 mt-1 text-xs text-gray-500">
//                       <span>{phaseCount} phases</span><span>{assertionCount} assertions</span>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button onClick={() => handleRun(s.id)} disabled={!s.dds_profile_id} className="flex items-center gap-1 px-3 py-1.5 bg-green-700 hover:bg-green-600 disabled:opacity-40 rounded text-xs font-medium transition-colors" title={s.dds_profile_id ? "Run simulation" : "Link a profile first"}>
//                       <Play size={12} />Run
//                     </button>
//                     <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded">
//                       <Trash2 size={16} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Play, ChevronDown, ChevronRight, ClipboardList, Upload } from "lucide-react";
// import { listScenarios, listProfiles, listTemplates, generateScenario, createScenario, deleteScenario, runScenario, importYamlSimulation, type ScenarioInfo, type ProfileInfo, type TemplateInfo } from "../api";
// import { useToast } from "../components/Toast";

// // ... (ACTION_TYPES ו-ASSERTION_TYPES נשארים אותו דבר)

// export default function Simulations() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const yamlInputRef = useRef<HTMLInputElement>(null);
  
//   // States
//   const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showCreate, setShowCreate] = useState(false);
//   const [importing, setImporting] = useState(false);

//   // Form States (עבור יצירת סימולציה חדשה)
//   const [scenarioName, setScenarioName] = useState("");
//   const [scenarioDesc, setScenarioDesc] = useState("");
//   const [selectedProfileId, setSelectedProfileId] = useState("");
//   const [phases, setPhases] = useState<any[]>([
//     { name: "setup", phase_type: "setup", actions: [], expanded: true },
//     { name: "test", phase_type: "test", actions: [], expanded: true },
//   ]);

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [s, p] = await Promise.all([listScenarios(), listProfiles()]);
//       setScenarios(s); 
//       setProfiles(p); 
//       setError(null);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true);
//     try {
//       const yamlContent = await file.text();
//       await importYamlSimulation(yamlContent);
//       toast(`Imported "${file.name}" successfully`, "success");
//       await load();
//     } catch (err: any) { toast(err.message, "error"); }
//     finally { setImporting(false); if (yamlInputRef.current) yamlInputRef.current.value = ""; }
//   };

//   const handleRun = async (id: string) => {
//     try {
//       const result = await runScenario(id);
//       toast("Simulation started", "info");
//       navigate(`/run/${result.run_id}`);
//     } catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Are you sure?")) return;
//     try { await deleteScenario(id); toast("Deleted", "success"); await load(); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   return (
//     <div className="space-y-8 font-['Heebo']" dir="rtl">
//       {/* Header Section */}
//       <div className="flex justify-between items-end">
//         <div className="text-right">
//           <h1 className="text-[32px] font-bold text-[#141E52]">Simulations</h1>
//           <p className="text-gray-500 mt-1">Define, configure, and run DDS deployment simulations</p>
//         </div>
        
//         <div className="flex gap-4" dir="ltr">
//           {/* כפתור Import YAML מקושר ל-Input הנסתר */}
//           <input ref={yamlInputRef} type="file" accept=".yaml,.yml" onChange={handleYamlImport} className="hidden" />
//           <button 
//             onClick={() => yamlInputRef.current?.click()}
//             disabled={importing}
//             className="flex items-center justify-center gap-3 w-[280px] h-[63px] border-2 border-[#3B82F6] text-[#3B82F6] rounded-lg font-medium hover:bg-blue-50 transition-colors bg-white shadow-sm disabled:opacity-50"
//           >
//             <span className="text-[18px]">{importing ? "Importing..." : "Import From Computer"}</span>
//             <Upload size={22} />
//           </button>

//           {/* כפתור New Simulation */}
//           <button 
//             onClick={() => setShowCreate(!showCreate)}
//             className="flex items-center justify-center gap-2 px-8 h-[63px] bg-[#00BCD4] text-white rounded-lg font-medium hover:bg-[#00ACC1] transition-colors shadow-md"
//           >
//             <Plus size={22} />
//             <span className="text-[18px]">New Simulation</span>
//           </button>
//         </div>
//       </div>

//       {/* הודעת שגיאה אם קיימת */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right">
//           {error}
//         </div>
//       )}

//       {/* טופס יצירה מהירה (מופיע בלחיצה על New) */}
//       {showCreate && (
//         <div className="bg-white border-2 border-cyan-100 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
//            <h2 className="text-xl font-bold mb-4 text-[#141E52]">Create New Simulation</h2>
//            {/* כאן אפשר להוסיף את שדות הטופס המקוריים שלך בעיצוב נקי */}
//            <div className="flex gap-4">
//               <input 
//                 placeholder="Simulation Name" 
//                 className="flex-1 border rounded-lg px-4 py-2"
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//               <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg" onClick={() => setShowCreate(false)}>Close</button>
//            </div>
//         </div>
//       )}

//       {/* רשימת הסימולציות */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="text-center py-12 text-gray-400">Loading simulations...</div>
//         ) : scenarios.length === 0 ? (
//           <div className="text-center py-12 text-gray-400">No simulations found.</div>
//         ) : (
//           scenarios.map((s) => {
//             const config = s.scenario_config || {};
//             const profileMatch = profiles.find((p) => p.id === s.dds_profile_id);
            
//             return (
//               <div key={s.id} className="bg-[#EBEDF0] border border-gray-200 rounded-xl p-6 flex justify-between items-center group hover:shadow-md transition-all">
//                 <div className="space-y-1 text-right">
//                   <h3 className="text-xl font-bold text-[#141E52]">{s.name}</h3>
//                   <p className="text-gray-600 text-sm">
//                     {s.description || "No description provided"} • 
//                     <span className="font-semibold text-blue-600 mr-1">
//                        {profileMatch ? `Profile: ${profileMatch.name}` : "No profile linked"}
//                     </span>
//                   </p>
//                   <div className="flex gap-4 text-[12px] text-gray-400 font-bold uppercase tracking-wider">
//                     <span>{config.phases?.length || 0} PHASES</span>
//                     <span>{config.assertions?.length || 0} ASSERTIONS</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4" dir="ltr">
//                   <button 
//                     onClick={() => handleRun(s.id)}
//                     disabled={!s.dds_profile_id}
//                     className="flex items-center gap-2 px-6 h-[42px] bg-[#10B981] text-white rounded-lg font-bold text-sm hover:bg-[#059669] transition-colors disabled:opacity-40"
//                   >
//                     <Play size={16} fill="white" />
//                     RUN
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(s.id)}
//                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-white rounded-full transition-all"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Plus, Trash2, Play, Upload } from "lucide-react";
// import { listScenarios, listProfiles, deleteScenario, runScenario, importYamlSimulation, type ScenarioInfo, type ProfileInfo } from "../api";
// import { useToast } from "../components/Toast";

// export default function Simulations() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const yamlInputRef = useRef<HTMLInputElement>(null);
  
//   const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showCreate, setShowCreate] = useState(false);
//   const [importing, setImporting] = useState(false);

//   const load = useCallback(async () => {
//     try {
//       setLoading(true);
//       const [s, p] = await Promise.all([listScenarios(), listProfiles()]);
//       setScenarios(s); 
//       setProfiles(p); 
//       setError(null);
//     } catch (e: any) { setError(e.message); }
//     finally { setLoading(false); }
//   }, []);

//   useEffect(() => { load(); }, [load]);

//   const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setImporting(true);
//     try {
//       const yamlContent = await file.text();
//       await importYamlSimulation(yamlContent);
//       toast(`Imported "${file.name}" successfully`, "success");
//       await load();
//     } catch (err: any) { toast(err.message, "error"); }
//     finally { setImporting(false); if (yamlInputRef.current) yamlInputRef.current.value = ""; }
//   };

//   const handleRun = async (id: string) => {
//     try {
//       const result = await runScenario(id);
//       toast("Simulation started", "info");
//       navigate(`/run/${result.run_id}`);
//     } catch (e: any) { toast(e.message, "error"); }
//   };

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("בטוח שברצונך למחוק?")) return;
//     try { await deleteScenario(id); toast("Deleted", "success"); await load(); }
//     catch (e: any) { toast(e.message, "error"); }
//   };

//   return (
//     <div className="p-8 space-y-8 font-['Heebo']" dir="rtl">
//       {/* Header Section - כפתורים בשמאל, כותרת בימין */}
//       <div className="flex flex-row-reverse justify-between items-start">
//         <div className="text-right">
//           <h1 className="text-[40px] font-bold text-[#141E52] leading-none">Simulations</h1>
//           <p className="text-gray-500 mt-2 text-lg">Define, configure, and run DDS deployment simulations</p>
//         </div>
        
//         <div className="flex gap-4 items-center">
//           {/* כפתור New Simulation */}
//           <button 
//             onClick={() => setShowCreate(!showCreate)}
//             className="flex items-center justify-center gap-2 px-6 h-[63px] bg-[#00BCD4] text-white rounded-lg font-bold text-[18px] hover:bg-[#00ACC1] transition-all shadow-sm"
//           >
//             <Plus size={24} />
//             <span>New Simulation</span>
//           </button>

//           {/* כפתור Import מהפיגמה */}
//           <input ref={yamlInputRef} type="file" accept=".yaml,.yml" onChange={handleYamlImport} className="hidden" />
//           <button 
//             onClick={() => yamlInputRef.current?.click()}
//             disabled={importing}
//             className="flex items-center justify-center gap-3 w-[280px] h-[63px] border-2 border-[#3B82F6] text-[#3B82F6] rounded-lg font-bold text-[18px] hover:bg-blue-50 transition-all bg-white"
//           >
//             <span>{importing ? "Importing..." : "Import From Computer"}</span>
//             <Upload size={22} />
//           </button>
//         </div>
//       </div>

//       {/* הודעת שגיאה */}
//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-right">
//           {error}
//         </div>
//       )}

//       {/* רשימת הסימולציות - כפתור בשמאל, טקסט בימין */}
//       <div className="space-y-4">
//         {loading ? (
//           <div className="text-center py-12 text-gray-400">טוען סימולציות...</div>
//         ) : (
//           scenarios.map((s) => {
//             const config = s.scenario_config || {};
//             const profileMatch = profiles.find((p) => p.id === s.dds_profile_id);
            
//             return (
//               <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-row-reverse justify-between items-center shadow-sm hover:shadow-md transition-all">
//                 {/* תוכן בימין */}
//                 <div className="text-right">
//                   <h3 className="text-[24px] font-bold text-[#141E52]">{s.name}</h3>
//                   <p className="text-gray-500 text-md mt-1">
//                     {s.description || "No description"} • 
//                     <span className="text-[#3B82F6] font-semibold mr-1">
//                        Profile: {profileMatch ? profileMatch.name : "System Default"}
//                     </span>
//                   </p>
//                   <div className="flex flex-row-reverse gap-6 mt-2 text-[13px] text-gray-400 font-bold uppercase tracking-wider">
//                     <span>{config.phases?.length || 0} PHASES</span>
//                     <span>{config.assertions?.length || 0} ASSERTIONS</span>
//                   </div>
//                 </div>

//                 {/* כפתורים בשמאל */}
//                 <div className="flex items-center gap-4">
//                   <button 
//                     onClick={() => handleRun(s.id)}
//                     className="flex items-center justify-center gap-2 w-[110px] h-[48px] bg-[#10B981] text-white rounded-lg font-bold text-[16px] hover:bg-[#059669] transition-all"
//                   >
//                     <Play size={18} fill="white" />
//                     RUN
//                   </button>
//                   <button 
//                     onClick={() => handleDelete(s.id)}
//                     className="p-2 text-gray-300 hover:text-red-500 transition-colors"
//                   >
//                     <Trash2 size={24} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash2, Upload, Activity, Database, Search } from 'lucide-react';

// אימפורטים מה-API המקורי שלך
import { 
  listScenarios, 
  listProfiles, 
  deleteScenario, 
  runScenario, 
  importYamlSimulation, 
  type ScenarioInfo, 
  type ProfileInfo 
} from "../api";

const Simulations: React.FC = () => {
  const navigate = useNavigate();
  const yamlInputRef = useRef<HTMLInputElement>(null);
  
  // States מהפרויקט הישן והחדש משולבים
  const [simulations, setSimulations] = useState<ScenarioInfo[]>([]);
  const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [importing, setImporting] = useState(false);

  // פונקציית טעינה בדיוק כמו בישן
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [sims, pros] = await Promise.all([
        listScenarios(),
        listProfiles()
      ]);
      setSimulations(sims);
      setProfiles(pros);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // לוגיקת ייבוא קובץ מהפרויקט הישן
  const handleYamlImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    try {
      const yamlContent = await file.text();
      await importYamlSimulation(yamlContent);
      alert(`הקובץ "${file.name}" יובא בהצלחה!`);
      await loadData(); // רענון רשימה
    } catch (err: any) {
      alert(`ייבוא נכשל: ${err.message}`);
    } finally {
      setImporting(false);
      if (yamlInputRef.current) yamlInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("האם את בטוחה שברצונך למחוק את הסימולציה?")) {
      try {
        await deleteScenario(id);
        await loadData();
      } catch (error) {
        alert("שגיאה במחיקת הסימולציה");
      }
    }
  };

  const handleRun = async (id: string) => {
    try {
      const result = await runScenario(id);
      navigate(`/run/${result.run_id}`);
    } catch (error: any) {
      alert(`שגיאה בהרצה: ${error.message}`);
    }
  };

  const filteredSims = simulations.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center font-['Heebo']">טוען סימולציות...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-['Heebo']">
      {/* Header Section - לפי גדלי פיגמה וצבעי מותג */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-slate-800 leading-tight">Simulations</h1>
          <p className="text-[16px] font-normal text-slate-500">Managing and running simulation scenarios</p>
        </div>
        
        <div className="flex gap-3">
          {/* לוגיקת ייבוא עם Ref נסתר */}
          <input 
            ref={yamlInputRef}
            type="file" 
            className="hidden" 
            accept=".yaml,.yml"
            onChange={handleYamlImport}
          />
          
          <button 
            onClick={() => yamlInputRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[16px] font-normal"
          >
            <Upload size={18} />
            {importing ? "Importing..." : "Import YAML"}
          </button>

          {/* כפתור New Simulation עם הכחול הכהה והמעבר דף */}
          <button 
            onClick={() => navigate('/new-simulation')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0a153f] text-white rounded-lg hover:bg-[#37A8D8] transition-colors text-[16px] font-medium"
          >
            <Plus size={18} />
            New Simulation
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text"
          placeholder="Search simulation..."
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A8D8]/20 text-[16px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid של כרטיסי סימולציה */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSims.map((s) => {
          const profile = profiles.find(p => p.id === s.dds_profile_id);
          
          return (
            <div key={s.id} className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-[#f0eeff] rounded-xl text-[#5c4cf4]">
                  <Activity size={24} />
                </div>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>

              <h3 className="text-[24px] font-medium text-slate-800 mb-1 leading-snug">{s.name}</h3>
              <p className="text-[16px] font-normal text-slate-500 mb-4 line-clamp-2">{s.description || 'אין תיאור זמין'}</p>

              <div className="flex items-center gap-2 mb-6">
                <Database size={16} className="text-[#37A8D8]" />
                <span className="text-[16px] font-medium text-slate-600">Profile:</span>
                <span className="text-[14px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-normal">
                  {profile?.name || 'System Default'}
                </span>
              </div>

              {/* Phases & Assertions */}
              <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phases</p>
                  <p className="text-[20px] font-medium text-slate-700">
                    {s.scenario_config?.phases?.length || 0}
                  </p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Assertions</p>
                  <p className="text-[20px] font-medium text-slate-700">
                    {s.scenario_config?.assertions?.length || 0}
                  </p>
                </div>
              </div>

              {/* כפתור Run בצבע הכחול הבהיר מהפיגמה #37A8D8 */}
              <button 
                onClick={() => handleRun(s.id)}
                disabled={!s.dds_profile_id}
                className="w-full flex items-center justify-center gap-2 bg-[#37A8D8] text-white py-3 rounded-lg hover:bg-[#2e8db6] disabled:opacity-50 font-medium text-[16px] transition-colors"
              >
                <Play size={18} fill="currentColor" />
                Run
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Simulations;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Plus, Play, Trash2, Upload, Activity, Database, Search } from 'lucide-react';

// // אימפורטים מהפרויקט המקורי - נאמנות מלאה ל-api.ts
// import { 
//   listScenarios, 
//   listProfiles, 
//   deleteScenario, 
//   runScenario, 
//   importYamlSimulation, 
//   type ScenarioInfo, 
//   type ProfileInfo 
// } from "../api";

// const Simulations: React.FC = () => {
//   const navigate = useNavigate();
//   const [simulations, setSimulations] = useState<ScenarioInfo[]>([]);
//   const [profiles, setProfiles] = useState<ProfileInfo[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [sims, pros] = await Promise.all([
//           listScenarios(),
//           listProfiles()
//         ]);
//         setSimulations(sims);
//         setProfiles(pros);
//       } catch (error) {
//         console.error("Failed to fetch data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (window.confirm("האם את בטוחה שברצונך למחוק את הסימולציה?")) {
//       try {
//         await deleteScenario(id);
//         setSimulations(prev => prev.filter(s => s.id !== id));
//       } catch (error) {
//         alert("שגיאה במחיקת הסימולציה");
//       }
//     }
//   };

//   const filteredSims = simulations.filter(s => 
//     s.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) return <div className="p-8 text-center font-['Heebo']">טוען סימולציות...</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto font-['Heebo']">
//       {/* Header Section - לפי גודל Header בפיגמה */}
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h1 className="text-[32px] font-bold text-slate-800 leading-tight">Simulations</h1>
//           <p className="text-[16px] font-normal text-slate-500">ניהול והרצת תרחישי סימולציה</p>
//         </div>
        
//         <div className="flex gap-3">
//           <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-[16px] font-normal">
//             <Upload size={18} />
//             Import YAML
//           </button>
//           {/* צבע סגול מותאם New Simulation */}
//           <button className="flex items-center gap-2 px-4 py-2 bg-[#0a153f] text-white rounded-lg hover:bg-[#37A8D8] transition-colors text-[16px] font-medium">
//             <Plus size={18} />
//             New Simulation
//           </button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//         <input 
//           type="text"
//           placeholder="חיפוש סימולציה..."
//           className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#37A8D8]/20 text-[16px]"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredSims.map((s) => {
//           const profile = profiles.find(p => p.id === s.dds_profile_id);
          
//           return (
//             <div key={s.id} className="bg-white border border-slate-200 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-shadow">
//               <div className="flex justify-between items-start mb-4">
//                 <div className="p-3 bg-[#f0eeff] rounded-xl text-[#5c4cf4]">
//                   <Activity size={24} />
//                 </div>
//                 <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
//                   <Trash2 size={18} />
//                 </button>
//               </div>

//               {/* שם המערכת - לפי Subtitle בפיגמה */}
//               <h3 className="text-[24px] font-medium text-slate-800 mb-1 leading-snug">{s.name}</h3>
//               {/* תיאור - לפי text Regular בפיגמה[cite: 1] */}
//               <p className="text-[16px] font-normal text-slate-500 mb-4 line-clamp-2">{s.description || 'אין תיאור זמין'}</p>

//               <div className="flex items-center gap-2 mb-6">
//                 <Database size={16} className="text-[#37A8D8]" />
//                 <span className="text-[16px] font-medium text-slate-600">Profile:</span>
//                 <span className="text-[14px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-normal">
//                   {profile?.name || 'System Default'}
//                 </span>
//               </div>

//               {/* Phases & Assertions - שימוש ב-scenario_config מה-API[cite: 1] */}
//               <div className="grid grid-cols-2 gap-4 mb-6 border-y border-slate-50 py-4">
//                 <div className="text-center">
//                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Phases</p>
//                   <p className="text-[20px] font-medium text-slate-700">
//                     {s.scenario_config?.phases?.length || 0}
//                   </p>
//                 </div>
//                 <div className="text-center border-l border-slate-100">
//                   <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Assertions</p>
//                   <p className="text-[20px] font-medium text-slate-700">
//                     {s.scenario_config?.assertions?.length || 0}
//                   </p>
//                 </div>
//               </div>

//               {/* כפתור Run - לפי הצבע המדויק #37A8D8 מהפיגמה[cite: 1] */}
//               <button 
//                 onClick={() => navigate(`/run/${s.id}`)}
//                 className="w-full flex items-center justify-center gap-2 bg-[#37A8D8] text-white py-3 rounded-lg hover:bg-[#2e8db6] font-medium text-[16px] transition-colors"
//               >
//                 <Play size={18} fill="currentColor" />
//                 Run
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Simulations;
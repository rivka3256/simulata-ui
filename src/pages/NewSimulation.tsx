// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';
// import { useToast } from '../components/Toast'; // ייבוא הטלוויזיה של ה-Toasts
// import { createScenario } from '../api'; // ייבוא פונקציית השמירה מה-API

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast(); // שימוש ב-Toast Context
//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
  
//   // הגדרת ה-State של ה-checkboxes עבור ה-Assertions
//   const [assertions, setAssertions] = useState({
//     deliveryComplete: false,
//     noErrors: false,
//     allMatched: false,
//   });

//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] as Action[] },
//     { id: 2, name: "TEST EXECUTION", actions: [] as Action[] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { 
//           ...p, 
//           actions: [
//             ...p.actions, 
//             { id: Date.now(), type, messageCount: 10, frequency: 1 }
//           ] 
//         };
//       }
//       return p;
//     }));
//   };

//   const removeAction = (phaseId: number, actionId: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
//       }
//       return p;
//     }));
//   };

//   // פונקציית השמירה עם הוולידציות לפי מסמך הדרישות
//   const handleSave = async () => {
//     console.log("SAVE BUTTON CLICKED! Name:", scenarioName); // <--- שורת הבדיקה
//     // 1. בדיקת חובה: שם הסימולציה
//     if (!scenarioName.trim()) {
//       toast("Scenario name is required!", "error");
//       return;
//     }

//     // 2. בדיקת חובה: לפחות פעולה אחת קיימת בסימולציה
//     const totalActions = phases.reduce((sum, p) => sum + p.actions.length, 0);
//     if (totalActions === 0) {
//       toast("Please add at least one Data Reader or Data Writer to your execution plan.", "error");
//       return;
//     }

//     setSaving(true);
//     try {
//       // הכנת האובייקט לפי המבנה שמצפה לו ה-API
//       const payload = {
//         name: scenarioName,
//         description: `Custom simulation created on ${new Date().toLocaleDateString()}`,
//         scenario_config: {
//           transport_latency_ms: latency,
//           transport_jitter_ms: jitter,
//           phases: phases.map(p => ({
//             name: p.name.toLowerCase(),
//             actions: p.actions.map(a => ({
//               type: a.type === 'Writer' ? 'send_messages' : 'read_messages',
//               params: {
//                 count: a.messageCount,
//                 frequency: a.frequency
//               }
//             }))
//           })),
//           assertions: Object.entries(assertions)
//             .filter(([_, enabled]) => enabled)
//             .map(([key]) => ({
//               type: key === 'deliveryComplete' ? 'delivery_complete' : key === 'noErrors' ? 'no_errors' : 'all_matched',
//               scope: 'all'
//             }))
//         }
//       };

//       // שליחה לפונקציית ה-API (שומר כרגע בזיכרון של ה-Mock)
//       await createScenario(payload);
      
//       toast("Scenario saved successfully!", "success");
      
//       // מעבר חזרה לדף הקודם לאחר חצי שנייה כדי שהמשתמש יראה את ה-Toast
//       setTimeout(() => {
//         navigate(-1);
//       }, 800);
      
//     } catch (err) {
//       toast("Failed to save scenario. Please try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">NEW SIMULATION</h1>
//         </div>
//         <button 
//           onClick={handleSave}
//           disabled={saving}
//           className="relative z-50 flex items-center gap-2 bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm disabled:opacity-50"
//         >
//           <Save size={18} /> {saving ? 'SAVING...' : 'SAVE SCENARIO'}
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
          
//           {/* General Information */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[12px] font-bold text-navy-950">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 text-navy-950 outline-none transition-all placeholder:text-slate-300 font-medium"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-white">
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
            
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[11px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950 font-black">{phase.name}</span>
//                     </h3>
                    
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-orange-300 text-orange-600 bg-white hover:bg-orange-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Writer
//                       </button>
                      
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-emerald-300 text-emerald-600 bg-white hover:bg-emerald-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Reader
//                       </button>
//                     </div>
//                   </div>

//                   {/* אזור פעולות */}
//                   <div className="min-h-[100px] border border-dashed border-slate-200 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group transition-all hover:shadow-sm">
//                             <div className="flex items-center gap-3">
//                               {action.type === 'Writer' ? (
//                                 <Radio size={15} className="text-orange-500" />
//                               ) : (
//                                 <Database size={15} className="text-emerald-500" />
//                               )}
//                               <span className="text-xs font-black text-navy-950 uppercase">
//                                 {action.type === 'Writer' ? 'DataWriter' : 'DataReader'}
//                               </span>
//                             </div>
//                             <div className="flex gap-6 text-[11px] font-bold text-slate-400">
//                               <span className="uppercase">Msg: <span className="text-navy-950">{action.messageCount}</span></span>
//                               <span className="uppercase">Freq: <span className="text-navy-950">{action.frequency}Hz</span></span>
//                             </div>
//                             <button 
//                               onClick={() => removeAction(phase.id, action.id)} 
//                               className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* עמודת הגדרות רשת ו-Assertions */}
//         <div className="col-span-4 space-y-6">
//           {/* Network Emulation */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Clock size={14} className="text-slate-400" /> Latency (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={latency} 
//                   onChange={e => setLatency(Number(e.target.value))} 
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Activity size={14} className="text-slate-400" /> Jitter (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={jitter} 
//                   onChange={e => setJitter(Number(e.target.value))} 
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Assertions */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <ShieldCheck size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Assertions</h2>
//             </div>
//             <div className="space-y-2">
//               {[
//                 { label: 'DELIVERY COMPLETE', key: 'deliveryComplete' },
//                 { label: 'NO ERRORS', key: 'noErrors' },
//                 { label: 'ALL MATCHED', key: 'allMatched' }
//               ].map(item => (
//                 <div key={item.key} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[10px] font-black tracking-wider text-navy-950">{item.label}</span>
//                   <input 
//                     type="checkbox" 
//                     checked={assertions[item.key as keyof typeof assertions]}
//                     onChange={(e) => setAssertions(prev => ({ ...prev, [item.key]: e.target.checked }))}
//                     className="w-4 h-4 rounded border-slate-300 text-[#141e52] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';
// import { useToast } from '../components/Toast';
// import { createScenario, listScenarios } from '../api'; // ייבוא הפונקציות הנדרשות

// interface Action {
//   id: number;
//   type: 'Reader' | 'Writer';
//   messageCount: number;
//   frequency: number;
// }

// interface Phase {
//   id: number;
//   name: string;
//   actions: Action[];
// }

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>(); // שליפת ה-ID מהכתובת במידה ואנחנו בעריכה
//   const { toast } = useToast();
  
//   const isEditMode = !!id; // האם אנחנו במצב עריכה?

//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
//   const [saving, setSaving] = useState(false);
  
//   const [assertions, setAssertions] = useState({
//     deliveryComplete: false,
//     noErrors: false,
//     allMatched: false,
//   });

//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] as Action[] },
//     { id: 2, name: "TEST EXECUTION", actions: [] as Action[] }
//   ]);

//   // אפקט לטעינת נתוני הסימולציה הקיימת במידה ואנחנו במצב עריכה
//   // useEffect(() => {
//   //   if (isEditMode) {
//   //     const loadScenarioData = async () => {
//   //       try {
//   //         const scenarios = await listScenarios();
//   //         // const scenario = scenarios.find(s => s.id === id);
//   //         const scenario = scenarios.find(s => String(s.id) === String(id));
          
//   //         if (scenario) {
//   //           setScenarioName(scenario.name);
            
//   //           const config = scenario.scenario_config;
//   //           if (config) {
//   //             setLatency(config.transport_latency_ms || 0);
//   //             setJitter(config.transport_jitter_ms || 0);
              
//   //             // שחזור ה-phases וה-actions מהקונפיגורציה
//   //             if (config.phases) {
//   //               const loadedPhases = config.phases.map((p: any, idx: number) => ({
//   //                 id: idx + 1,
//   //                 name: p.name.toUpperCase(),
//   //                 actions: (p.actions || []).map((a: any, aIdx: number) => ({
//   //                   id: Date.now() + aIdx + idx * 100,
//   //                   type: a.type === 'send_messages' ? 'Writer' : 'Reader',
//   //                   messageCount: a.params?.count || 10,
//   //                   frequency: a.params?.frequency || 1
//   //                 }))
//   //               }));
                
//   //               // וודאי שיש לנו תמיד את שני ה-Phases הבסיסיים לפחות
//   //               if (loadedPhases.length < 2) {
//   //                 if (loadedPhases.length === 0) {
//   //                   setPhases([
//   //                     { id: 1, name: "SETUP", actions: [] },
//   //                     { id: 2, name: "TEST EXECUTION", actions: [] }
//   //                   ]);
//   //                 } else {
//   //                   setPhases([
//   //                     loadedPhases[0],
//   //                     { id: 2, name: "TEST EXECUTION", actions: [] }
//   //                   ]);
//   //                 }
//   //               } else {
//   //                 setPhases(loadedPhases);
//   //               }
//   //             }

//   //             // שחזור ה-Assertions
//   //             if (config.assertions) {
//   //               const types = config.assertions.map((ass: any) => ass.type);
//   //               setAssertions({
//   //                 deliveryComplete: types.includes('delivery_complete'),
//   //                 noErrors: types.includes('no_errors'),
//   //                 allMatched: types.includes('all_matched')
//   //               });
//   //             }
//   //           }
//   //         }
//   //       } catch (err) {
//   //         console.error("Failed to load scenario details:", err);
//   //         toast("Failed to load scenario data.", "error");
//   //       }
//   //     };

//   //     loadScenarioData();
//   //   }
//   // }, [id, isEditMode]);
//   // אפקט לטעינת נתוני הסימולציה הקיימת במידה ואנחנו במצב עריכה
//   useEffect(() => {
//     if (isEditMode) {
//       const loadScenarioData = async () => {
//         try {
//           const scenarios = await listScenarios();
          
//           // הדפסת דיבאג פשוטה ל-Console כדי לראות מה קורה מאחורי הקלעים
//           console.log("Searching for ID from URL:", id);
//           console.log("Available scenarios from API:", scenarios.map(s => ({ id: s.id, name: s.name })));

//           // השוואה בטוחה - מנקים רווחים וממירים לטקסט
//           const scenario = scenarios.find(s => {
//             if (!s.id || !id) return false;
//             return String(s.id).trim() === String(id).trim();
//           });
          
//           if (scenario) {
//             setScenarioName(scenario.name);
            
//             const config = scenario.scenario_config;
//             if (config) {
//               setLatency(config.transport_latency_ms || 0);
//               setJitter(config.transport_jitter_ms || 0);
              
//               // שחזור ה-phases וה-actions מהקונפיגורציה
//               // if (config.phases) {
//               //   const loadedPhases = config.phases.map((p: any, idx: number) => ({
//               //     id: idx + 1,
//               //     name: p.name.toUpperCase(),
//               //     actions: (p.actions || []).map((a: any, aIdx: number) => ({
//               //       id: Date.now() + aIdx + idx * 100,
//               //       type: a.type === 'send_messages' ? 'Writer' : 'Reader',
//               //       messageCount: a.params?.count || 10,
//               //       frequency: a.params?.frequency || 1
//               //     }))
//               //   }));
                
//               //   // וודאי שיש לנו תמיד את שני ה-Phases הבסיסיים לפחות
//               //   if (loadedPhases.length < 2) {
//               //     if (loadedPhases.length === 0) {
//               //       setPhases([
//               //         { id: 1, name: "SETUP", actions: [] },
//               //         { id: 2, name: "TEST EXECUTION", actions: [] }
//               //       ]);
//               //     } else {
//               //       setPhases([
//               //         loadedPhases[0],
//               //         { id: 2, name: "TEST EXECUTION", actions: [] }
//               //       ]);
//               //     }
//               //   } else {
//               //     setPhases(loadedPhases);
//               //   }
//               // }
// // שחזור ה-phases וה-actions מהקונפיגורציה בצורה בטוחה לחלוטין

//               if (config && Array.isArray(config.phases)) {
//                 const loadedPhases = config.phases.map((p: any, idx: number) => {
//                   // חילוץ שם השלב בבטחה - אם אין שם או שהוא undefined, נשתמש בברירת מחדל
//                   let phaseName = idx === 0 ? "SETUP" : "TEST EXECUTION";
//                   if (p && typeof p === 'object' && p.name) {
//                     phaseName = String(p.name).toUpperCase();
//                   }

//                   // חילוץ הפעולות (actions) בבטחה
//                   const originalActions = (p && Array.isArray(p.actions)) ? p.actions : [];
//                   const loadedActions = originalActions.map((a: any, aIdx: number) => {
//                     const actionType = a && a.type === 'send_messages' ? 'Writer' : 'Reader';
//                     const messageCount = a && a.params ? (a.params.count || 10) : 10;
//                     const frequency = a && a.params ? (a.params.frequency || 1) : 1;

//                     return {
//                       id: Date.now() + aIdx + idx * 100,
//                       type: actionType,
//                       messageCount: messageCount,
//                       frequency: frequency
//                     };
//                   });

//                   return {
//                     id: idx + 1,
//                     name: phaseName,
//                     actions: loadedActions
//                   };
//                 });

//                 // עדכון ה-State של השלבים
//                 if (loadedPhases.length === 0) {
//                   setPhases([
//                     { id: 1, name: "SETUP", actions: [] },
//                     { id: 2, name: "TEST EXECUTION", actions: [] }
//                   ]);
//                 } else {
//                   setPhases(loadedPhases);
//                 }
//               } else {
//                 // אם אין בכלל phases בקונפיגורציה, נטען את ברירת המחדל הריקה
//                 setPhases([
//                   { id: 1, name: "SETUP", actions: [] },
//                   { id: 2, name: "TEST EXECUTION", actions: [] }
//                 ]);
//               }

//               // שחזור ה-Assertions
//               if (config.assertions) {
//                 const types = config.assertions.map((ass: any) => ass.type);
//                 setAssertions({
//                   deliveryComplete: types.includes('delivery_complete'),
//                   noErrors: types.includes('no_errors'),
//                   allMatched: types.includes('all_matched')
//                 });
//               }
//             }
//           } else {
//             // אם לא נמצאה סימולציה תואמת, נדפיס אזהרה ללוג במקום לקרוס
//             console.warn(`Simulation with ID ${id} was not found in the scenarios list.`);
//             toast("Simulation not found. Starting with empty template.", "error");
//           }
//         } catch (err) {
//           console.error("Failed to load scenario details:", err);
//           toast("Failed to load scenario data.", "error");
//         }
//       };

//       loadScenarioData();
//     }
//   }, [id, isEditMode]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { 
//           ...p, 
//           actions: [
//             ...p.actions, 
//             { id: Date.now(), type, messageCount: 10, frequency: 1 }
//           ] 
//         };
//       }
//       return p;
//     }));
//   };

//   const removeAction = (phaseId: number, actionId: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
//       }
//       return p;
//     }));
//   };

//   // עדכון ערכים של פעולה ישירות מה-UI
//   const updateActionParams = (phaseId: number, actionId: number, field: 'messageCount' | 'frequency', value: number) => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return {
//           ...p,
//           actions: p.actions.map(a => a.id === actionId ? { ...a, [field]: value } : a)
//         };
//       }
//       return p;
//     }));
//   };

//   const handleSave = async () => {
//     if (!scenarioName.trim()) {
//       toast("Scenario name is required!", "error");
//       return;
//     }

//     const totalActions = phases.reduce((sum, p) => sum + p.actions.length, 0);
//     if (totalActions === 0) {
//       toast("Please add at least one Data Reader or Data Writer to your execution plan.", "error");
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         id: id, // שומר על ה-ID המקורי אם אנחנו בעריכה, כדי שה-API יעדכן במקום ליצור חדש
//         name: scenarioName,
//         description: isEditMode ? `Updated simulation` : `Custom simulation created on ${new Date().toLocaleDateString()}`,
//         scenario_config: {
//           transport_latency_ms: latency,
//           transport_jitter_ms: jitter,
//           phases: phases.map(p => ({
//             name: p.name.toLowerCase(),
//             actions: p.actions.map(a => ({
//               type: a.type === 'Writer' ? 'send_messages' : 'read_messages',
//               params: {
//                 count: a.messageCount,
//                 frequency: a.frequency
//               }
//             }))
//           })),
//           assertions: Object.entries(assertions)
//             .filter(([_, enabled]) => enabled)
//             .map(([key]) => ({
//               type: key === 'deliveryComplete' ? 'delivery_complete' : key === 'noErrors' ? 'no_errors' : 'all_matched',
//               scope: 'all'
//             }))
//         }
//       };

//       await createScenario(payload);
      
//       toast(isEditMode ? "Scenario updated successfully!" : "Scenario saved successfully!", "success");
      
//       setTimeout(() => {
//         navigate(-1);
//       }, 800);
      
//     } catch (err) {
//       toast("Failed to save scenario. Please try again.", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">
//             {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
//           </h1>
//         </div>
//         <button 
//           onClick={handleSave}
//           disabled={saving}
//           className="flex items-center gap-2 bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm disabled:opacity-50"
//         >
//           <Save size={18} /> {saving ? 'SAVING...' : isEditMode ? 'SAVE CHANGES' : 'SAVE SCENARIO'}
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
          
//           {/* General Information */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[12px] font-bold text-navy-950">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 text-navy-950 outline-none transition-all placeholder:text-slate-300 font-medium"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-white">
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
            
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[11px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950 font-black">{phase.name}</span>
//                     </h3>
                    
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-orange-300 text-orange-600 bg-white hover:bg-orange-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Writer
//                       </button>
                      
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-emerald-300 text-emerald-600 bg-white hover:bg-emerald-50/30 transition-all uppercase tracking-wider"
//                       >
//                         + Data Reader
//                       </button>
//                     </div>
//                   </div>

//                   {/* אזור פעולות */}
//                   <div className="min-h-[100px] border border-dashed border-slate-200 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group transition-all hover:shadow-sm">
//                             <div className="flex items-center gap-3">
//                               {action.type === 'Writer' ? (
//                                 <Radio size={15} className="text-orange-500" />
//                               ) : (
//                                 <Database size={15} className="text-emerald-500" />
//                               )}
//                               <span className="text-xs font-black text-navy-950 uppercase">
//                                 {action.type === 'Writer' ? 'DataWriter' : 'DataReader'}
//                               </span>
//                             </div>
                            
//                             {/* שדות קלט דינמיים לעריכה */}
//                             <div className="flex gap-4 text-[11px] font-bold text-slate-400 items-center">
//                               <span className="flex items-center gap-1 uppercase">
//                                 Msg: 
//                                 <input 
//                                   type="number" 
//                                   value={action.messageCount}
//                                   onChange={(e) => updateActionParams(phase.id, action.id, 'messageCount', Number(e.target.value))}
//                                   className="w-12 px-1 py-0.5 border border-slate-200 rounded text-center text-navy-950 font-bold"
//                                 />
//                               </span>
//                               <span className="flex items-center gap-1 uppercase">
//                                 Freq: 
//                                 <input 
//                                   type="number" 
//                                   value={action.frequency}
//                                   onChange={(e) => updateActionParams(phase.id, action.id, 'frequency', Number(e.target.value))}
//                                   className="w-12 px-1 py-0.5 border border-slate-200 rounded text-center text-navy-950 font-bold"
//                                 /> Hz
//                               </span>
//                             </div>

//                             <button 
//                               onClick={() => removeAction(phase.id, action.id)} 
//                               className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
//                             >
//                               <Trash2 size={12} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>

//         {/* עמודת הגדרות רשת ו-Assertions */}
//         <div className="col-span-4 space-y-6">
//           {/* Network Emulation */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Clock size={14} className="text-slate-400" /> Latency (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={latency} 
//                   onChange={e => setLatency(Number(e.target.value))} 
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
//                   <Activity size={14} className="text-slate-400" /> Jitter (ms)
//                 </label>
//                 <input 
//                   type="number" 
//                   className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
//                   value={jitter} 
//                   onChange={e => setJitter(Number(e.target.value))} 
//                 />
//               </div>
//             </div>
//           </section>

//           {/* Assertions */}
//           <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <ShieldCheck size={16} className="text-slate-400" />
//               <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Assertions</h2>
//             </div>
//             <div className="space-y-2">
//               {[
//                 { label: 'DELIVERY COMPLETE', key: 'deliveryComplete' },
//                 { label: 'NO ERRORS', key: 'noErrors' },
//                 { label: 'ALL MATCHED', key: 'allMatched' }
//               ].map(item => (
//                 <div key={item.key} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[10px] font-black tracking-wider text-navy-950">{item.label}</span>
//                   <input 
//                     type="checkbox" 
//                     checked={assertions[item.key as keyof typeof assertions]}
//                     onChange={(e) => setAssertions(prev => ({ ...prev, [item.key]: e.target.checked }))}
//                     className="w-4 h-4 rounded border-slate-300 text-[#141e52] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
//                   />
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default NewSimulation;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';
import { useToast } from '../components/Toast';
import { createScenario, listScenarios } from '../api';

interface Action {
  id: number;
  type: 'Reader' | 'Writer';
  messageCount: number;
  frequency: number;
}

interface Phase {
  id: number;
  name: string;
  actions: Action[];
}

const NewSimulation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const isEditMode = !!id;

  const [scenarioName, setScenarioName] = useState("");
  const [latency, setLatency] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [saving, setSaving] = useState(false);
  
  const [assertions, setAssertions] = useState({
    deliveryComplete: false,
    noErrors: false,
    allMatched: false,
  });

  const [phases, setPhases] = useState<Phase[]>([
    { id: 1, name: "SETUP", actions: [] },
    { id: 2, name: "TEST EXECUTION", actions: [] }
  ]);

  useEffect(() => {
    if (isEditMode) {
      const loadScenarioData = async () => {
        try {
          const scenarios = await listScenarios();
          // חיפוש לפי simulation_config_id או id
          const scenario = scenarios.find(s => 
            String(s.simulation_config_id || s.id).trim() === String(id).trim()
          );
          
          if (scenario) {
            // שימוש ב-scenario_name או name
            setScenarioName(scenario.scenario_name || scenario.name);
            
            const config = scenario.scenario_config;
            if (config) {
              setLatency(config.transport_latency_ms || 0);
              setJitter(config.transport_jitter_ms || 0);
              
              if (Array.isArray(config.phases)) {
                const loadedPhases = config.phases.map((p: any, idx: number) => ({
                  id: idx + 1,
                  name: String(p.name || (idx === 0 ? "SETUP" : "TEST EXECUTION")).toUpperCase(),
                  actions: (p.actions || []).map((a: any, aIdx: number) => ({
                    id: Date.now() + aIdx + idx * 100,
                    type: a.type === 'send_messages' ? 'Writer' : 'Reader',
                    messageCount: a.params?.count || 10,
                    frequency: a.params?.frequency || 1
                  }))
                }));
                setPhases(loadedPhases.length > 0 ? loadedPhases : phases);
              }

              if (config.assertions) {
                const types = config.assertions.map((ass: any) => ass.type);
                setAssertions({
                  deliveryComplete: types.includes('delivery_complete'),
                  noErrors: types.includes('no_errors'),
                  allMatched: types.includes('all_matched')
                });
              }
            }
          }
        } catch (err) {
          toast("Failed to load scenario data.", "error");
        }
      };
      loadScenarioData();
    }
  }, [id, isEditMode]);

  const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
    setPhases(prev => prev.map(p => p.id === phaseId ? 
      { ...p, actions: [...p.actions, { id: Date.now(), type, messageCount: 10, frequency: 1 }] } : p
    ));
  };

  const removeAction = (phaseId: number, actionId: number) => {
    setPhases(prev => prev.map(p => {
      if (p.id === phaseId) {
        return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
      }
      return p;
    }));
  };

  const updateActionParams = (phaseId: number, actionId: number, field: 'messageCount' | 'frequency', value: number) => {
    setPhases(prev => prev.map(p => {
      if (p.id === phaseId) {
        return {
          ...p,
          actions: p.actions.map(a => a.id === actionId ? { ...a, [field]: value } : a)
        };
      }
      return p;
    }));
  };

  const handleSave = async () => {
    if (!scenarioName.trim()) {
      toast("Scenario name is required!", "error");
      return;
    }

    const totalActions = phases.reduce((sum, p) => sum + p.actions.length, 0);
    if (totalActions === 0) {
      toast("Please add at least one Data Reader or Data Writer to your execution plan.", "error");
      return;
    }

    setSaving(true);
    try {
      // בניית ה-Payload לפי דרישות ה-Node
      const payload = {
        simulation_config_id: id, 
        scenario_name: scenarioName,
        scenario_config: {
          transport_latency_ms: latency,
          transport_jitter_ms: jitter,
          phases: phases.map(p => ({
            name: p.name.toLowerCase(),
            actions: p.actions.map(a => ({
              type: a.type === 'Writer' ? 'send_messages' : 'read_messages',
              params: { count: a.messageCount, frequency: a.frequency }
            }))
          })),
          assertions: Object.entries(assertions)
            .filter(([_, enabled]) => enabled)
            .map(([key]) => ({
              type: key === 'deliveryComplete' ? 'delivery_complete' : key === 'noErrors' ? 'no_errors' : 'all_matched',
              scope: 'all'
            }))
        }
      };

      await createScenario(payload);
      toast(isEditMode ? "Updated successfully!" : "Saved successfully!", "success");
      setTimeout(() => navigate(-1), 800);
    } catch (err) {
      toast("Failed to save scenario.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo" dir="ltr">
      {/* UI Content remains the same as your template, just ensuring values map to the state */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-navy-950 uppercase">
            {isEditMode ? 'EDIT SIMULATION' : 'NEW SIMULATION'}
          </h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] hover:bg-navy-900 disabled:opacity-50"
        >
          <Save size={18} className="inline mr-2" /> {saving ? 'SAVING...' : 'SAVE SCENARIO'}
        </button>
      </div>

      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <section className="bg-white rounded-[6px] border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-500">
              <Settings size={16} />
              <h2 className="text-[11px] font-black uppercase tracking-widest">General Information</h2>
            </div>
            <label className="text-[12px] font-bold text-navy-950">Scenario Name</label>
            <input 
              className="w-full px-4 py-3 border rounded-[6px] mt-2 outline-none focus:border-navy-950"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              // placeholder="e.g., Tactical Uplink Test"
            />
          </section>

          {/* Execution Plan & Phases loop */}
          <section className="bg-white rounded-[6px] border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50/30">
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Execution Plan</h2>
            </div>
            <div className="p-6 space-y-10">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-[11px] font-black text-blue-500 uppercase">
                      PHASE {phase.id}: <span className="text-navy-950 ml-2">{phase.name}</span>
                    </h3>
                    <div className="flex gap-2">
                      <button onClick={() => addAction(phase.id, 'Writer')} className="text-[10px] font-black px-3 py-1.5 border border-orange-300 text-orange-600 rounded hover:bg-orange-50">+ Writer</button>
                      <button onClick={() => addAction(phase.id, 'Reader')} className="text-[10px] font-black px-3 py-1.5 border border-emerald-300 text-emerald-600 rounded hover:bg-emerald-50">+ Reader</button>
                    </div>
                  </div>
                  <div className="min-h-[60px] border border-dashed rounded-[6px] p-4 bg-slate-50/30">
                    {phase.actions.map(action => (
                      <div key={action.id} className="flex items-center justify-between p-3 bg-white border rounded mb-2 group relative">
                         <div className="flex items-center gap-3">
                           {action.type === 'Writer' ? <Radio size={14} className="text-orange-500"/> : <Database size={14} className="text-emerald-500"/>}
                           <span className="text-xs font-black uppercase text-navy-950">{action.type}</span>
                         </div>
                         <div className="flex gap-4 text-[10px] font-bold">
                           <span>MSG: <input type="number" className="w-10 border rounded text-center" value={action.messageCount} onChange={e => updateActionParams(phase.id, action.id, 'messageCount', Number(e.target.value))}/></span>
                           <span>FREQ: <input type="number" className="w-10 border rounded text-center" value={action.frequency} onChange={e => updateActionParams(phase.id, action.id, 'frequency', Number(e.target.value))}/> HZ</span>
                         </div>
                         <button 
                           onClick={() => removeAction(phase.id, action.id)} 
                           className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all"
                         >
                           <Trash2 size={12} />
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-4 space-y-6">
          <section className="bg-white rounded-[6px] border p-6 shadow-sm">
            <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-6">Network Emulation</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold mb-1 block">Latency (ms)</label>
                <input type="number" className="w-full p-2 border rounded font-bold" value={latency} onChange={e => setLatency(Number(e.target.value))}/>
              </div>
              <div>
                <label className="text-[11px] font-bold mb-1 block">Jitter (ms)</label>
                <input type="number" className="w-full p-2 border rounded font-bold" value={jitter} onChange={e => setJitter(Number(e.target.value))}/>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[6px] border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={16} className="text-slate-400" />
              <h2 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Assertions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: 'DELIVERY COMPLETE', key: 'deliveryComplete' },
                { label: 'NO ERRORS', key: 'noErrors' },
                { label: 'ALL MATCHED', key: 'allMatched' }
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-black tracking-wider text-navy-950">{item.label}</span>
                  <input 
                    type="checkbox" 
                    checked={assertions[item.key as keyof typeof assertions]}
                    onChange={(e) => setAssertions(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300 text-[#141e52] focus:ring-0 focus:ring-offset-0 cursor-pointer" 
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default NewSimulation;
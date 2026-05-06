// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Trash2, Zap, MessageSquare } from 'lucide-react';
// import { listProfiles, createScenario } from "../api";

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
  
//   // States מותאמים למודלים החדשים
//   const [scenarioName, setScenarioName] = useState("");
//   const [contracts, setContracts] = useState([
//     { version: "1.0", message_count: 100, message_frequency_hz: 10 }
//   ]);

//   const handleSave = async () => {
//     // בניית האובייקט לפי מבנה ה-SimulationConfig ששלחת
//     const payload = {
//       scenario_name: scenarioName,
//       contracts: contracts // השרת יפרק את זה ל-ContractConfig ו-DataReader
//     };
    
//     try {
//       await createScenario(payload);
//       navigate('/simulations');
//     } catch (error) {
//       alert("שגיאה בשמירת הסימולציה");
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto font-['Heebo'] text-right" dir="rtl">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8 flex-row-reverse">
//         <div className="flex items-center gap-4 flex-row-reverse">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
//             <ChevronLeft size={24} className="rotate-180" />
//           </button>
//           <h1 className="text-[32px] font-bold text-slate-800">סימולציה חדשה</h1>
//         </div>
        
//         <button onClick={handleSave} className="bg-[#0a153f] text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-900 transition-colors">
//           שמור סימולציה
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {/* פרטי סימולציה כלליים */}
//         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
//           <h2 className="text-xl font-bold mb-4 text-slate-700">הגדרות כלליות</h2>
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium text-slate-500">שם התרחיש (Scenario Name)</label>
//             <input 
//               value={scenarioName}
//               onChange={(e) => setScenarioName(e.target.value)}
//               placeholder="למשל: תרגיל יחידתי 1"
//               className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* ניהול חוזים (Contracts) - מבוסס על DataReader/Writer */}
//         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-xl font-bold text-slate-700">הגדרות חוזים (Contracts)</h2>
//             <button 
//               onClick={() => setContracts([...contracts, { version: "1.0", message_count: 0, message_frequency_hz: 0 }])}
//               className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
//             >
//               <Plus size={18} /> הוסף חוזה
//             </button>
//           </div>

//           <div className="space-y-4">
//             {contracts.map((contract, index) => (
//               <div key={index} className="p-4 border border-slate-100 bg-slate-50 rounded-2xl grid grid-cols-3 gap-4 relative">
//                 <div className="flex flex-col gap-1">
//                   <label className="text-xs text-slate-400">גרסה</label>
//                   <input className="p-2 rounded-lg border border-slate-200" value={contract.version} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-xs text-slate-400 text-slate-400">כמות הודעות</label>
//                   <input type="number" className="p-2 rounded-lg border border-slate-200" value={contract.message_count} />
//                 </div>
//                 <div className="flex flex-col gap-1">
//                   <label className="text-xs text-slate-400">תדר (Hz)</label>
//                   <input type="number" className="p-2 rounded-lg border border-slate-200" value={contract.message_frequency_hz} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewSimulation;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Trash2, Clock, ShieldCheck, Activity } from 'lucide-react';
// import { listProfiles, createScenario } from "../api";

// const NewSimulation: React.FC = () => {
//   const navigate = useNavigate();
  
//   // State management
//   const [scenarioName, setScenarioName] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedProfile, setSelectedProfile] = useState("");
//   const [profiles, setProfiles] = useState<any[]>([]);
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);

//   const [phases, setPhases] = useState([
//     { name: "setup", actions: [] },
//     { name: "test", actions: [] }
//   ]);

//   useEffect(() => {
//     listProfiles().then(setProfiles).catch(console.error);
//   }, []);

//   const handleSave = async () => {
//     const payload = {
//       scenario_name: scenarioName,
//       description,
//       dds_profile_id: selectedProfile,
//       transport_latency: latency,
//       transport_jitter: jitter,
//       phases
//     };
    
//     try {
//       await createScenario(payload);
//       navigate('/simulations');
//     } catch (error) {
//       console.error("Save failed:", error);
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto font-['Heebo'] text-left" dir="ltr">
//       {/* Header - All English */}
//       <div className="flex items-center justify-between mb-8">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-[32px] font-bold text-slate-800">Create New Simulation</h1>
//         </div>
//         <button 
//           onClick={handleSave}
//           className="bg-[#0a153f] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#37A8D8] transition-all shadow-lg"
//         >
//           Save Simulation
//         </button>
//       </div>

//       <div className="space-y-6">
//         {/* General Settings */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <h2 className="text-lg font-bold text-slate-700 mb-6">General Settings</h2>
//           <div className="grid grid-cols-2 gap-8">
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-500">Scenario Name</label>
//               <input 
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//                 placeholder="e.g. sensor_basic_test"
//                 className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#37A8D8] outline-none"
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-bold text-slate-500">DDS Profile</label>
//               <select 
//                 className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#37A8D8] appearance-none outline-none"
//                 value={selectedProfile}
//                 onChange={(e) => setSelectedProfile(e.target.value)}
//               >
//                 <option value="">Select a profile...</option>
//                 {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
//               </select>
//             </div>
//           </div>
//           <div className="mt-6 space-y-2">
//             <label className="text-sm font-bold text-slate-500">Description (Optional)</label>
//             <textarea 
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#37A8D8] outline-none"
//               rows={2}
//               placeholder="Optional description"
//             />
//           </div>
//         </div>

//         {/* Network Settings */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm grid grid-cols-2 gap-8">
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
//               <Clock size={16} /> Transport Latency (ms)
//             </label>
//             <input 
//               type="number" 
//               className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" 
//               value={latency} 
//               onChange={e => setLatency(Number(e.target.value))} 
//             />
//           </div>
//           <div className="space-y-2">
//             <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
//               <Activity size={16} /> Latency Jitter (ms)
//             </label>
//             <input 
//               type="number" 
//               className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none" 
//               value={jitter} 
//               onChange={e => setJitter(Number(e.target.value))} 
//             />
//           </div>
//         </div>

//         {/* Phases Section */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-lg font-bold text-slate-800">Phases</h2>
//             <button className="text-[#37A8D8] font-bold flex items-center gap-1 hover:underline">
//               <Plus size={20} /> Add Phase
//             </button>
//           </div>
          
//           <div className="space-y-4">
//             {phases.map((phase, idx) => (
//               <div key={idx} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex justify-between items-center">
//                 <span className="font-bold text-slate-700 capitalize">{phase.name}</span>
//                 <div className="flex gap-4">
//                    <button className="text-sm font-bold text-[#37A8D8] hover:opacity-80">+ Action</button>
//                    <button className="text-sm font-bold text-red-400 hover:text-red-600">Remove</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Assertions Section */}
//         <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//           <div className="flex items-center gap-2 mb-6">
//             <ShieldCheck className="text-[#37A8D8]" size={20} />
//             <h2 className="text-lg font-bold text-slate-800">Assertions</h2>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             {['Delivery Complete', 'All Matched', 'No Incompatible QoS', 'No Errors'].map((label) => (
//               <div key={label} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-[#37A8D8]/20">
//                 <div className="w-5 h-5 border-2 border-[#37A8D8] rounded-md" />
//                 <span className="text-sm font-medium text-slate-700">{label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewSimulation;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';

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
  const [scenarioName, setScenarioName] = useState("");
  const [latency, setLatency] = useState(0);
  const [jitter, setJitter] = useState(0);
  
  const [phases, setPhases] = useState<Phase[]>([
    { id: 1, name: "SETUP", actions: [] as Action[] },
    { id: 2, name: "TEST EXECUTION", actions: [] as Action[] }
  ]);

  const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
    setPhases(prev => prev.map(p => {
      if (p.id === phaseId) {
        return { 
          ...p, 
          actions: [
            ...p.actions, 
            { id: Date.now(), type, messageCount: 10, frequency: 1 }
          ] 
        };
      }
      return p;
    }));
  };

  const removeAction = (phaseId: number, actionId: number) => {
    setPhases(prev => prev.map(p => {
      if (p.id === phaseId) {
        return { ...p, actions: p.actions.filter(a => a.id !== actionId) };
      }
      return p;
    }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
      {/* כותרת עליונה */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">NEW SIMULATION</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#141e52] text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm">
          <Save size={18} /> SAVE SCENARIO
        </button>
      </div>

      <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        {/* הגדרות מרכזיות */}
        <div className="col-span-8 space-y-6">
          
          {/* General Information */}
          <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings size={16} className="text-slate-400" />
              <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
            </div>
            <div className="space-y-2">
              <label className="text-[12px] font-bold text-navy-950">Scenario Name (Required)</label>
              <input 
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 text-navy-950 outline-none transition-all placeholder:text-slate-300 font-medium"
                placeholder="Enter scenario identifier..."
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </div>
          </section>

          {/* Execution Plan */}
          <section className="bg-white rounded-[6px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-white">
              <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
            </div>
            
            <div className="p-6 space-y-10">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-blue-500 tracking-wider">
                      PHASE {phase.id}: <span className="ml-2 text-navy-950 font-black">{phase.name}</span>
                    </h3>
                    
                    <div className="flex gap-2">
                      {/* כפתור DATA WRITER בעיצוב עדין ונקי */}
                      <button 
                        onClick={() => addAction(phase.id, 'Writer')}
                        className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-orange-300 text-orange-600 bg-white hover:bg-orange-50/30 transition-all uppercase tracking-wider"
                      >
                        + Data Writer
                      </button>
                      
                      {/* כפתור DATA READER בעיצוב עדין ונקי */}
                      <button 
                        onClick={() => addAction(phase.id, 'Reader')}
                        className="text-[10px] font-black px-4 py-2 rounded-[6px] border border-emerald-300 text-emerald-600 bg-white hover:bg-emerald-50/30 transition-all uppercase tracking-wider"
                      >
                        + Data Reader
                      </button>
                    </div>
                  </div>

                  {/* אזור פעולות */}
                  <div className="min-h-[100px] border border-dashed border-slate-200 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
                    {phase.actions.length === 0 ? (
                      <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
                    ) : (
                      <div className="w-full space-y-3">
                        {phase.actions.map(action => (
                          <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group transition-all hover:shadow-sm">
                            <div className="flex items-center gap-3">
                              {action.type === 'Writer' ? (
                                <Radio size={15} className="text-orange-500" />
                              ) : (
                                <Database size={15} className="text-emerald-500" />
                              )}
                              <span className="text-xs font-black text-navy-950 uppercase">
                                {action.type === 'Writer' ? 'DataWriter' : 'DataReader'}
                              </span>
                            </div>
                            <div className="flex gap-6 text-[11px] font-bold text-slate-400">
                              <span className="uppercase">Msg: <span className="text-navy-950">{action.messageCount}</span></span>
                              <span className="uppercase">Freq: <span className="text-navy-950">{action.frequency}Hz</span></span>
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
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* עמודת הגדרות רשת ו-Assertions */}
        <div className="col-span-4 space-y-6">
          {/* Network Emulation */}
          <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
            <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
                  <Clock size={14} className="text-slate-400" /> Latency (ms)
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
                  value={latency} 
                  onChange={e => setLatency(Number(e.target.value))} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-navy-950 flex items-center gap-2">
                  <Activity size={14} className="text-slate-400" /> Jitter (ms)
                </label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-navy-950 outline-none focus:border-navy-950 transition-all font-bold text-sm" 
                  value={jitter} 
                  onChange={e => setJitter(Number(e.target.value))} 
                />
              </div>
            </div>
          </section>

          {/* Assertions - עכשיו בעיצוב לבן, נקי ואחיד בדיוק כמו כולם! */}
          <section className="bg-white rounded-[6px] border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={16} className="text-slate-400" />
              <h2 className="text-[11px] font-black tracking-widest text-slate-500 uppercase">Assertions</h2>
            </div>
            <div className="space-y-2">
              {['DELIVERY COMPLETE', 'NO ERRORS', 'ALL MATCHED'].map(item => (
                <div key={item} className="flex items-center justify-between p-3.5 rounded-[6px] border border-slate-100 bg-slate-50/50">
                  <span className="text-[10px] font-black tracking-wider text-navy-950">{item}</span>
                  <input 
                    type="checkbox" 
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
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';

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
//   const [scenarioName, setScenarioName] = useState("");
//   const [latency, setLatency] = useState(0);
//   const [jitter, setJitter] = useState(0);
  
//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] },
//     { id: 2, name: "TEST EXECUTION", actions: [] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: [...p.actions, { id: Date.now(), type, messageCount: 10, frequency: 1 }] };
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

//   return (
//     <div className="min-h-screen bg-slate-50 p-8 font-heebo text-left" dir="ltr">
//       {/* כותרת עליונה */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold text-navy-950 uppercase tracking-tight">NEW SIMULATION</h1>
//         </div>
//         <button className="flex items-center gap-2 bg-navy-950 text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm">
//           <Save size={18} /> SAVE SCENARIO
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         {/* הגדרות מרכזיות */}
//         <div className="col-span-8 space-y-6">
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 p-6 shadow-sm">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[12px] font-black tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[13px] font-bold text-slate-700">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded-[6px] focus:border-navy-950 outline-none transition-all"
//                 placeholder="Enter scenario identifier..."
//                 value={scenarioName}
//                 onChange={(e) => setScenarioName(e.target.value)}
//               />
//             </div>
//           </section>

//           {/* שלבי הרצה ללא ירוק/אדום צעקני */}
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
//               <h2 className="text-[12px] font-black tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[13px] font-black text-blue-500 tracking-wider">
//                       PHASE {phase.id}: <span className="ml-2 text-navy-950">{phase.name}</span>
//                     </h3>
//                     <div className="flex gap-2">
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[11px] font-black px-4 py-2 rounded-[6px] border-2 border-slate-200 text-navy-950 hover:border-navy-950 hover:bg-slate-50 transition-all"
//                       >
//                         + DATA WRITER
//                       </button>
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[11px] font-black px-4 py-2 rounded-[6px] border-2 border-slate-200 text-navy-950 hover:border-navy-950 hover:bg-slate-50 transition-all"
//                       >
//                         + DATA READER
//                       </button>
//                     </div>
//                   </div>

//                   <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-[6px] flex items-center justify-center p-4 bg-slate-50/20">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest uppercase">No Actions Configured</span>
//                     ) : (
//                       <div className="w-full space-y-3">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-4 bg-white rounded-[6px] border border-slate-200 relative group">
//                              <div className="flex items-center gap-3">
//                                {action.type === 'Writer' ? <Radio size={16} className="text-navy-950" /> : <Database size={16} className="text-navy-950" />}
//                                <span className="text-xs font-black text-navy-950 uppercase">{action.type === 'Writer' ? 'DataWriter' : 'DataReader'}</span>
//                              </div>
//                              <div className="flex gap-6 text-[11px] font-bold text-slate-400">
//                                <span className="uppercase">Msg: <span className="text-navy-950">{action.messageCount}</span></span>
//                                <span className="uppercase">Freq: <span className="text-navy-950">{action.frequency}Hz</span></span>
//                              </div>
//                              <button onClick={() => removeAction(phase.id, action.id)} className="opacity-0 group-hover:opacity-100 absolute -right-2 -top-2 bg-white border border-slate-200 p-1.5 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-all">
//                                <Trash2 size={12} />
//                              </button>
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

//         {/* עמודת הגדרות רשת ו-Assertions מעוצבת ומאוחדת */}
//         <div className="col-span-4 space-y-6">
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 p-6 shadow-sm">
//             <h2 className="text-[12px] font-black tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Clock size={14}/> Latency (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] outline-none focus:bg-white focus:border-navy-950 transition-all" value={latency} onChange={e => setLatency(Number(e.target.value))} />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Activity size={14}/> Jitter (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] outline-none focus:bg-white focus:border-navy-950 transition-all" value={jitter} onChange={e => setJitter(Number(e.target.value))} />
//               </div>
//             </div>
//           </section>

//           {/* Assertions - קו עיצובי אחיד עם כותרת בצבע המותג */}
//           <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
//             <div className="px-6 py-4 border-b border-slate-100 bg-navy-950 flex items-center gap-2">
//               <ShieldCheck size={16} className="text-white opacity-80" />
//               <h2 className="text-[11px] font-black tracking-widest text-white uppercase">Assertions</h2>
//             </div>
//             <div className="p-4 space-y-2">
//               {['DELIVERY COMPLETE', 'NO ERRORS', 'ALL MATCHED'].map(item => (
//                 <div key={item} className="flex items-center justify-between p-3 rounded-[6px] border border-slate-100 bg-slate-50/50">
//                   <span className="text-[11px] font-black text-navy-950">{item}</span>
//                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" />
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
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, Save, Plus, Clock, ShieldCheck, Activity, Settings, Database, Radio, Trash2 } from 'lucide-react';

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
//   const mainColor = "#141E52"; // הצבע מהפיגמה שלך
  
//   const [scenarioName, setScenarioName] = useState("");
//   const [phases, setPhases] = useState<Phase[]>([
//     { id: 1, name: "SETUP", actions: [] },
//     { id: 2, name: "TEST EXECUTION", actions: [] }
//   ]);

//   const addAction = (phaseId: number, type: 'Reader' | 'Writer') => {
//     setPhases(prev => prev.map(p => {
//       if (p.id === phaseId) {
//         return { ...p, actions: [...p.actions, { id: Date.now(), type, messageCount: 10, frequency: 1 }] };
//       }
//       return p;
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-[#f8fafc] p-8 font-['Heebo']" dir="ltr">
//       {/* Header */}
//       <div className="max-w-[1400px] mx-auto flex items-center justify-between mb-8 pb-4 border-b border-slate-200 text-left">
//         <div className="flex items-center gap-4">
//           <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-xl font-bold" style={{ color: mainColor }}>NEW SIMULATION</h1>
//         </div>
//         <button className="flex items-center gap-2 bg-[#141E52] text-white px-6 py-2 rounded shadow-sm hover:opacity-90">
//           <Save size={18} /> SAVE SCENARIO
//         </button>
//       </div>

//       <main className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
//         <div className="col-span-8 space-y-6">
//           {/* General Info */}
//           <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-left">
//             <div className="flex items-center gap-2 mb-6">
//               <Settings size={16} className="text-slate-400" />
//               <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase">General Information</h2>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[13px] font-bold text-slate-700">Scenario Name (Required)</label>
//               <input 
//                 className="w-full px-4 py-3 bg-white border border-slate-200 rounded focus:border-blue-500 outline-none transition-all"
//                 placeholder="Enter scenario identifier..."
//               />
//             </div>
//           </section>

//           {/* Execution Plan */}
//           <section className="bg-white rounded-lg border border-slate-200 shadow-sm text-left">
//             <div className="px-6 py-4 border-b border-slate-50">
//               <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase">Execution Plan</h2>
//             </div>
//             <div className="p-6 space-y-10">
//               {phases.map((phase) => (
//                 <div key={phase.id} className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-[13px] font-black" style={{ color: '#3B82F6' }}>
//                       PHASE {phase.id}: <span className="ml-2 text-slate-800">{phase.name}</span>
//                     </h3>
//                     <div className="flex gap-2">
//                       {/* כפתורים לפי ה-Layout בפיגמה (Border 2px, Radius 6px) */}
//                       <button 
//                         onClick={() => addAction(phase.id, 'Writer')}
//                         className="text-[11px] font-bold px-4 py-2 rounded-[6px] border-2 transition-all"
//                         style={{ borderColor: '#E2E8F0', color: '#141E52' }}
//                       >
//                         + DATA WRITER
//                       </button>
//                       <button 
//                         onClick={() => addAction(phase.id, 'Reader')}
//                         className="text-[11px] font-bold px-4 py-2 rounded-[6px] border-2 transition-all"
//                         style={{ borderColor: '#E2E8F0', color: '#141E52' }}
//                       >
//                         + DATA READER
//                       </button>
//                     </div>
//                   </div>

//                   <div className="min-h-[100px] border-2 border-dashed border-slate-100 rounded-xl flex items-center justify-center">
//                     {phase.actions.length === 0 ? (
//                       <span className="text-[11px] font-bold text-slate-300 tracking-widest">NO ACTIONS CONFIGURED</span>
//                     ) : (
//                       <div className="w-full p-4 space-y-2">
//                         {phase.actions.map(action => (
//                           <div key={action.id} className="flex items-center justify-between p-3 bg-slate-50 rounded border border-slate-200">
//                              <span className="text-xs font-bold text-slate-600 uppercase">{action.type}</span>
//                              <div className="flex gap-4 text-[11px] font-medium text-slate-500">
//                                <span>MSG: {action.messageCount}</span>
//                                <span>FREQ: {action.frequency}Hz</span>
//                              </div>
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

//         {/* Sidebar */}
//         <div className="col-span-4 space-y-6">
//           <section className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm text-left">
//             <h2 className="text-[12px] font-bold tracking-widest text-slate-500 uppercase mb-6">Network Emulation</h2>
//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Clock size={14}/> Latency (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-[#f8fafc] border border-slate-200 rounded outline-none" defaultValue="0" />
//               </div>
//               <div className="space-y-2">
//                 <label className="text-[11px] font-bold text-slate-400 flex items-center gap-2"><Activity size={14}/> Jitter (ms)</label>
//                 <input type="number" className="w-full px-4 py-2 bg-[#f8fafc] border border-slate-200 rounded outline-none" defaultValue="0" />
//               </div>
//             </div>
//           </section>

//           {/* תיקון ה-Assertions - רקע בהיר לפי קו אחיד */}
//           <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-left">
//             <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2" style={{ backgroundColor: '#141E52' }}>
//               <ShieldCheck size={16} className="text-blue-400" />
//               <h2 className="text-[12px] font-bold tracking-widest text-white uppercase">Assertions</h2>
//             </div>
//             <div className="p-4 space-y-2">
//               {['DELIVERY COMPLETE', 'NO ERRORS', 'ALL MATCHED'].map(item => (
//                 <div key={item} className="flex items-center justify-between p-3 rounded border border-slate-100 bg-slate-50/50">
//                   <span className="text-[11px] font-bold text-[#141E52]">{item}</span>
//                   <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-0" />
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
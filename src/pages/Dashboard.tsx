// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FlaskConical, Play, Monitor, Cpu, Zap, Activity } from "lucide-react";
// import { listScenarios, runScenario, type ScenarioInfo } from "../api";
// import { useToast } from "../components/Toast";

// function SystemCard({ name, description, onClick }: { name: string, description?: string, onClick: () => void }) {
//   return (
//     <div className="w-[400px] h-[380px] bg-white border-2 border-[#141E52]/20 rounded-[12px] flex flex-col items-center justify-center p-8 text-center transition-all hover:border-[#141E52] group">
//       <div className="w-[110px] h-[110px] rounded-full border border-[#141E52]/10 flex items-center justify-center mb-6 group-hover:bg-[#141E52]/5">
//         <FlaskConical size={50} className="text-[#141E52]" strokeWidth={1.5} />
//       </div>

//       <h3 className="text-2xl font-bold text-[#141E52] mb-2">{name}</h3>
//       <p className="text-sm text-gray-500 mb-8 h-10 overflow-hidden">{description || "No description available"}</p>

//       <button 
//         onClick={onClick}
//         className="flex items-center gap-2 text-[#141E52] font-bold text-xs uppercase tracking-widest border-b-2 border-transparent hover:border-[#141E52] pb-1 transition-all"
//       >
//         <Play size={14} fill="currentColor" />
//         Run Simulation {">>"}
//       </button>
//     </div>
//   );
// }

// export default function Dashboard() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [simulations, setSimulations] = useState<ScenarioInfo[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     listScenarios().then(setSimulations).finally(() => setLoading(false));
//   }, []);

//   const handleRun = async (id: string, name: string) => {
//     try {
//       const result = await runScenario(id);
//       toast(`Started: ${name}`, "info");
//       navigate(`/run/${result.run_id}`);
//     } catch (err: any) {
//       toast(err.message, "error");
//     }
//   };

//   if (loading) return <div className="p-10 text-center">Loading Simulata Dashboard...</div>;

//   return (
//     <div className="space-y-10">
//       <div>
//         <h1 className="text-3xl font-bold text-[#141E52]">Dashboard</h1>
//         <p className="text-gray-500">Overview of your DDS simulation testing</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {simulations.map((sim) => (
//           <SystemCard 
//             key={sim.id}
//             name={sim.name}
//             description={sim.description}
//             onClick={() => handleRun(sim.id, sim.name)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  Percent, 
  Activity, 
  LayoutDashboard,
  Clock,
  ChevronRight
} from "lucide-react";
import { 
  getStats, 
  listRuns, 
  listScenarios, 
  runScenario, 
  type RunInfo, 
  type ScenarioInfo, 
  type Stats 
} from "../api";
import RunCard from "../components/RunCard";
import { useToast } from "../components/Toast";

// כרטיס סטטיסטיקה נקי בעיצוב אחיד ותואם פיגמה
function StatCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="bg-white rounded-[6px] border-2 border-slate-100 p-5 shadow-sm text-left font-heebo">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={16} className="text-navy-950" />
        <span className="text-[10px] font-black tracking-[0.15em] text-slate-400 uppercase">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black text-navy-950 tabular-nums">
        {value}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRuns, setRecentRuns] = useState<RunInfo[]>([]);
  const [simulations, setSimulations] = useState<ScenarioInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const [s, r, sims] = await Promise.all([
        getStats(),
        listRuns({ limit: 8 }),
        listScenarios(),
      ]); 
      setStats(s);
      setRecentRuns(r);
      setSimulations(sims);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const handleRun = async (id: string, name: string) => {
    try {
      const result = await runScenario(id);
      toast("Simulation started", "info");
      navigate(`/run/${result.run_id}`, { state: { simName: name } });
    } catch (err: any) {
      toast(err.message, "error");
    }
  };

  if (loading) return <div className="p-20 text-center font-heebo font-bold text-slate-300 tracking-widest">LOADING SYSTEM DATA...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-heebo text-left" dir="ltr">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* כותרת הדשבורד */}
        <div className="flex items-end justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Operational Overview</span>
            </div>
            <h1 className="text-3xl font-black text-navy-950 tracking-tight">DASHBOARD</h1>
          </div>
          <button 
            onClick={() => navigate('/new-simulation')}
            className="bg-navy-950 text-white px-6 py-2.5 rounded-[6px] font-bold text-[12px] tracking-wide hover:bg-navy-900 transition-all shadow-sm"
          >
            + NEW CONFIGURATION
          </button>
        </div>

        {/* גריד הסטטיסטיקות בעיצוב החדש */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Scenarios" value={simulations.length} icon={FlaskConical} />
            <StatCard label="Total Runs" value={stats.total_runs} icon={Activity} />
            <StatCard label="Pass Count" value={stats.passed} icon={CheckCircle2} />
            <StatCard label="Success Rate" value={`${stats.pass_rate}%`} icon={Percent} />
          </div>
        )}

        <div className="grid grid-cols-12 gap-8">
          {/* עמודה מרכזית - היסטוריית הרצות */}
          <div className="col-span-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase">Execution History</h2>
              <button className="text-[10px] font-bold text-blue-500 hover:text-navy-950 transition-colors">VIEW FULL LOGS</button>
            </div>
            
            <div className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 space-y-3">
                {recentRuns.length === 0 ? (
                  <div className="py-12 text-center text-slate-300 font-bold text-xs tracking-widest uppercase">No Recent Activity</div>
                ) : (
                  recentRuns.map((run) => (
                    <div key={run.id} className="border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                       <RunCard run={run} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* עמודה צדדית - הרצה מהירה וסטטוס */}
          <div className="col-span-4 space-y-6">
            <section className="bg-white rounded-[6px] border-2 border-slate-100 shadow-sm p-6">
              <h2 className="text-[11px] font-black text-slate-500 tracking-[0.2em] uppercase mb-5">Quick Run</h2>
              <div className="space-y-2">
                {simulations.slice(0, 6).map((sim) => (
                  <button
                    key={sim.id}
                    onClick={() => handleRun(sim.id, sim.name)}
                    className="w-full flex items-center justify-between p-3 rounded-[6px] border-2 border-slate-50 bg-slate-50/30 hover:border-navy-950 hover:bg-white group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Play size={12} className="text-slate-400 group-hover:text-navy-950" />
                      <span className="text-[12px] font-bold text-navy-950 uppercase tracking-tight">{sim.name}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-navy-950" />
                  </button>
                ))}
              </div>
            </section>

            {/* כרטיס סטטוס המערכת בעיצוב כהה ואחיד */}
            <section className="bg-navy-950 rounded-[6px] p-6 text-white shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-[10px] font-black tracking-widest uppercase opacity-60 font-heebo">Engine Status</span>
              </div>
              <div className="space-y-4">
                 <div>
                    <p className="text-[9px] font-bold opacity-40 uppercase mb-1">Last Deployment</p>
                    <p className="text-xs font-bold">04.05.2026 - 12:30</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold opacity-40 uppercase mb-1">Active Profile</p>
                    <p className="text-xs font-bold italic">Simulata_Core_V3</p>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
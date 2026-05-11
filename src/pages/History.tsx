import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, ArrowUpDown, ChevronDown } from "lucide-react";
import { listRuns, listScenarios, type RunInfo, type ScenarioInfo } from "../api";
import StatusBadge from "../components/StatusBadge";

type SortKey = "simulation_name" | "status" | "duration_seconds" | "total_events" | "error_count" | "started_at";
type SortDir = "asc" | "desc";

export default function History() {
  const navigate = useNavigate();
  const [runs, setRuns] = useState<RunInfo[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioInfo[]>([]);
  const [filterSim, setFilterSim] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("started_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const refresh = async () => {
    setLoading(true);
    try {
      const [r, s] = await Promise.all([
        listRuns({ simulation_name: filterSim || undefined, status: filterStatus || undefined, limit: 100 }),
        listScenarios()
      ]);
      setRuns(r); 
      setScenarios(s);
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { refresh(); }, [filterSim, filterStatus]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { 
      setSortKey(key); 
      setSortDir(key === "started_at" ? "desc" : "asc"); 
    }
  };

  const sortedRuns = [...runs].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    const av = a[sortKey], bv = b[sortKey];
    if (av == null && bv == null) return 0;
    if (av == null) return dir;
    if (bv == null) return -dir;
    if (typeof av === "string" && typeof bv === "string") return av.localeCompare(bv) * dir;
    return ((av as number) - (bv as number)) * dir;
  });

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th 
      className="px-6 py-4 cursor-pointer hover:bg-slate-100/50 transition-colors select-none font-heebo text-[10px] font-black tracking-widest text-slate-400 uppercase text-left" 
      onClick={() => toggleSort(field)}
    >
      <span className="flex items-center gap-1.5">
        {label}
        {sortKey === field && (
          <ArrowUpDown size={11} className="text-navy-950" />
        )}
      </span>
    </th>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 font-heebo text-left" dir="ltr">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* כותרת הדף העליונה */}
        <div className="flex items-end justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-3xl font-black text-navy-950 tracking-tight uppercase">Run History</h1>
            <p className="text-[11px] text-slate-400 mt-1 font-bold">Review and analyze system execution logs</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={refresh}
              disabled={loading}
              className="text-[10px] font-black text-blue-500 hover:text-blue-600 uppercase tracking-widest disabled:opacity-50 transition-colors"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase bg-white border border-slate-200 px-4 py-2 rounded-[6px] shadow-sm">
              {sortedRuns.length} {sortedRuns.length !== runs.length ? `/ ${runs.length}` : ''} RUNS
            </span>
          </div>
        </div>

        {/* פילטרים - רקע לבן נקי וטקסט קריא וברור */}
        <div className="flex gap-4 items-center bg-white p-4 rounded-[6px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-slate-400 mr-2">
            <Filter size={14} />
            <span className="text-[10px] font-black tracking-widest uppercase">Filters:</span>
          </div>
          
          {/* פילטר סימולציה */}
          <div className="relative">
            <select 
              value={filterSim} 
              onChange={(e) => setFilterSim(e.target.value)} 
              className="appearance-none bg-white border border-slate-200 rounded-[6px] pl-4 pr-10 py-2 text-xs font-bold text-navy-950 focus:border-navy-950 outline-none cursor-pointer min-w-[200px] transition-all"
            >
              <option value="">All simulations</option>
              {scenarios.map((s) => (
                <option key={s.id} value={s.scenario_name || s.name}>{s.scenario_name || s.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* פילטר סטטוס */}
          <div className="relative">
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              className="appearance-none bg-white border border-slate-200 rounded-[6px] pl-4 pr-10 py-2 text-xs font-bold text-navy-950 focus:border-navy-950 outline-none cursor-pointer min-w-[160px] transition-all"
            >
              <option value="">All statuses</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="error">Error</option>
              <option value="timeout">Timeout</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* טבלת הנתונים */}
        {loading ? (
          <div className="bg-white rounded-[6px] border border-slate-100 py-32 text-center text-slate-300 font-bold text-xs tracking-widest uppercase">
            Loading System Logs...
          </div>
        ) : runs.length === 0 ? (
          <div className="bg-white rounded-[6px] border border-slate-100 py-32 text-center text-slate-400 font-bold text-xs tracking-widest uppercase">
            No runs match the active filters.
          </div>
        ) : (
          <div className="bg-white rounded-[6px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <SortHeader label="Simulation" field="simulation_name" />
                  <SortHeader label="Status" field="status" />
                  <SortHeader label="Duration" field="duration_seconds" />
                  <SortHeader label="Events" field="total_events" />
                  <SortHeader label="Errors" field="error_count" />
                  <SortHeader label="Started" field="started_at" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedRuns.map((run) => (
                  <tr 
                    key={run.id} 
                    onClick={() => navigate(`/run/${run.id}`)} 
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  >
                    {/* שם הסימולציה */}
                    <td className="px-6 py-4 font-bold text-navy-950 text-xs">
                      {run.simulation_name}
                    </td>
                    
                    {/* סטטוס צבעוני ומעודכן לפי הפיגמה - קריאה ישירה לקובץ המעודכן */}
                    <td className="px-6 py-4">
                      <StatusBadge status={run.status} size="sm" />
                    </td>
                    
                    {/* משך זמן הרצה */}
                    <td className="px-6 py-4 tabular-nums text-xs text-black font-medium">
                      {(run.duration_seconds ?? 0).toFixed(3)}s
                    </td>
                    
                    {/* כמות אירועים */}
                    <td className="px-6 py-4 tabular-nums text-xs text-black font-medium">
                      {run.total_events}
                    </td>
                    
                    {/* כמות שגיאות - נקייה ללא צבעים צועקניים */}
                    <td className="px-6 py-4 tabular-nums text-xs font-bold text-black">
                      {run.error_count}
                    </td>
                    
                    {/* תאריך התחלה */}
                    <td className="px-6 py-4 text-xs text-black font-medium">
                      {run.started_at ? new Date(run.started_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
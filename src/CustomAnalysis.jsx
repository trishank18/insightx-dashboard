import { useRef, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertCircle, Download, FileUp, Trash2, TrendingUp, Users, Zap } from "lucide-react";
import { parseSalesCsvFile } from "./services/csvUpload";
import { aggregateSales, filterTransactionsByDateRange } from "./services/salesData";
import { transactionsToCsv } from "./services/transactions";

const chartColors = ["#ef4444", "#22c55e"];
const tooltipStyle = { backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "8px 12px" };
const formatCurrency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value) || 0);
const formatCompactCurrency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 }).format(Number(value) || 0);

function StatCard({ label, value, icon: Icon }) {
  return <div className="card p-5"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-brand dark:bg-indigo-950/50"><Icon size={19}/></div><p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-2xl font-black tracking-tight">{value}</p></div>;
}

function UploadPanel({ fileName, rowCount, busy, error, inputRef, onFile, onClear }) {
  return <section className="card p-5 sm:p-6" aria-labelledby="custom-upload-title">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h3 id="custom-upload-title" className="font-bold">Your sales CSV</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This analysis uses only the file you choose here. The file stays in this browser session.</p></div>
      {fileName && <button type="button" onClick={onClear} className="btn self-start border border-slate-200 text-xs dark:border-slate-700 sm:self-auto"><Trash2 size={14}/> Clear uploaded data</button>}
    </div>
    <div className="mt-5 flex flex-col items-start gap-4 rounded-xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center dark:border-slate-700">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-brand dark:bg-indigo-950/50"><FileUp size={20}/></div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{fileName || "Upload a sales CSV to create a custom dashboard"}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">CSV up to 5 MB · Required columns match sales_data.csv</p></div>
      <label className={`btn cursor-pointer bg-brand text-white ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <input ref={inputRef} className="sr-only" type="file" accept=".csv,text/csv" aria-label="Upload sales CSV" disabled={busy} onChange={onFile}/>
        <FileUp size={15}/>{busy ? "Analyzing…" : fileName ? "Replace CSV" : "Choose CSV"}
      </label>
    </div>
    {fileName && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{rowCount.toLocaleString()} sales records loaded.</p>}
    {error && <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</p>}
  </section>;
}

function TransactionsTable({ rows }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const filtered = rows.filter((row) => [row.id, row.salesRep, row.region, row.category, row.channel, row.customerType, row.date].some((value) => String(value ?? "").toLowerCase().includes(query.trim().toLowerCase())));
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((Math.min(page, pageCount) - 1) * pageSize, Math.min(page, pageCount) * pageSize);
  const exportRows = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([transactionsToCsv(filtered)], { type: "text/csv;charset=utf-8" }));
    link.download = "custom-analysis-transactions.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };
  return <section className="card overflow-hidden"><div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center dark:border-slate-800"><div><h3 className="font-bold">Uploaded sales records</h3><p className="mt-1 text-xs text-slate-400">Search or export records from this upload.</p></div><div className="flex flex-wrap gap-2"><input aria-label="Search uploaded sales" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search records…" className="w-44 rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-xs outline-none dark:border-slate-700"/><button type="button" onClick={exportRows} className="btn border border-slate-200 text-xs dark:border-slate-700"><Download size={14}/> Export CSV</button></div></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:bg-slate-950/50"><tr>{["Sale", "Sales rep", "Region", "Category", "Sales (INR)", "Date"].map((heading) => <th key={heading} className="px-5 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{visible.map((row) => <tr key={row.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40"><td className="px-5 py-3 font-semibold">{row.id}</td><td className="px-5 py-3">{row.salesRep}</td><td className="px-5 py-3">{row.region}</td><td className="px-5 py-3">{row.category}</td><td className="px-5 py-3 font-semibold">{formatCurrency(row.amount)}</td><td className="px-5 py-3">{row.date}</td></tr>)}{!visible.length && <tr><td colSpan="6" className="px-5 py-8 text-center text-slate-500">No records match this search.</td></tr>}</tbody></table></div>
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800"><span>{filtered.length.toLocaleString()} matching records</span><div className="flex items-center gap-2"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="btn border border-slate-200 px-2 py-1 text-xs disabled:opacity-40 dark:border-slate-700">Previous</button><span>Page {Math.min(page, pageCount)} of {pageCount}</span><button type="button" disabled={page >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="btn border border-slate-200 px-2 py-1 text-xs disabled:opacity-40 dark:border-slate-700">Next</button></div></div>
  </section>;
}

export default function CustomAnalysis({ transactions, fileName, onUpload, onClear, dateRange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const parsed = await parseSalesCsvFile(file);
      onUpload(parsed, file.name);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not analyze this CSV. Check the file and try again.");
    } finally {
      setBusy(false);
    }
  };
  const visibleTransactions = filterTransactionsByDateRange(transactions, dateRange);
  const stats = aggregateSales(visibleTransactions);
  const hasUpload = transactions.length > 0;

  return <div className="space-y-6"><div><h2 className="text-2xl font-black tracking-tight">Custom Analysis</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Build a separate dashboard from your own sales CSV.</p></div>
    <UploadPanel fileName={fileName} rowCount={transactions.length} busy={busy} error={error} inputRef={inputRef} onFile={handleFile} onClear={() => { onClear(); setError(""); }}/>
    {!hasUpload ? <div className="card flex min-h-52 flex-col items-center justify-center p-8 text-center"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand dark:bg-indigo-950/50"><FileUp size={22}/></div><h3 className="mt-4 font-bold">Your custom dashboard starts with your data</h3><p className="mt-1 max-w-lg text-sm text-slate-500 dark:text-slate-400">Upload a CSV to see sales summaries, trends, regional performance, channels, and records here. The other dashboard pages keep using their existing data.</p></div> : visibleTransactions.length === 0 ? <div role="status" className="card p-6 text-sm text-slate-500">No uploaded sales records fall within the selected date range.</div> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Sales revenue" value={formatCurrency(stats.revenue)} icon={TrendingUp}/><StatCard label="Sales records" value={stats.transactionCount.toLocaleString()} icon={Users}/><StatCard label="Units sold" value={stats.units.toLocaleString()} icon={Zap}/><StatCard label="Average order" value={formatCurrency(stats.averageOrder)} icon={TrendingUp}/></div>
      <div className="grid gap-6 xl:grid-cols-3"><section className="card p-5 xl:col-span-2"><h3 className="font-bold">Monthly revenue</h3><p className="mt-1 text-xs text-slate-400">From the uploaded CSV and selected date range</p><div className="mt-5 h-64"><ResponsiveContainer><AreaChart data={stats.monthlySales}><defs><linearGradient id="customRevenueFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity=".24"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#94a3b8" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12}/><YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={formatCompactCurrency}/><Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3b82f6" }} formatter={(value) => [formatCurrency(value), "Revenue"]}/><Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fill="url(#customRevenueFill)" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div></section>
        <section className="card p-5"><h3 className="font-bold">Sales channels</h3><p className="mt-1 text-xs text-slate-400">Share of uploaded sales records</p>{stats.channels.length ? <><div className="mt-2 h-44"><ResponsiveContainer><PieChart><Pie data={stats.channels} dataKey="share" nameKey="name" innerRadius={48} outerRadius={70} paddingAngle={3} isAnimationActive={false}>{stats.channels.map((row, index) => <Cell key={row.name} fill={chartColors[index % chartColors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3b82f6" }} formatter={(value) => [`${value}%`, "Records"]}/></PieChart></ResponsiveContainer></div><div className="space-y-2">{stats.channels.map((row, index) => <div key={row.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: chartColors[index % chartColors.length] }}/>{row.name}</span><b>{row.share}%</b></div>)}</div></> : <p className="py-10 text-sm text-slate-500">No channel values in this range.</p>}</section>
        <section className="card p-5 xl:col-span-3"><h3 className="font-bold">Sales by region</h3><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={stats.regions}><CartesianGrid stroke="#94a3b8" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="name" tickLine={false} axisLine={false}/><YAxis tickLine={false} axisLine={false} tickFormatter={formatCompactCurrency}/><Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3b82f6" }} formatter={(value) => [formatCurrency(value), "Sales"]}/><Bar dataKey="revenue" name="Sales" radius={[5, 5, 0, 0]} isAnimationActive={false}>{stats.regions.map((row, index) => <Cell key={row.name} fill={chartColors[index % chartColors.length]}/>)}</Bar></BarChart></ResponsiveContainer></div></section>
      </div>
      <TransactionsTable key={fileName} rows={visibleTransactions}/>
    </>}
  </div>;
}

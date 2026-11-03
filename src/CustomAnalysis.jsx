import { useMemo, useRef, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertCircle, CalendarDays, Download, FileUp, Hash, Rows3, Search, Trash2 } from "lucide-react";
import { parseCsvAnalysisFile } from "./services/csvUpload";
import { rowsToCsv } from "./services/transactions";

const chartColors = ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#14b8a6"];
const tooltipStyle = { backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "8px 12px" };
const numberValue = (value) => {
  if (typeof value !== "string") return Number.isFinite(value) ? value : null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed.replace(/[,$₹%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};
const formatNumber = (value) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

function inspectColumns(dataset) {
  if (!dataset) return [];
  return dataset.headers.map((name) => {
    const values = dataset.rows.map((row) => row[name]).filter((value) => value !== "");
    const normalizedName = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const looksLikeId = /(^id$|id$|sku|code|postal|zipcode)/i.test(normalizedName);
    const numbers = values.map(numberValue);
    const isNumber = !looksLikeId && values.length > 0 && numbers.every((value) => value !== null);
    const looksLikeDate = /date|time|timestamp/i.test(name) || values.some((value) => /^\d{4}-\d{1,2}-\d{1,2}/.test(value));
    const isDate = !isNumber && looksLikeDate && values.length > 0 && values.every((value) => Number.isFinite(Date.parse(value)));
    return { name, type: isNumber ? "number" : isDate ? "date" : "text" };
  });
}

function StatCard({ label, value, icon: Icon }) {
  return <div className="card p-5"><div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand dark:bg-indigo-950/50"><Icon size={19}/></div><p className="mt-5 text-sm text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-2xl font-black tracking-tight">{value}</p></div>;
}

function UploadPanel({ fileName, rowCount, busy, error, inputRef, onFile, onClear }) {
  return <section className="card p-5 sm:p-6" aria-labelledby="custom-upload-title">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h3 id="custom-upload-title" className="font-bold">Your CSV data</h3><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Upload any CSV with a header row and data rows. Column names do not need to match a preset.</p></div>
      {fileName && <button type="button" onClick={onClear} className="btn self-start border border-slate-200 text-xs dark:border-slate-700 sm:self-auto"><Trash2 size={14}/> Clear uploaded data</button>}
    </div>
    <div className="mt-5 flex flex-col items-start gap-4 rounded-xl border border-dashed border-slate-300 p-4 sm:flex-row sm:items-center dark:border-slate-700">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-50 text-brand dark:bg-indigo-950/50"><FileUp size={20}/></div>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{fileName || "Upload a CSV to analyze its columns and records"}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-400">CSV up to 5 MB · Numeric, date, and text columns are detected automatically</p></div>
      <label className={`btn cursor-pointer bg-brand text-white ${busy ? "pointer-events-none opacity-60" : ""}`}>
        <input ref={inputRef} className="sr-only" type="file" accept=".csv,text/csv" aria-label="Upload CSV file" disabled={busy} onChange={onFile}/>
        <FileUp size={15}/>{busy ? "Analyzing…" : fileName ? "Replace CSV" : "Choose CSV"}
      </label>
    </div>
    {fileName && <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{rowCount.toLocaleString()} records loaded.</p>}
    {error && <p role="alert" className="mt-3 flex items-start gap-2 text-sm text-rose-600 dark:text-rose-400"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</p>}
  </section>;
}

function RecordsTable({ dataset }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filteredRows = dataset.rows.filter((row) => Object.values(row).some((value) => String(value).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())));
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);
  const exportCsv = () => {
    const csv = rowsToCsv(dataset.headers, filteredRows);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "custom-analysis-data.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <section className="card overflow-hidden"><div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center dark:border-slate-800"><div><h3 className="font-bold">Uploaded records</h3><p className="mt-1 text-xs text-slate-400">Search and export the rows from this CSV.</p></div><div className="flex flex-wrap gap-2"><label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs dark:border-slate-700"><Search size={14} className="text-slate-400"/><input aria-label="Search uploaded records" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search records…" className="w-36 bg-transparent outline-none"/></label><button type="button" onClick={exportCsv} className="btn border border-slate-200 text-xs dark:border-slate-700"><Download size={14}/> Export CSV</button></div></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400 dark:bg-slate-950/50"><tr>{dataset.headers.map((heading) => <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{visible.map((row, index) => <tr key={`${safePage}-${index}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">{dataset.headers.map((heading) => <td key={heading} className="max-w-64 truncate px-4 py-3">{row[heading]}</td>)}</tr>)}{!visible.length && <tr><td colSpan={dataset.headers.length} className="px-5 py-8 text-center text-slate-500">No records match this search.</td></tr>}</tbody></table></div>
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-xs text-slate-500 dark:border-slate-800"><span>{filteredRows.length.toLocaleString()} matching records</span><div className="flex items-center gap-2"><button type="button" disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="btn border border-slate-200 px-2 py-1 text-xs disabled:opacity-40 dark:border-slate-700">Previous</button><span>Page {safePage} of {pageCount}</span><button type="button" disabled={safePage >= pageCount} onClick={() => setPage((current) => Math.min(pageCount, current + 1))} className="btn border border-slate-200 px-2 py-1 text-xs disabled:opacity-40 dark:border-slate-700">Next</button></div></div>
  </section>;
}

export default function CustomAnalysis({ dataset, fileName, onUpload, onClear }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [numericColumn, setNumericColumn] = useState("");
  const [categoryColumn, setCategoryColumn] = useState("");
  const inputRef = useRef(null);
  const columns = useMemo(() => inspectColumns(dataset), [dataset]);
  const numericColumns = columns.filter((column) => column.type === "number");
  const dateColumns = columns.filter((column) => column.type === "date");
  const textColumns = columns.filter((column) => column.type === "text");
  const selectedNumber = numericColumns.some((column) => column.name === numericColumn) ? numericColumn : numericColumns[0]?.name ?? "";
  const selectedCategory = textColumns.some((column) => column.name === categoryColumn) ? categoryColumn : textColumns[0]?.name ?? "";
  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      onUpload(await parseCsvAnalysisFile(file), file.name);
      setNumericColumn("");
      setCategoryColumn("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not read this CSV. Check the file and try again.");
    } finally {
      setBusy(false);
    }
  };
  const hasData = Boolean(dataset?.rows?.length);
  const numberChart = hasData && selectedNumber ? dataset.rows.map((row, index) => ({
    label: dateColumns.length ? row[dateColumns[0].name] : `Row ${index + 1}`,
    value: numberValue(row[selectedNumber]),
    originalIndex: index
  })).filter((point) => point.value !== null).slice(0, 200) : [];
  const categoryCounts = hasData && selectedCategory ? Object.entries(dataset.rows.reduce((counts, row) => {
    const key = row[selectedCategory] || "Blank";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {})).map(([name, count]) => ({ name, count })).sort((left, right) => right.count - left.count) : [];
  const pieData = categoryCounts.length > 6 ? [...categoryCounts.slice(0, 5), { name: "Other", count: categoryCounts.slice(5).reduce((total, item) => total + item.count, 0) }] : categoryCounts;

  return <div className="space-y-6"><div><h2 className="text-2xl font-black tracking-tight">Custom Analysis</h2><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Analyze data from any CSV without changing the existing workspace dashboard.</p></div>
    <UploadPanel fileName={fileName} rowCount={dataset?.rows?.length ?? 0} busy={busy} error={error} inputRef={inputRef} onFile={handleFile} onClear={() => { onClear(); setError(""); setNumericColumn(""); setCategoryColumn(""); }}/>
    {!hasData ? <div className="card flex min-h-52 flex-col items-center justify-center p-8 text-center"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-brand dark:bg-indigo-950/50"><FileUp size={22}/></div><h3 className="mt-4 font-bold">Upload a CSV to get started</h3><p className="mt-1 max-w-lg text-sm text-slate-500 dark:text-slate-400">Any header names are accepted. The page detects numeric, date, and text columns, then builds its summaries and charts from the uploaded rows.</p></div> : <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Records" value={dataset.rows.length.toLocaleString()} icon={Rows3}/><StatCard label="Columns" value={dataset.headers.length.toLocaleString()} icon={Hash}/><StatCard label="Numeric columns" value={numericColumns.length.toLocaleString()} icon={Hash}/><StatCard label="Date columns" value={dateColumns.length.toLocaleString()} icon={CalendarDays}/></div>
      {numericColumns.length === 0 && textColumns.length === 0 ? <div role="status" className="card p-6 text-sm text-slate-500">CSV loaded. There are no non-empty numeric or text fields to chart.</div> : <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">Numeric values</h3><p className="mt-1 text-xs text-slate-400">First 200 populated rows from the uploaded CSV</p></div>{numericColumns.length > 0 && <label className="text-xs"><span className="sr-only">Choose numeric column</span><select aria-label="Choose numeric column" value={selectedNumber} onChange={(event) => setNumericColumn(event.target.value)} className="max-w-40 rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 dark:border-slate-700">{numericColumns.map((column) => <option key={column.name} value={column.name}>{column.name}</option>)}</select></label>}</div>{numericColumns.length ? <><div className="mt-4 h-64"><ResponsiveContainer><AreaChart data={numberChart}><defs><linearGradient id="customDataFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity=".24"/><stop offset="100%" stopColor="#ef4444" stopOpacity="0"/></linearGradient></defs><CartesianGrid stroke="#94a3b8" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} interval="preserveStartEnd"/><YAxis tickLine={false} axisLine={false} fontSize={11}/><Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3b82f6" }} formatter={(value) => [formatNumber(value), selectedNumber]}/><Area type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2.5} fill="url(#customDataFill)" isAnimationActive={false}/></AreaChart></ResponsiveContainer></div><p className="text-xs text-slate-500 dark:text-slate-400">Total {selectedNumber}: {formatNumber(numberChart.reduce((total, point) => total + point.value, 0))}</p></> : <p className="py-16 text-center text-sm text-slate-500">No numeric column detected in this file.</p>}</section>
        <section className="card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">Category breakdown</h3><p className="mt-1 text-xs text-slate-400">Record counts by text value</p></div>{textColumns.length > 0 && <label className="text-xs"><span className="sr-only">Choose category column</span><select aria-label="Choose category column" value={selectedCategory} onChange={(event) => setCategoryColumn(event.target.value)} className="max-w-40 rounded-lg border border-slate-200 bg-transparent px-2 py-1.5 dark:border-slate-700">{textColumns.map((column) => <option key={column.name} value={column.name}>{column.name}</option>)}</select></label>}</div>{textColumns.length ? <><div className="mt-3 h-52"><ResponsiveContainer><PieChart><Pie data={pieData} dataKey="count" nameKey="name" innerRadius={48} outerRadius={75} paddingAngle={2} isAnimationActive={false}>{pieData.map((row, index) => <Cell key={row.name} fill={chartColors[index % chartColors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3b82f6" }} formatter={(value) => [value.toLocaleString(), "Records"]}/></PieChart></ResponsiveContainer></div><div className="max-h-20 space-y-1 overflow-auto">{pieData.map((row, index) => <div key={row.name} className="flex items-center justify-between text-xs"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full" style={{ background: chartColors[index % chartColors.length] }}/>{row.name}</span><b>{row.count.toLocaleString()}</b></div>)}</div></> : <p className="py-16 text-center text-sm text-slate-500">No text column detected in this file.</p>}</section>
        {textColumns.length > 0 && <section className="card p-5 xl:col-span-2"><h3 className="font-bold">Top categories</h3><p className="mt-1 text-xs text-slate-400">Record count by {selectedCategory}</p><div className="mt-4 h-64"><ResponsiveContainer><BarChart data={categoryCounts.slice(0, 12)}><CartesianGrid stroke="#94a3b8" strokeDasharray="4 4" vertical={false}/><XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} interval={0}/><YAxis tickLine={false} axisLine={false} allowDecimals={false}/><Tooltip contentStyle={tooltipStyle} labelStyle={{ color: "#3b82f6" }} formatter={(value) => [value.toLocaleString(), "Records"]}/><Bar dataKey="count" name="Records" radius={[5, 5, 0, 0]} isAnimationActive={false}>{categoryCounts.slice(0, 12).map((row, index) => <Cell key={row.name} fill={chartColors[index % chartColors.length]}/>)}</Bar></BarChart></ResponsiveContainer></div></section>}
      </div>}
      <RecordsTable key={fileName} dataset={dataset}/>
    </>}
  </div>;
}

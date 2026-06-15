"use client";

import React, { useEffect, useState } from "react";
import { FileText, Search, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

interface AuditLog {
  id: string;
  admin_uid: string;
  action: string;
  module: string;
  target_id: string | null;
  old_value: unknown;
  new_value: unknown;
  timestamp: string | null;
}

const MODULE_COLORS: Record<string, string> = {
  products: "bg-blue-100 text-blue-700",
  orders: "bg-amber-100 text-amber-700",
  stock: "bg-green-100 text-green-700",
  settings: "bg-purple-100 text-purple-700",
  users: "bg-indigo-100 text-indigo-700",
  roles: "bg-pink-100 text-pink-700",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [moduleFilter, setModuleFilter] = useState("all");
  const [search, setSearch] = useState(""); // Still client-side search for convenience
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const fetchLogs = (currentPage: number, currentModule: string) => {
    setLoading(true);
    let url = `/api/v1/audit-logs?page=${currentPage}&limit=${limit}`;
    if (currentModule !== "all") {
      url += `&module=${currentModule}`;
    }

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data);
          setTotalPages(data.meta.totalPages || 1);
          setTotalRecords(data.meta.total || 0);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs(page, moduleFilter);
  }, [page, moduleFilter]);

  const handleModuleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModuleFilter(e.target.value);
    setPage(1); // Reset to first page when filter changes
  };

  const toggleRow = (id: string) => {
    if (expandedRowId === id) setExpandedRowId(null);
    else setExpandedRowId(id);
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      (l.admin_uid || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.target_id || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pb-10">
      <PageHeader title="Audit Logs" subtitle="All system actions recorded in chronological order" />

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2 border-r border-gray-100 pr-4">
          <Filter className="w-4 h-4 text-[#aaa]" />
          <select 
            value={moduleFilter} 
            onChange={handleModuleChange}
            className="text-sm text-[#444] outline-none bg-transparent cursor-pointer"
          >
            <option value="all">All Modules</option>
            <option value="products">Products</option>
            <option value="orders">Orders</option>
            <option value="stock">Stock</option>
            <option value="settings">Settings</option>
            <option value="users">Users</option>
            <option value="roles">Roles</option>
          </select>
        </div>

        <Search className="w-4 h-4 text-[#aaa] ml-2" />
        <input
          type="text" placeholder="Search by action, target ID, or Admin UID..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm text-[#444] outline-none bg-transparent placeholder:text-[#bbb]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#D98C1F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-10 h-10 text-[#ccc] mx-auto mb-3" />
            <p className="text-[#888] text-sm">No audit logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5 w-10"></th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Timestamp</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Module</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Action</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Target ID</th>
                  <th className="text-left text-xs font-semibold text-[#999] px-5 py-3.5">Admin UID</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`border-b border-gray-50 hover:bg-gray-50/60 cursor-pointer transition-colors ${expandedRowId === log.id ? 'bg-[#FAFAFA]' : ''}`}
                      onClick={() => toggleRow(log.id)}
                    >
                      <td className="px-5 py-3.5 text-[#aaa]">
                        {expandedRowId === log.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[#888] whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString("en-LK") : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${MODULE_COLORS[log.module] || "bg-gray-100 text-gray-600"}`}>
                          {log.module}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm text-[#444] capitalize">{log.action.replace(/_/g, " ")}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] text-[#aaa]">{log.target_id?.substring(0, 12) || "—"}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[11px] text-[#aaa]">{log.admin_uid?.substring(0, 12) || "system"}</span>
                      </td>
                    </tr>
                    
                    {/* Expanded Details Row */}
                    {expandedRowId === log.id && (
                      <tr className="bg-[#FAFAFA] border-b border-gray-100">
                        <td colSpan={6} className="px-10 py-5">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-semibold text-[#888] mb-2 uppercase tracking-wide">Old Value</p>
                              <pre className="bg-white border border-gray-100 rounded-lg p-3 text-[10px] text-[#555] font-mono overflow-auto max-h-[300px] shadow-inner">
                                {log.old_value ? JSON.stringify(log.old_value, null, 2) : "null"}
                              </pre>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#888] mb-2 uppercase tracking-wide">New Value</p>
                              <pre className="bg-[#F8FCF8] border border-[#E2F0E2] rounded-lg p-3 text-[10px] text-[#2F6B2F] font-mono overflow-auto max-h-[300px] shadow-inner">
                                {log.new_value ? JSON.stringify(log.new_value, null, 2) : "null"}
                              </pre>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-between bg-[#FAFAFA]">
            <p className="text-xs text-[#888]">
              Showing <span className="font-medium text-[#444]">{(page - 1) * limit + 1}</span> to <span className="font-medium text-[#444]">{Math.min(page * limit, totalRecords)}</span> of <span className="font-medium text-[#444]">{totalRecords}</span> entries
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-gray-200 text-[#666] hover:bg-white hover:text-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-[#444] px-2">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md border border-gray-200 text-[#666] hover:bg-white hover:text-[#222] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

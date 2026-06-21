"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
  markets: string[];
  agentType: string;
  agencySize: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  howSoon?: string | null;
  monthlyBudget?: string | null;
  contactMethod?: string | null;
  bestTime?: string | null;
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    if (!sessionStorage.getItem("adminLoggedIn")) {
      router.push("/admin");
      return;
    }

    fetchLeads();
  }, [filter, router]);

  const fetchLeads = async () => {
    try {
      const url =
        filter === "all" ? "/api/leads" : `/api/leads?status=${filter}`;

      const response = await fetch(url);

      if (!response.ok) {
        console.error("API response not OK:", response.status);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON");
        return;
      }

      const data = await response.json();

      if (data.success) {
        setLeads(data.leads);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lead Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin/reviews")}
              className="px-4 py-2 bg-[#00d4ff] text-[#0a0f1a] rounded-lg hover:bg-[#00b8e6] transition-colors text-sm font-medium"
            >
              Manage Reviews
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["all", "new", "contacted", "qualified", "closed", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-[#00d4ff] text-[#0a0f1a]"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm">Total Leads</p>
            <p className="text-2xl font-bold">{leads.length}</p>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm">New</p>
            <p className="text-2xl font-bold">
              {leads.filter((l) => l.status === "new").length}
            </p>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm">Qualified</p>
            <p className="text-2xl font-bold">
              {leads.filter((l) => l.status === "qualified").length}
            </p>
          </div>
          <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-sm">Closed</p>
            <p className="text-2xl font-bold">
              {leads.filter((l) => l.status === "closed").length}
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-[#0f172a] rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#0a0f1a]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Contact
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Markets
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#0a0f1a]">
                    <td className="px-4 py-3 text-sm">
                      <div>{lead.firstName} {lead.lastName}</div>
                      {(lead.howSoon || lead.monthlyBudget) && (
                        <div className="text-xs text-gray-400 mt-1 flex flex-col gap-0.5">
                          {lead.howSoon && <span>Timeline: {lead.howSoon}</span>}
                          {lead.monthlyBudget && <span>Budget: {lead.monthlyBudget}</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{lead.email}</div>
                      <div className="text-gray-400">{lead.phone}</div>
                      {lead.contactMethod && (
                        <div className="text-xs text-[#00d4ff] mt-1">
                          Pref: {lead.contactMethod}
                          {lead.bestTime && ` (${lead.bestTime})`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>{lead.agentType}</div>
                      {lead.agencySize && (
                        <div className="text-gray-400 text-xs">
                          {lead.agencySize}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-xs text-gray-400">
                        {lead.markets.slice(0, 2).join(", ")}
                        {lead.markets.length > 2 && "..."}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className="bg-[#0a0f1a] border border-gray-700 rounded px-2 py-1 text-xs"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="closed">Closed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button
                        onClick={() => deleteLead(lead.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {leads.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              No leads found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

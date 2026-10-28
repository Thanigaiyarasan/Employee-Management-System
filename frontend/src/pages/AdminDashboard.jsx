import React, { useCallback, useEffect, useState } from "react";
import Layout from "../components/Layout.jsx";
import EmployeeForm from "../components/EmployeeForm.jsx";
import { request } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadEmployees = useCallback(async (term = search) => {
    setError("");
    try {
      const data = await request(`/employees?search=${encodeURIComponent(term)}`, { token });
      setEmployees(data.employees);
    } catch (loadError) {
      setError(loadError.message);
    }
  }, [search, token]);

  useEffect(() => {
    const timeout = setTimeout(() => loadEmployees(search), 250);
    return () => clearTimeout(timeout);
  }, [search, loadEmployees]);

  async function saveEmployee(values) {
    setBusy(true);
    try {
      await request(modal.employee ? `/employees/${modal.employee._id}` : "/employees", {
        token,
        method: modal.employee ? "PUT" : "POST",
        body: JSON.stringify(values)
      });
      setModal(null);
      await loadEmployees(search);
    } finally {
      setBusy(false);
    }
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Delete ${employee.name}'s account? This cannot be undone.`)) return;
    setError("");
    try {
      await request(`/employees/${employee._id}`, { token, method: "DELETE" });
      await loadEmployees(search);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <Layout title="Team directory" subtitle="Manage employee profiles and account details.">
      <section className="summary-row">
        <article className="summary-card"><span className="summary-icon people-icon">♧</span><div><span className="summary-label">TEAM MEMBERS</span><strong>{employees.length}</strong></div></article>
        <article className="summary-card"><span className="summary-icon status-icon">✓</span><div><span className="summary-label">DIRECTORY STATUS</span><strong className="status-text"><i /> Up to date</strong></div></article>
      </section>
      <section className="directory-card">
        <div className="directory-toolbar">
          <div><h2>All employees</h2><p>Browse and manage your organization’s people.</p></div>
          <button className="button button-primary add-button" onClick={() => setModal({ employee: null })}><span>＋</span> Add employee</button>
        </div>
        <div className="search-wrap"><span className="search-icon">⌕</span><input aria-label="Search employees" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, email, title or department…" /></div>
        {error && <p className="notice-error" role="alert">{error}</p>}
        <div className="table-scroll">
          <table className="employee-table">
            <thead><tr><th>EMPLOYEE</th><th>JOB TITLE</th><th>DEPARTMENT</th><th>PHONE</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee._id}>
                  <td><div className="employee-cell"><div className="avatar table-avatar">{employee.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</div><div><strong>{employee.name}</strong><span>{employee.email}</span></div></div></td>
                  <td>{employee.jobTitle}</td><td><span className="department-tag">{employee.department}</span></td><td className="muted-cell">{employee.phone || "—"}</td>
                  <td><div className="row-actions"><button className="text-action" onClick={() => setModal({ employee })}>Edit</button><button className="text-action delete-action" onClick={() => deleteEmployee(employee)}>Delete</button></div></td>
                </tr>
              ))}
              {!employees.length && <tr><td colSpan="5" className="empty-state">{search ? "No employees match your search." : "No employees yet. Add your first team member."}</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="table-footer">Showing <strong>{employees.length}</strong> employee{employees.length === 1 ? "" : "s"}</div>
      </section>
      {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}>
        <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-heading"><div><p className="eyebrow">{modal.employee ? "TEAM DIRECTORY" : "NEW TEAM MEMBER"}</p><h2 id="modal-title">{modal.employee ? "Edit employee" : "Add employee"}</h2></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}>×</button></div>
          <EmployeeForm employee={modal.employee} onSubmit={saveEmployee} onCancel={() => setModal(null)} busy={busy} />
        </section>
      </div>}
    </Layout>
  );
}

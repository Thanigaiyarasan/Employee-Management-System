import React, { useEffect, useState } from "react";

const blankForm = { name: "", email: "", jobTitle: "", department: "", phone: "", password: "" };

export default function EmployeeForm({ employee, onSubmit, onCancel, busy }) {
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(employee ? { ...blankForm, ...employee, password: "" } : blankForm);
    setError("");
  }, [employee]);

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (form.name.trim().length < 2) return setError("Name must be at least 2 characters.");
    if (!emailValid) return setError("Enter a valid email address.");
    if (!form.jobTitle.trim() || !form.department.trim()) return setError("Job title and department are required.");
    if (!employee && form.password.length < 8) return setError("Password must be at least 8 characters.");
    if (form.phone.length > 30) return setError("Phone number cannot exceed 30 characters.");
    try {
      await onSubmit({
        name: form.name.trim(),
        email: form.email.trim(),
        jobTitle: form.jobTitle.trim(),
        department: form.department.trim(),
        phone: form.phone.trim(),
        ...(!employee ? { password: form.password } : {})
      });
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <form onSubmit={submit} className="employee-form" noValidate>
      <div className="form-grid">
        <label>Full name<input name="name" value={form.name} onChange={update} maxLength="80" required placeholder="e.g. Sam Rivera" /></label>
        <label>Email address<input type="email" name="email" value={form.email} onChange={update} required placeholder="sam@company.com" /></label>
        <label>Job title<input name="jobTitle" value={form.jobTitle} onChange={update} maxLength="80" required placeholder="e.g. Product Designer" /></label>
        <label>Department<input name="department" value={form.department} onChange={update} maxLength="80" required placeholder="e.g. Design" /></label>
        <label>Phone number <span className="optional">(optional)</span><input name="phone" value={form.phone} onChange={update} maxLength="30" placeholder="e.g. 555-0100" /></label>
        {!employee && <label>Temporary password<input type="password" name="password" value={form.password} onChange={update} minLength="8" required placeholder="At least 8 characters" /></label>}
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>Cancel</button>
        <button className="button button-primary" type="submit" disabled={busy}>{busy ? "Saving…" : employee ? "Save changes" : "Add employee"}</button>
      </div>
    </form>
  );
}

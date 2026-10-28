import React from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href={user?.role === "admin" ? "/admin" : "/employee"}>
          <span className="brand-mark">P</span>
          <span>PeopleDesk</span>
        </a>
        <div className="account">
          <div className="avatar">{initials}</div>
          <div className="account-copy">
            <strong>{user?.name}</strong>
            <span>{user?.role === "admin" ? "Administrator" : "Employee"}</span>
          </div>
          <button className="button button-quiet signout" onClick={logout}>Sign out</button>
        </div>
      </header>
      <main className="main-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">PEOPLEDESK WORKSPACE</p>
            <h1>{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          <span className="today-label">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</span>
        </div>
        {children}
      </main>
      <footer className="footer">PeopleDesk <span>·</span> Employee Management</footer>
    </div>
  );
}

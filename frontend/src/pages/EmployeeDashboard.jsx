import React from "react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const initials = user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Layout title={`Hello, ${user.name.split(" ")[0]}`} subtitle="Here’s your employee profile and account information.">
      <section className="profile-banner">
        <div className="profile-avatar">{initials}</div>
        <div><span className="profile-kicker">YOUR PROFILE</span><h2>{user.name}</h2><p>{user.jobTitle} <span>·</span> {user.department}</p></div>
        <span className="active-badge"><i /> Active employee</span>
      </section>
      <section className="profile-card">
        <div className="profile-card-heading"><div><h2>Personal information</h2><p>Your profile details as maintained by your administrator.</p></div><span className="lock-icon">▣</span></div>
        <div className="profile-details">
          <div className="detail-item"><span>FULL NAME</span><strong>{user.name}</strong></div>
          <div className="detail-item"><span>EMAIL ADDRESS</span><strong>{user.email}</strong></div>
          <div className="detail-item"><span>JOB TITLE</span><strong>{user.jobTitle}</strong></div>
          <div className="detail-item"><span>DEPARTMENT</span><strong>{user.department}</strong></div>
          <div className="detail-item"><span>PHONE NUMBER</span><strong>{user.phone || "Not provided"}</strong></div>
          <div className="detail-item"><span>ACCOUNT TYPE</span><strong>Employee</strong></div>
        </div>
      </section>
      <p className="profile-hint">Need to update your details? Please contact your administrator.</p>
    </Layout>
  );
}

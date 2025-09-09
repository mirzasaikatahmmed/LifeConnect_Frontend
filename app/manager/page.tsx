// app/manager/page.tsx
"use client";
import Dashboard from "./Dashboard/page";

 // যদি state/hooks/MUI use করো

export default function ManagerPage() {
  return (
    <div style={{ padding: "20px" }}>
      <Dashboard/>
    </div>
  );
}

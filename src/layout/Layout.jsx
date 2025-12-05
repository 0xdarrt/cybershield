import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 px-4">
        <Outlet />
      </main>
    </div>
  );
}

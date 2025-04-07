import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Layout from "./components/common/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import WorkflowList from "./pages/workflows/WorkflowList";
import WorkflowEditor from "./pages/workflows/WorkflowEditor";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <Layout />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="workflows" element={<WorkflowList />} />
        <Route path="workflows/new" element={<WorkflowEditor />} />
        <Route path="workflows/:id" element={<WorkflowEditor />} />
      </Route>
    </Routes>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import api from "../../services/api";

const WorkflowList = () => { 
  const { getToken } = useAuth();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const token = await getToken();
        const response = await api.get("/workflows", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkflows(response.data.data.workflows);
      } catch (error) {
        console.error("Error fetching workflows:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkflows();
  }, [getToken]);

  const filteredWorkflows = workflows.filter((workflow) =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Workflows</h1>
        <Link
          to="/workflows/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Create New Workflow
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search workflows..."
          className="w-full p-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredWorkflows.map((workflow) => (
            <li key={workflow._id}>
              <Link
                to={`/workflows/${workflow._id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary-600 truncate">
                      {workflow.name}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {workflow.description || "No description"}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Last edited on{" "}
                        {new Date(workflow.lastEditedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkflowList;

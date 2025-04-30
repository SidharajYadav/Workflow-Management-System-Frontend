import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; 
import ReactFlow, {
  Background,
  Controls,
  addEdge, 
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import api from "../../services/api";
import CustomNode from "../../components/workflow/CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

const WorkflowEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isNew, setIsNew] = useState(!id);

  useEffect(() => {
    if (!id) {
      // Initialize a new workflow with a start node
      setNodes([
        {
          id: "1",
          type: "custom",
          position: { x: 250, y: 5 },
          data: { type: "start", label: "Start" },
        },
      ]);
      return;
    }

    const fetchWorkflow = async () => {
      try {
        const token = await getToken();
        const response = await api.get(`/workflows/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const workflow = response.data.data.workflow;
        setName(workflow.name);
        setDescription(workflow.description);

        // Convert steps to nodes
        const workflowNodes = workflow.steps.map((step, index) => ({
          id: `${index + 1}`,
          type: "custom",
          position: step.position || { x: 250, y: (index + 1) * 100 },
          data: { type: step.type, label: step.type, config: step.config },
        }));

        // Create edges between nodes (simple linear connection for now)
        const workflowEdges = workflowNodes.slice(0, -1).map((node, index) => ({
          id: `e${node.id}-${workflowNodes[index + 1].id}`,
          source: node.id,
          target: workflowNodes[index + 1].id,
        }));

        setNodes(workflowNodes);
        setEdges(workflowEdges);
      } catch (error) {
        console.error("Error fetching workflow:", error);
        navigate("/workflows");
      }
    };

    fetchWorkflow();
  }, [id, getToken, navigate, setNodes, setEdges]);

  const onConnect = (params) => {
    setEdges((eds) => addEdge(params, eds));
  };

  const addNode = (type) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: "custom",
      position: { x: 250, y: (nodes.length + 1) * 100 },
      data: { type, label: type },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const saveWorkflow = async () => {
    try {
      const token = await getToken();
      const steps = nodes.map((node) => ({
        type: node.data.type,
        config: node.data.config || {},
        position: node.position,
      }));

      const workflowData = {
        name,
        description,
        steps,
      };

      if (isNew) {
        await api.post("/workflows", workflowData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.patch(`/workflows/${id}`, workflowData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      navigate("/workflows");
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isNew ? "Create New Workflow" : "Edit Workflow"}
          </h2>
          <button
            onClick={saveWorkflow}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
          >
            Save Workflow
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        <div className="w-64 bg-white shadow p-4">
          <h3 className="font-medium mb-2">Nodes</h3>
          <div className="space-y-2">
            <button
              onClick={() => addNode("start")}
              className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Start
            </button>
            <button
              onClick={() => addNode("end")}
              className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              End
            </button>
            <button
              onClick={() => addNode("api")}
              className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              API Call
            </button>
            <button
              onClick={() => addNode("email")}
              className="w-full text-left p-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Email
            </button>
          </div>
        </div>

        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditor;

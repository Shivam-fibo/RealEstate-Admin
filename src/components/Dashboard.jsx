import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-semibold mb-10 text-blue-600">Dashboard</h1>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/builder")}
          className="w-full py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
        >
          Add Builder
        </button>

        <button
          onClick={() => navigate("/add-property")}
          className="w-full py-3 bg-blue-100 text-blue-600 font-medium rounded-md hover:bg-blue-200 transition"
        >
          Add Property
        </button>

        <button
          onClick={() => navigate("/properties")}
          className="w-full py-3 bg-blue-100 text-blue-600 font-medium rounded-md hover:bg-blue-200 transition"
        >
          Edit Property
        </button>

         <button
          onClick={() => navigate("/schedule")}
          className="w-full py-3 bg-blue-100 text-blue-600 font-medium rounded-md hover:bg-blue-200 transition"
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

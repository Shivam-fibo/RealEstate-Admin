import React from 'react'
import { useNavigate } from 'react-router-dom'
const Dashboard = () => {
  const navigate = useNavigate()


  return (
<>
    <div>Dashboard</div>
    <button onClick={() => navigate("/builder")}>Add builder</button>
    <button onClick={() => navigate("/add-property")}>Add Property</button>
    <button onClick={() => navigate("/add-property")}>Add Property</button>
</>
  )
}

export default Dashboard
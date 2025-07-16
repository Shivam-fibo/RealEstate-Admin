import React, { useEffect, useState } from 'react';

const AllSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('https://real-esate-backend.vercel.app/api/schedlue/allSchedule');
        const data = await response.json();

        if (data.success) {
          setSchedules(data.schedules);
        }
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">All Scheduled Visits</h2>

        {schedules.length === 0 ? (
          <p className="text-center text-gray-500">No schedules found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-600 text-left">
                  <th className="p-3 border">User Name</th>
                  <th className="p-3 border">User Email</th>
                  <th className="p-3 border">Property Title</th>
                  <th className="p-3 border">Location</th>
                  <th className="p-3 border">Visit Date</th>
                  <th className="p-3 border">Visit Time</th>
                  <th className="p-3 border">Notes</th>
                  <th className="p-3 border">Created At</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule._id} className="hover:bg-blue-50">
                    <td className="p-3 border">{schedule.userId?.name}</td>
                    <td className="p-3 border">{schedule.userId?.email}</td>
                    <td className="p-3 border">{schedule.PropertyId?.title}</td>
                    <td className="p-3 border">{schedule.PropertyId?.location}</td>
                    <td className="p-3 border">{new Date(schedule.visitDate).toLocaleDateString()}</td>
                    <td className="p-3 border">{schedule.visitTime}</td>
                    <td className="p-3 border">{schedule.notes}</td>
                    <td className="p-3 border">{new Date(schedule.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSchedules;

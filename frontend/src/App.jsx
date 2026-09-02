import { useEffect, useState } from "react";

function App() {
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "flight",
    date: "",
    status: "planned",
    notes: "",
  });

  const fetchTrips = () => {
    fetch("http://127.0.0.1:8000/trips")
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:8000/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        fetchTrips();
        setFormData({
          title: "",
          category: "flight",
          date: "",
          status: "planned",
          notes: "",
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Travel Planner ✈️</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        >
          <option value="flight">Flight</option>
          <option value="hotel">Hotel</option>
          <option value="activity">Activity</option>
          <option value="restaurant">Restaurant</option>
          <option value="hidden_gem">Hidden Gem</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        >
          <option value="planned">Planned</option>
          <option value="booked">Booked</option>
          <option value="completed">Completed</option>
        </select>

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          style={{ display: "block", marginBottom: "10px", width: "100%", padding: "8px" }}
        />

        <button type="submit" style={{ padding: "10px 20px" }}>
          Add Item
        </button>
      </form>

      {trips.length === 0 ? (
        <p>No trips yet...</p>
      ) : (
        trips.map((trip) => (
          <div
            key={trip.id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "15px",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <h2>{trip.title}</h2>
            <p><strong>Category:</strong> {trip.category}</p>
            <p><strong>Date:</strong> {trip.date}</p>
            <p><strong>Status:</strong> {trip.status}</p>
            <p><strong>Notes:</strong> {trip.notes}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
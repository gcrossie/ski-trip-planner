import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    Country: "Switzerland",
    HighestPoint: 2500,
    LowestPoint: 1200,
    BeginnerSlope: 25,
    IntermediateSlope: 50,
    DifficultSlope: 25,
    TotalSlope: 100,
    Snowparks: "Yes",
    NightSki: "No",
    SurfaceLifts: 5,
    ChairLifts: 8,
    GondolaLifts: 4,
    TotalLifts: 17,
    LiftCapacity: 30000,
    SnowCannons: 100,
  });

  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [saveMessage, setSaveMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const [trips, setTrips] = useState([]);
  const [tripsVisible, setTripsVisible] = useState(false);
  const [tripsLoading, setTripsLoading] = useState(false);

  const countries = [
    "Andorra",
    "Austria",
    "Finland",
    "France",
    "Germany",
    "Italy",
    "Norway",
    "Spain",
    "Sweden",
    "Switzerland",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "Country" ||
        name === "Snowparks" ||
        name === "NightSki"
          ? value
          : Number(value),
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setError("");
    setPrediction(null);
    setSaveMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data.predicted_day_pass_price);
    } catch (err) {
      setError("Could not calculate the price. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (prediction === null) {
      setSaveMessage("Calculate a price first.");
      return;
    }

    setSaving(true);
    setSaveMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          country: form.Country,
          predicted_price: prediction,
          highest_point: form.HighestPoint,
          total_slope: form.TotalSlope,
          gondola_lifts: form.GondolaLifts,
          lift_capacity: form.LiftCapacity,
          snowparks: form.Snowparks,
          night_ski: form.NightSki,
          notes: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Save failed");
      }

      setSaveMessage("Trip saved.");
    } catch (err) {
      setSaveMessage("Could not save trip.");
    } finally {
      setSaving(false);
    }
  };

  const handleShowTrips = async () => {
    if (tripsVisible) {
      setTripsVisible(false);
      return;
    }

    setTripsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/trips");

      if (!response.ok) {
        throw new Error("Could not load trips");
      }

      const data = await response.json();

      setTrips(data);
      setTripsVisible(true);
    } catch (err) {
      setError("Could not load saved trips.");
    } finally {
      setTripsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/trips/${tripId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setTrips(trips.filter((trip) => trip.id !== tripId));
    } catch (err) {
      setError("Could not delete trip.");
    }
  };

  return (
    <div>
      <h1>Ski Trip Planner</h1>

      <div>
        <label>Country</label>
        <select
          name="Country"
          value={form.Country}
          onChange={handleChange}
        >
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Highest point</label>
        <input
          type="number"
          name="HighestPoint"
          value={form.HighestPoint}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Lowest point</label>
        <input
          type="number"
          name="LowestPoint"
          value={form.LowestPoint}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Beginner slope</label>
        <input
          type="number"
          name="BeginnerSlope"
          value={form.BeginnerSlope}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Intermediate slope</label>
        <input
          type="number"
          name="IntermediateSlope"
          value={form.IntermediateSlope}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Difficult slope</label>
        <input
          type="number"
          name="DifficultSlope"
          value={form.DifficultSlope}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Total slope</label>
        <input
          type="number"
          name="TotalSlope"
          value={form.TotalSlope}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Snowpark</label>
        <select
          name="Snowparks"
          value={form.Snowparks}
          onChange={handleChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label>Night skiing</label>
        <select
          name="NightSki"
          value={form.NightSki}
          onChange={handleChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div>
        <label>Surface lifts</label>
        <input
          type="number"
          name="SurfaceLifts"
          value={form.SurfaceLifts}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Chair lifts</label>
        <input
          type="number"
          name="ChairLifts"
          value={form.ChairLifts}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Gondola lifts</label>
        <input
          type="number"
          name="GondolaLifts"
          value={form.GondolaLifts}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Total lifts</label>
        <input
          type="number"
          name="TotalLifts"
          value={form.TotalLifts}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Lift capacity</label>
        <input
          type="number"
          name="LiftCapacity"
          value={form.LiftCapacity}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Snow cannons</label>
        <input
          type="number"
          name="SnowCannons"
          value={form.SnowCannons}
          onChange={handleChange}
        />
      </div>

      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Calculating..." : "Estimate price"}
      </button>

      {error && <p>{error}</p>}

      {prediction !== null && (
        <div>
          <h2>Predicted day pass price: €{prediction}</h2>

          <button onClick={handleSaveTrip} disabled={saving}>
            {saving ? "Saving..." : "Save trip"}
          </button>
        </div>
      )}

      {saveMessage && <p>{saveMessage}</p>}

      <hr />

      <button onClick={handleShowTrips} disabled={tripsLoading}>
        {tripsLoading
          ? "Loading..."
          : tripsVisible
          ? "Hide saved trips"
          : "Show saved trips"}
      </button>

      {tripsVisible && (
        <div>
          <h2>Saved trips</h2>

          {trips.length === 0 ? (
            <p>No saved trips yet.</p>
          ) : (
            trips.map((trip) => (
              <div key={trip.id}>
                <h3>{trip.country}</h3>

                <p>Predicted price: €{trip.predicted_price}</p>
                <p>Highest point: {trip.highest_point} m</p>
                <p>Total slope: {trip.total_slope} km</p>
                <p>Gondola lifts: {trip.gondola_lifts}</p>
                <p>Lift capacity: {trip.lift_capacity}</p>
                <p>Snowpark: {trip.snowparks}</p>
                <p>Night skiing: {trip.night_ski}</p>

                <button onClick={() => handleDeleteTrip(trip.id)}>
                  Delete
                </button>

                <hr />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;
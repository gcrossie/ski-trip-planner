import { useState } from "react";
import "./App.css";
import heroImage from "./assets/ski-trip-planner1.jpg";

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
  const [error, setError] = useState([]);
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

  const validateForm = () => {
    const errors = [];

    const numericValues = [
      form.HighestPoint,
      form.LowestPoint,
      form.BeginnerSlope,
      form.IntermediateSlope,
      form.DifficultSlope,
      form.TotalSlope,
      form.SurfaceLifts,
      form.ChairLifts,
      form.GondolaLifts,
      form.TotalLifts,
      form.LiftCapacity,
      form.SnowCannons,
    ];

    if (numericValues.some((value) => value < 0)) {
      errors.push("Values cannot be negative.");
    }

    if (form.HighestPoint <= form.LowestPoint) {
      errors.push(
        "Highest point must be higher than lowest point."
      );
    }

    const slopeSum =
      form.BeginnerSlope +
      form.IntermediateSlope +
      form.DifficultSlope;

    if (form.TotalSlope < slopeSum) {
      errors.push(
        "Total slope cannot be smaller than the combined slopes."
      );
    }

    const liftSum =
      form.SurfaceLifts +
      form.ChairLifts +
      form.GondolaLifts;

    if (form.TotalLifts < liftSum) {
      errors.push(
        "Total lifts cannot be smaller than the combined lifts."
      );
    }

    return errors;
  };

  const handlePredict = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setError(validationErrors);
      setPrediction(null);
      return;
    }

    setLoading(true);
    setError([]);
    setPrediction(null);
    setSaveMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPrediction(data.predicted_day_pass_price);
    } catch (err) {
      setError([
        "Could not calculate the price. Please try again.",
      ]);
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
      const response = await fetch(
        "http://127.0.0.1:8000/trips",
        {
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
        }
      );

      if (!response.ok) {
        throw new Error("Save failed");
      }

      const savedTrip = await response.json();

      setSaveMessage("Trip saved.");

      if (tripsVisible) {
        setTrips((currentTrips) => [
          ...currentTrips,
          savedTrip,
        ]);
      }
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
    setError([]);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/trips"
      );

      if (!response.ok) {
        throw new Error("Could not load trips");
      }

      const data = await response.json();

      setTrips(data);
      setTripsVisible(true);
    } catch (err) {
      setError(["Could not load saved trips."]);
    } finally {
      setTripsLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    setError([]);

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

      setTrips((currentTrips) =>
        currentTrips.filter(
          (trip) => trip.id !== tripId
        )
      );
    } catch (err) {
      setError(["Could not delete trip."]);
    }
  };

  return (
    <div className="app">
      <header className="hero">
        <img
          src={heroImage}
          alt="Snowy mountain landscape"
          className="hero-image"
        />

        <div className="hero-overlay"></div>

        <nav className="navbar">
          <div className="brand">
            <span className="brand-icon">△</span>
            <span>Ski Trip Planner</span>
          </div>

          <div className="nav-links">
            <a href="#planner">Planner</a>
            <a href="#saved-trips">My Trips</a>
            <a href="#about">About</a>
          </div>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">
            PLAN YOUR ADVENTURE
          </p>

          <h1>
            Plan your
            <br />
            next ski trip
          </h1>

          <p className="hero-description">
            Estimate day pass prices based on resort
            features and mountain data.
          </p>

          <div className="hero-features">
            <span>Accurate price prediction</span>
            <span>Data-driven insights</span>
            <span>Save trips for later</span>
          </div>
        </div>
      </header>

      <main id="planner" className="planner-section">
        <div className="planner-layout">
          <section className="form-card">
            <div className="section-heading">
              <p className="section-label">
                RESORT DETAILS
              </p>

              <h2>Resort information</h2>

              <p>
                Enter the details of the ski resort to
                estimate an adult day pass price.
              </p>
            </div>

            <div className="form-group">
              <h3>Destination</h3>

              <div className="form-grid one-column">
                <div className="field">
                  <label>Country</label>

                  <select
                    name="Country"
                    value={form.Country}
                    onChange={handleChange}
                  >
                    {countries.map((country) => (
                      <option
                        key={country}
                        value={country}
                      >
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <h3>Mountain</h3>

              <div className="form-grid">
                <div className="field">
                  <label>Highest point (m)</label>
                  <input
                    type="number"
                    min="0"
                    name="HighestPoint"
                    value={form.HighestPoint}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Lowest point (m)</label>
                  <input
                    type="number"
                    min="0"
                    name="LowestPoint"
                    value={form.LowestPoint}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Total slope (km)</label>
                  <input
                    type="number"
                    min="0"
                    name="TotalSlope"
                    value={form.TotalSlope}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <h3>Slopes</h3>

              <div className="form-grid">
                <div className="field">
                  <label>Beginner slope (km)</label>
                  <input
                    type="number"
                    min="0"
                    name="BeginnerSlope"
                    value={form.BeginnerSlope}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>
                    Intermediate slope (km)
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="IntermediateSlope"
                    value={form.IntermediateSlope}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Difficult slope (km)</label>
                  <input
                    type="number"
                    min="0"
                    name="DifficultSlope"
                    value={form.DifficultSlope}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <h3>Lifts</h3>

              <div className="form-grid four-columns">
                <div className="field">
                  <label>Surface lifts</label>
                  <input
                    type="number"
                    min="0"
                    name="SurfaceLifts"
                    value={form.SurfaceLifts}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Chair lifts</label>
                  <input
                    type="number"
                    min="0"
                    name="ChairLifts"
                    value={form.ChairLifts}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Gondola lifts</label>
                  <input
                    type="number"
                    min="0"
                    name="GondolaLifts"
                    value={form.GondolaLifts}
                    onChange={handleChange}
                  />
                </div>

                <div className="field">
                  <label>Total lifts</label>
                  <input
                    type="number"
                    min="0"
                    name="TotalLifts"
                    value={form.TotalLifts}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid one-column">
                <div className="field">
                  <label>Lift capacity (p/h)</label>
                  <input
                    type="number"
                    min="0"
                    name="LiftCapacity"
                    value={form.LiftCapacity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <h3>Extras</h3>

              <div className="form-grid">
                <div className="field">
                  <label>Snowpark</label>
                  <select
                    name="Snowparks"
                    value={form.Snowparks}
                    onChange={handleChange}
                  >
                    <option value="Yes">
                      Yes
                    </option>
                    <option value="No">
                      No
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label>Night skiing</label>
                  <select
                    name="NightSki"
                    value={form.NightSki}
                    onChange={handleChange}
                  >
                    <option value="Yes">
                      Yes
                    </option>
                    <option value="No">
                      No
                    </option>
                  </select>
                </div>

                <div className="field">
                  <label>Snow cannons</label>
                  <input
                    type="number"
                    min="0"
                    name="SnowCannons"
                    value={form.SnowCannons}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {error.length > 0 && (
              <div className="error-box">
                {error.map((message, index) => (
                  <p key={index}>{message}</p>
                ))}
              </div>
            )}

            <button
              className="primary-button"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading
                ? "Calculating..."
                : "Estimate day pass price"}
            </button>

            <p className="model-note">
              Prediction based on historical resort data
              and a machine learning model.
            </p>
          </section>

          <aside className="sidebar">
            <section className="result-card">
              <p className="result-label">
                Estimated day pass price
              </p>

              {prediction !== null ? (
                <>
                  <div className="price">
                    €{prediction}
                  </div>

                  <p className="result-description">
                    Estimated adult day pass price based
                    on the resort information you entered.
                  </p>

                  <button
                    className="secondary-button"
                    onClick={handleSaveTrip}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save this trip"}
                  </button>

                  {saveMessage && (
                    <p className="save-message">
                      {saveMessage}
                    </p>
                  )}
                </>
              ) : (
                <div className="empty-result">
                  <p>
                    Fill in the resort details and click
                    estimate to see a predicted price.
                  </p>
                </div>
              )}
            </section>

            <section
              id="saved-trips"
              className="saved-card"
            >
              <div className="saved-header">
                <div>
                  <p className="section-label">
                    YOUR PLANS
                  </p>
                  <h2>Saved trips</h2>
                </div>

                <button
                  className="text-button"
                  onClick={handleShowTrips}
                  disabled={tripsLoading}
                >
                  {tripsLoading
                    ? "Loading..."
                    : tripsVisible
                    ? "Hide"
                    : "Show"}
                </button>
              </div>

              {tripsVisible && (
                <div className="saved-list">
                  {trips.length === 0 ? (
                    <p className="empty-trips">
                      No saved trips yet.
                    </p>
                  ) : (
                    trips.map((trip) => (
                      <article
                        className="trip-item"
                        key={trip.id}
                      >
                        <div className="trip-main">
                          <div>
                            <h3>
                              {trip.country}
                            </h3>

                            <p>
                              Highest point:{" "}
                              {trip.highest_point} m
                            </p>

                            <p>
                              Total slope:{" "}
                              {trip.total_slope} km
                            </p>
                          </div>

                          <strong>
                            €
                            {trip.predicted_price}
                          </strong>
                        </div>

                        <div className="trip-details">
                          <span>
                            Gondola lifts:{" "}
                            {trip.gondola_lifts}
                          </span>

                          <span>
                            Snowpark:{" "}
                            {trip.snowparks}
                          </span>

                          <span>
                            Night skiing:{" "}
                            {trip.night_ski}
                          </span>
                        </div>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteTrip(
                              trip.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </article>
                    ))
                  )}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>

      <footer id="about" className="footer">
        <strong>Ski Trip Planner</strong>
        <span>Plan better. Ski more.</span>
      </footer>
    </div>
  );
}

export default App;
import { useState } from "react";

function App() {
  const [form, setForm] = useState({
    Country: "Switzerland",
    HighestPoint: 3000,
    LowestPoint: 1000,
    BeginnerSlope: 30,
    IntermediateSlope: 60,
    DifficultSlope: 20,
    TotalSlope: 110,
    Snowparks: "Yes",
    NightSki: "No",
    SurfaceLifts: 8,
    ChairLifts: 10,
    GondolaLifts: 5,
    TotalLifts: 23,
    LiftCapacity: 40000,
    SnowCannons: 150,
  });

  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]:
        name === "Country" || name === "Snowparks" || name === "NightSki"
          ? value
          : Number(value),
    });
  };

  const handlePredict = async () => {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setPrediction(data.predicted_day_pass_price);
  };

  return (
    <div>
      <h1>Ski Trip Planner</h1>

      {Object.entries(form).map(([key, value]) => (
        <div key={key}>
          <label>{key}</label>
          <input
            name={key}
            value={value}
            onChange={handleChange}
          />
        </div>
      ))}

      <button onClick={handlePredict}>
        Predict price
      </button>

      {prediction !== null && (
        <h2>Predicted day pass price: €{prediction}</h2>
      )}
    </div>
  );
}

export default App;
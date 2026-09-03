# Ski Trip Planner

Ski Trip Planner is a machine learning project that predicts the adult day pass price of European ski resorts.

The project includes the main parts of a machine learning workflow: data cleaning, exploratory data analysis, model training, evaluation, unsupervised learning, hyperparameter tuning and deployment.

The final model is connected to a web application built with React and FastAPI.

---

## Project Goal

The goal of the project is to predict the adult day pass price of a ski resort based on information about the resort.

The input features include:

- Country
- Highest and lowest elevation
- Beginner slopes
- Intermediate slopes
- Difficult slopes
- Total slope length
- Surface lifts
- Chair lifts
- Gondola lifts
- Total lifts
- Lift capacity
- Snow cannons
- Snowparks
- Night skiing

The target variable is:

`DayPassPriceAdult`

---

## Dataset

The project uses the dataset:

`European_Ski_Resorts.csv`

I focused on ski resorts from:

- Andorra
- Austria
- Finland
- France
- Germany
- Italy
- Norway
- Spain
- Sweden
- Switzerland

Rows where the adult day pass price was 0 were removed before modelling.

I also checked the dataset for missing values and duplicated rows.

No missing values or duplicated rows were found in the final dataset.

---

## Exploratory Data Analysis

I used exploratory data analysis to understand the dataset and look for patterns that could be useful for the prediction task.

The analysis included:

- Descriptive statistics
- Distribution of adult day pass prices
- Average day pass price by country
- Highest point compared with day pass price
- Total slope length compared with day pass price
- Total lifts compared with day pass price
- Lift capacity compared with day pass price
- Correlation analysis
- Snowparks and night skiing values

---

## Data Preprocessing

The dataset contains both numerical and categorical features.

The categorical features are:

- Country
- Snowparks
- NightSki

These are transformed with:

`OneHotEncoder(handle_unknown="ignore")`

The preprocessing is included in Scikit-learn pipelines so that the same transformations are used both during training and when new predictions are made.

For Ridge Regression, the numerical features were also scaled with `StandardScaler`.

---

## Models

I tested several regression models:

- Dummy Regressor
- Ridge Regression
- Random Forest Regressor
- Gradient Boosting Regressor

The Dummy Regressor was used as a baseline so I could compare the real models against a simple prediction method.

---

## Model Evaluation

The models were evaluated using:

- MAE
- RMSE
- R²

The test-set results were approximately:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Baseline | 8.43 | 11.28 | -0.00 |
| Ridge Regression | 3.60 | 4.67 | 0.83 |
| Random Forest | 2.93 | 4.10 | 0.87 |
| Gradient Boosting | **2.65** | **3.74** | **0.89** |

Gradient Boosting gave the best result on the test set.

---

## Cross-Validation

I also used 5-fold cross-validation to check whether the models performed well across different splits of the data.

The average MAE was approximately:

| Model | Mean CV MAE |
|---|---:|
| Scaled Ridge Regression | 4.70 |
| Random Forest | 4.11 |
| Gradient Boosting | **4.02** |

Gradient Boosting had the lowest average MAE.

This supported the result from the original train/test split.

---

## Hyperparameter Tuning

I used `GridSearchCV` to test different Gradient Boosting settings.

The best parameters were:

- Learning rate: 0.1
- Max depth: 3
- Minimum samples split: 2
- Number of estimators: 100

The tuned model achieved approximately:

- MAE: 2.65
- RMSE: 3.74
- R²: 0.89

GridSearchCV did not find a better setup than the one I was already using, so I kept the same Gradient Boosting configuration.

---

## Unsupervised Learning

I also used K-Means clustering to explore the ski resorts without using predefined labels.

Three groups were identified:

- Smaller ski resorts
- Larger ski resorts
- Very large ski resorts

The groups differed in features such as:

- Highest point
- Total slope length
- Total lifts
- Lift capacity
- Snow cannons
- Adult day pass price

The clustering showed that larger resorts with more infrastructure generally also had higher average day pass prices.

---

## Final Model

Gradient Boosting was selected as the final model.

The complete pipeline was saved with Joblib as:

`ml/models/ski_pass_price_model.pkl`

The saved pipeline includes both preprocessing and the trained model.

---

## Web Application

The trained model is used in the Ski Trip Planner web application.

### Frontend

The frontend is built with:

- React
- Vite
- JavaScript
- CSS

The user enters ski resort information in a form and gets a predicted adult day pass price.

### Backend

The backend is built with:

- Python
- FastAPI
- Scikit-learn
- SQLAlchemy
- SQLite

The backend receives the data from the frontend, sends it through the trained model and returns the prediction.

---

## Application Features

The application can:

- Estimate an adult day pass price
- Validate incorrect input values
- Save predicted ski trips
- Show saved trips
- Delete saved trips

---

## API Endpoints

### Prediction

`POST /predict`

Returns a predicted adult day pass price.

### Saved Trips

`GET /trips`

Returns saved ski trips.

`POST /trips`

Saves a ski trip.

`DELETE /trips/{trip_id}`

Deletes a saved ski trip.

---

## Project Structure

```text
ski-trip-planner/
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── schemas/
│   ├── app.py
│   └── database.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── ml/
│   ├── data/
│   │   └── European_Ski_Resorts.csv
│   ├── models/
│   │   └── ski_pass_price_model.pkl
│   └── notebooks/
│       └── ski_pass_price_prediction.ipynb
│
├── .gitignore
└── README.md
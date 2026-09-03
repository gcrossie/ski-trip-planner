# Ski Trip Planner

Ski Trip Planner is a machine learning project that predicts the adult day pass price of European ski resorts based on resort characteristics.

The project covers the complete machine learning workflow, including data preparation, exploratory data analysis, supervised learning, unsupervised learning, model evaluation, hyperparameter tuning and model deployment.

The final machine learning model is connected to a web application built with React and FastAPI.

---

## Project Goal

The goal of the project is to predict the adult day pass price of a ski resort based on characteristics such as:

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

The dataset contains information about European ski resorts, including mountain characteristics, slope infrastructure, lift infrastructure and adult day pass prices.

The project focuses on ski resorts from:

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

Rows where the adult day pass price was equal to zero were removed because they were not useful for training the regression models.

The dataset was also checked for:

- Missing values
- Duplicated rows

No missing values or duplicated rows were found in the final dataset used for modelling.

---

## Exploratory Data Analysis

Exploratory Data Analysis was performed to better understand the dataset and identify relationships between resort characteristics and day pass prices.

The analysis included:

- Descriptive statistics
- Distribution of adult day pass prices
- Average day pass price by country
- Highest point vs day pass price
- Total slope length vs day pass price
- Total number of lifts vs day pass price
- Lift capacity vs day pass price
- Correlation analysis
- Analysis of categorical variables such as snowparks and night skiing

---

## Data Preprocessing

The feature data contains both numerical and categorical variables.

Categorical features:

- Country
- Snowparks
- NightSki

These variables are transformed using:

`OneHotEncoder(handle_unknown="ignore")`

The remaining numerical features are passed to the machine learning models through a Scikit-learn preprocessing pipeline.

For Ridge Regression, numerical features were also standardized using `StandardScaler`.

Using pipelines ensures that the same preprocessing steps are applied during both training and prediction.

---

## Machine Learning Models

Several regression models were trained and compared.

### Baseline

A `DummyRegressor` was used as a baseline model.

Its purpose was to provide a simple reference point for evaluating whether the machine learning models actually learned meaningful patterns from the data.

### Ridge Regression

Ridge Regression was tested as a regularized linear regression model.

### Random Forest Regressor

Random Forest was used as a non-linear ensemble learning model.

### Gradient Boosting Regressor

Gradient Boosting was also tested as an ensemble learning method.

It achieved the best performance among the tested supervised learning models.

---

## Model Evaluation

The regression models were evaluated using:

- MAE - Mean Absolute Error
- RMSE - Root Mean Squared Error
- R² - Coefficient of Determination

The original test-set results were approximately:

| Model | MAE | RMSE | R² |
|---|---:|---:|---:|
| Baseline | 8.43 | 11.28 | -0.00 |
| Ridge Regression | 3.60 | 4.67 | 0.83 |
| Random Forest | 2.93 | 4.10 | 0.87 |
| Gradient Boosting | **2.65** | **3.74** | **0.89** |

Gradient Boosting achieved the lowest MAE and RMSE and the highest R² score.

---

## Cross-Validation

To evaluate model performance more reliably, 5-fold cross-validation was also performed.

Average cross-validation MAE was approximately:

| Model | Mean CV MAE |
|---|---:|
| Scaled Ridge Regression | 4.70 |
| Random Forest | 4.11 |
| Gradient Boosting | **4.02** |

Gradient Boosting achieved the lowest average cross-validation MAE.

It also showed relatively consistent performance across the different folds.

---

## Hyperparameter Tuning

`GridSearchCV` was used to test different Gradient Boosting hyperparameter combinations.

The best parameters were:

- Learning rate: 0.1
- Max depth: 3
- Minimum samples split: 2
- Number of estimators: 100

The tuned model achieved approximately:

- MAE: 2.65
- RMSE: 3.74
- R²: 0.89

The tuning process confirmed that the original Gradient Boosting configuration was already well suited to the dataset.

---

## Unsupervised Learning

K-Means clustering was used as an unsupervised learning method to explore patterns in the ski resorts without predefined labels.

The clustering identified three general groups:

- Smaller ski resorts
- Larger ski resorts
- Very large ski resorts

The groups differed in characteristics such as:

- Highest point
- Total slope length
- Total lifts
- Lift capacity
- Snow cannons
- Adult day pass price

The analysis showed that larger resorts with more infrastructure generally also had higher average day pass prices.

---

## Final Model

Gradient Boosting was selected as the final machine learning model.

The complete preprocessing and prediction pipeline was saved using Joblib as:

`ml/models/ski_pass_price_model.pkl`

The saved pipeline allows the same preprocessing used during training to also be applied to new user input.

---

## Web Application

The trained machine learning model is used in the Ski Trip Planner web application.

The application consists of:

### Frontend

- React
- Vite
- JavaScript
- CSS

The user enters ski resort characteristics into a form and requests a predicted adult day pass price.

### Backend

- Python
- FastAPI
- Scikit-learn
- SQLAlchemy
- SQLite

The backend receives the form data from React, loads the trained machine learning model and returns the predicted price.

---

## Application Features

The web application allows the user to:

- Enter ski resort characteristics
- Estimate an adult day pass price
- Validate incorrect input values
- Save predicted ski trips
- View saved trips
- Delete saved trips

---

## API Endpoints

### Prediction

`POST /predict`

Receives ski resort characteristics and returns a predicted adult day pass price.

### Saved Trips

`GET /trips`

Returns saved ski trips.

`POST /trips`

Saves a ski trip and its predicted price.

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
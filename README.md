# AI-Powered Data Quality Auditor
## Overview

AI-Powered Data Quality Auditor is a full-stack web application that analyzes datasets and generates a comprehensive data quality report.

The application helps users identify missing values, visualize correlations, inspect dataset health, and understand the overall quality of structured datasets through interactive charts and analytics.
## Features

- Upload CSV datasets
- Data preview
- Missing value analysis
- Correlation heatmap
- Dataset summary
- Dataset health score
- Interactive charts
- Audit history
- Responsive user interface
## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Recharts

### Backend
- FastAPI
- Pandas
- NumPy
- Scikit-learn
- Matplotlib

### Database
- SQLite

### Tools
- Git
- GitHub
## Project Structure

```text
AI-Powered-Data-Quality-Auditor/
│
├── backend/
│   ├── app/
│   ├── generated_reports/
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
├── datasets/
├── screenshots/
└── README.md
```
## Installation

### Clone Repository

```bash
git clone https://github.com/raushan-kumar-14/AI-Powered-Data-Quality-Auditor.git
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
## Usage

1. Start the backend server.
2. Start the frontend.
3. Upload a CSV dataset.
4. View generated charts and statistics.
5. Explore dataset health and audit history.
## Sample Datasets

The repository contains sample datasets for testing:

- Adult Census
- Titanic
- Superstore Sales
- Telco Customer Churn
## Future Scope

- PDF report generation
- Duplicate detection
- AI-based cleaning recommendations
- Authentication
- PostgreSQL support
- Docker deployment
- Cloud storage integration
## Author

Raushan Kumar

- GitHub: https://github.com/raushan-kumar-14
- LinkedIn:https://www.linkedin.com/in/raushan-kumar-b02763287/
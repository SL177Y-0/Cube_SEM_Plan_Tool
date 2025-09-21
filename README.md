#  SEM Plan Tool - Ultimate Search Engine Marketing Campaign Planner

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

> **The most advanced SEM campaign planning tool with AI-powered optimization, real-time Google Ads integration, and comprehensive analytics.**

##  Features

###  AI-Powered Intelligence
- **Smart Keyword Research**: Advanced keyword discovery with AI-driven relevance scoring
- **Performance Max Optimization**: Automated PMax theme generation and optimization
- **Budget Intelligence**: AI-driven budget allocation for maximum ROAS
- **Competitive Analysis**: Advanced competitor research and market insights

### Real-Time Analytics
- **Live Google Ads Integration**: Real-time data from Google Keyword Planner
- **Performance Tracking**: Comprehensive campaign performance monitoring
- **Conversion Optimization**: Data-driven CRO recommendations
- **Trend Analysis**: SEM trend insights and best practices

### Campaign Management
- **Multi-Campaign Support**: Manage multiple campaigns from a single dashboard
- **Advanced Targeting**: Geographic, demographic, and behavioral targeting
- **A/B Testing**: Built-in testing framework for campaign optimization
- **Automated Reporting**: Scheduled reports and performance alerts

## Architecture

### Backend (FastAPI)
- **High-Performance API**: Built with FastAPI for maximum speed and reliability
- **Database**: PostgreSQL with SQLAlchemy ORM for robust data management
- **Authentication**: JWT-based security with role-based access control
- **AI Integration**: OpenAI and Anthropic API integration for intelligent features

### Frontend (React + TypeScript)
- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Component Library**: Shadcn UI components for consistent, beautiful design
- **Responsive Design**: Mobile-first approach with perfect responsiveness
- **Real-Time Updates**: Live data synchronization with backend

## Quick Start

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Google Ads API access

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CUBE_19AUG
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start the server
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start the development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000

## Key Capabilities

### Keyword Research
- **Volume Analysis**: Search volume data from Google Keyword Planner
- **Competition Assessment**: Competition level analysis
- **Cost Estimation**: CPC and budget estimation
- **Relevance Scoring**: AI-powered keyword relevance assessment

### Performance Max Campaigns
- **Theme Generation**: Automated PMax theme creation
- **Asset Optimization**: Smart asset recommendations
- **Audience Targeting**: Advanced audience segmentation
- **Performance Prediction**: AI-driven performance forecasting

### Budget Optimization
- **ROAS Maximization**: AI-driven budget allocation
- **Campaign Scaling**: Intelligent scaling recommendations
- **Cost Control**: Automated bid management
- **Performance Monitoring**: Real-time budget performance tracking

## Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sem_plan_tool

# Google Ads API
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token
GOOGLE_ADS_CLIENT_ID=your_client_id
GOOGLE_ADS_CLIENT_SECRET=your_client_secret

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Security
SECRET_KEY=your_secret_key
```

#### Frontend (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Google Ads Integration
VITE_GOOGLE_ADS_CLIENT_ID=your_client_id

# Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id
```

## Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend
npm test
```

### End-to-End Tests
```bash
npm run test:e2e
```

## Deployment

### Docker Deployment
```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Performance

- **API Response Time**: < 100ms average
- **Frontend Load Time**: < 2s initial load
- **Database Queries**: Optimized with proper indexing
- **Caching**: Redis-based caching for improved performance

## Security

- **Authentication**: JWT-based authentication
- **Authorization**: Role-based access control
- **Data Protection**: Encrypted data transmission
- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Protection**: ORM-based query protection

## Acknowledgments

- Google Ads API for providing comprehensive SEM data
- OpenAI and Anthropic for AI-powered features
- The open-source community for amazing tools and libraries
- All contributors who help make this project better

---

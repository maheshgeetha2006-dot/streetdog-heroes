# Street Dog Safety App

A comprehensive full-stack web application connecting citizens, NGOs, and veterinarians to improve the welfare of street dogs through coordinated rescue efforts, adoption services, and community support.

## 🐕 Project Vision

Street dogs face numerous challenges - from injuries and abandonment to lack of medical care and safe shelter. Our app bridges the gap between caring citizens and dedicated animal welfare organizations, creating a networked approach to street dog safety and well-being.

## 🌟 Features

### Frontend (React + Vite + Tailwind CSS)

#### 🏠 **Home Page**
- Compelling project vision and mission statement
- Quick access to emergency reporting and adoption
- NGO connect functionality
- Beautiful hero section with call-to-action buttons

#### 🗺️ **Interactive Map**
- **Google Maps/Leaflet.js integration** with safe zones, shelters, and veterinary hospitals
- **Community-driven data** - Citizens can add and update safe spots
- **Color-coded markers** for different location types:
  - 🔴 Animal Shelters
  - 🟢 Veterinary Clinics  
  - 🟡 Community Feeding Spots
  - 🔵 Rescue Centers
- **Real-time location tracking** for emergency responses

#### 🐾 **Adoption Center**
- **Comprehensive dog profiles** with photos, breed, age, health status
- **Advanced filtering** by breed, location, size, and health condition
- **Medical history tracking** for each dog
- **One-click adoption applications** directly linked to NGOs
- **Search functionality** across all listings

#### 📋 **Emergency Reporting**
- **Quick report forms** for injured, abandoned, or distressed dogs
- **Photo evidence upload** with AI-powered injury detection
- **GPS auto-location** with manual address backup
- **Urgency classification** system (Low, Medium, High, Critical)
- **Real-time status updates** from rescue teams
- **Case ID tracking** for follow-up

#### 💬 **Real-time Chat System**
- **WhatsApp-style messaging** between citizens ↔ NGOs ↔ Veterinarians
- **File and photo sharing** capabilities
- **Push notifications** for urgent messages
- **Role-based chat rooms** for coordination
- **Message history and search**

### Backend (Node.js + Express)

#### 🔐 **Authentication & User Management**
- **Multi-role system**: NGO, Citizen, Veterinarian accounts
- **JWT-based authentication** with secure token handling
- **Email/password login** with bcrypt encryption
- **User verification system** for NGOs and veterinarians

#### 🐕 **Dog Management System**
- **Complete dog profiles** with adoption status tracking
- **Medical history management** with veterinary records
- **Photo storage and management** 
- **Adoption application workflow**
- **Status updates** (Available, Pending, Adopted)

#### 🚨 **Emergency Report Processing**
- **Automated report routing** to nearest NGOs
- **Priority-based queue management**
- **GPS coordinate processing** and address resolution
- **Photo storage and AI analysis integration**
- **Status tracking** (Pending, In Progress, Resolved)
- **Update notifications** to reporters

#### 🏥 **Safe Zone Database**
- **Geospatial data management** for shelters, clinics, feeding spots
- **Community verification system** for location accuracy
- **Contact information and operating hours**
- **Filterable search** by type and location
- **User-generated content** with moderation

#### 💬 **Real-time Communication**
- **WebSocket integration** for instant messaging
- **Chat room management** with user roles
- **File transfer capabilities**
- **Message persistence and history**
- **Online status and typing indicators**

## 🚀 Technology Stack

### Frontend
- **React 18** with modern hooks and context
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **React Router** for navigation
- **Leaflet/React-Leaflet** for interactive maps
- **Axios** for API communication
- **Socket.io-client** for real-time features

### Backend
- **Node.js** with Express.js framework
- **Socket.IO** for WebSocket communication
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password security
- **JSON-based storage** (development) - easily replaceable with database

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository
```bash
git clone <YOUR_GIT_URL>
cd street-dog-safety-app
```

### 2. Frontend Setup
```bash
# Navigate to frontend (project root)
npm install

# Start development server
npm run dev
```
Frontend runs on: **http://localhost:8080**

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```
Backend runs on: **http://localhost:5000**

### 4. Development Workflow
- **Frontend**: `npm run dev` (auto-reload on changes)
- **Backend**: `npm run dev` (nodemon auto-reload)
- **Production Build**: `npm run build` (frontend only)

## 📱 Usage Guide

### For Citizens
1. **Report Emergency**: Use the report page to quickly alert NGOs about injured dogs
2. **Find Adoptable Dogs**: Browse the adoption center to find your next companion
3. **Locate Safe Zones**: Use the map to find nearby feeding spots, shelters, and clinics
4. **Connect with NGOs**: Chat directly with rescue organizations for updates

### For NGOs
1. **Manage Rescue Operations**: Receive and respond to emergency reports
2. **Post Adoptable Dogs**: Add dog profiles to the adoption center
3. **Coordinate with Volunteers**: Use chat system for team communication
4. **Update Safe Zones**: Add and verify locations in your area

### For Veterinarians
1. **Provide Medical Consultations**: Chat with NGOs about injured animals
2. **Update Medical Records**: Maintain health histories for rescued dogs
3. **Emergency Response**: Get notified about critical cases in your area

## 🤖 AI Integration

### Injury Detection System
- **Photo Analysis**: Uploaded images are analyzed for injury severity
- **Confidence Scoring**: AI provides 70-100% confidence ratings
- **Priority Classification**: Automatic urgency assignment based on detected injuries
- **Response Optimization**: Helps NGOs prioritize rescue efforts

*Note: Current implementation uses AI placeholders - can be integrated with real computer vision APIs*

## 📊 Sample Data

The application comes pre-loaded with:
- **3 User Accounts** (NGO, Vet, Citizen)
- **3 Adoptable Dogs** with complete profiles
- **3 Safe Zone Locations** in Mumbai area
- **1 Sample Emergency Report** with status tracking

### Login Credentials
- **NGO**: `admin@pawshearts.org` / `password123`
- **Veterinarian**: `dr.sharma@vetcare.com` / `password123`  
- **Citizen**: `citizen@example.com` / `password123`

## 🌐 API Documentation

### Key Endpoints
```
Authentication:
POST /api/auth/register - Register new user
POST /api/auth/login    - User login

Dogs & Adoption:
GET  /api/dogs         - List all available dogs
POST /api/dogs/:id/adopt - Submit adoption application

Emergency Reports:
POST /api/reports      - Submit emergency report
GET  /api/reports      - Get user's reports

Safe Zones:
GET  /api/safezones    - List safe zones
POST /api/safezones    - Add new safe zone

Real-time Chat:
GET  /api/messages/:chatId - Get chat history
POST /api/messages     - Send message
```

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/ui/     # Reusable UI components
├── pages/            # Main application pages
├── assets/           # Images and static files
├── hooks/            # Custom React hooks
└── lib/              # Utility functions
```

### Backend Architecture
```
backend/
├── server.js         # Main server file with all routes
├── uploads/          # File storage directory
└── package.json      # Dependencies and scripts
```

### Data Flow
1. **User Interaction** → Frontend React Components
2. **API Calls** → Axios HTTP requests to backend
3. **Authentication** → JWT token verification
4. **Data Processing** → Express.js route handlers
5. **Real-time Updates** → Socket.IO WebSocket connections
6. **File Storage** → Multer file upload handling

## 🔒 Security Features

- **JWT Authentication** with secure token management
- **Role-based Authorization** for different user types
- **Password Encryption** using bcrypt with salt
- **Input Validation** on both client and server
- **File Upload Security** with type and size restrictions
- **CORS Configuration** for cross-origin requests

## 🌟 Future Enhancements

### Phase 2 Features
- **Push Notifications** for urgent reports and updates
- **Advanced AI Integration** with real computer vision APIs
- **SMS/WhatsApp Integration** for wider accessibility
- **Volunteer Management** system with task assignment
- **Donation Integration** with payment gateways
- **Mobile App** development for Android/iOS

### Technical Improvements
- **Database Migration** from JSON to MongoDB/PostgreSQL
- **Cloud Storage** integration for photos (AWS S3/Cloudinary)
- **Advanced Analytics** dashboard for NGO insights
- **Automated Testing** suite implementation
- **Docker Containerization** for easier deployment
- **CI/CD Pipeline** setup

## 🤝 Contributing

We welcome contributions from developers, designers, and animal welfare advocates!

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow code style guidelines
4. Write tests for new features
5. Submit pull request with detailed description

### Areas for Contribution
- **Frontend Development**: React components, UI/UX improvements
- **Backend Development**: API enhancements, database optimization  
- **Mobile Development**: React Native app development
- **AI/ML Integration**: Computer vision for injury detection
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: User guides, API documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Animal Welfare NGOs** for their tireless work protecting street dogs
- **Veterinary Community** for providing medical care and expertise
- **Open Source Libraries** that made this project possible
- **React Community** for excellent documentation and support

---

**Made with ❤️ for our four-legged friends**

*Every dog deserves a safe street and a loving home. Together, we can make a difference.*
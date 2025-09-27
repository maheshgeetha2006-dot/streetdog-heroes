# Street Dog Safety App - Backend API

This is the Node.js/Express backend server for the Street Dog Safety App, providing REST APIs and real-time messaging functionality.

## Features

- **User Authentication** - JWT-based auth for Citizens, NGOs, and Veterinarians
- **Dog Management** - CRUD operations for adoptable dogs with medical history
- **Emergency Reporting** - Report injured/abandoned dogs with photo uploads and AI analysis
- **Safe Zone Mapping** - Community-driven database of shelters, clinics, and feeding spots
- **Real-time Chat** - WebSocket-based messaging between users
- **Role-based Access** - Different permissions for Citizens, NGOs, and Vets
- **AI Integration** - Simulated injury severity detection from uploaded photos

## Technology Stack

- **Node.js** with Express.js framework
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Multer** for file uploads
- **bcrypt** for password hashing
- **In-memory storage** (JSON objects for development)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/profile` - Get user profile (authenticated)

### Dogs & Adoption
- `GET /api/dogs` - Get all available dogs (with filters)
- `GET /api/dogs/:id` - Get specific dog details
- `POST /api/dogs/:id/adopt` - Submit adoption application

### Emergency Reports
- `POST /api/reports` - Submit emergency report with photos
- `GET /api/reports` - Get user's reports (role-filtered)
- `GET /api/reports/:id` - Get specific report details
- `PATCH /api/reports/:id/status` - Update report status

### Safe Zones
- `GET /api/safezones` - Get all safe zones (with type filter)
- `POST /api/safezones` - Add new safe zone

### Messaging
- `GET /api/messages/:chatId` - Get chat messages
- `POST /api/messages` - Send new message

## Installation & Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Server will run on**: `http://localhost:5000`

## Sample Data

The server comes pre-loaded with sample data:

### Sample Users
- **NGO**: `admin@pawshearts.org` / `password123`
- **Veterinarian**: `dr.sharma@vetcare.com` / `password123`
- **Citizen**: `citizen@example.com` / `password123`

### Sample Dogs
- Charlie (Indian Pariah, 2 years, Male, Mumbai)
- Bella (Mixed Breed, 1.5 years, Female, Delhi)
- Max (Labrador Mix, 3 years, Male, Bangalore)

### Sample Safe Zones
- Paws & Hearts Animal Shelter (Mumbai)
- VetCare Clinic (Mumbai)
- Community Feeding Point (Mumbai)

## File Uploads

- Photos are stored in `/uploads` directory
- Accessible via `/uploads/filename.jpg` 
- Maximum 5 files per report
- Supported formats: JPG, PNG, GIF

## Real-time Features

### WebSocket Events
- `connection` - User connects to socket
- `joinChat` - User joins specific chat room
- `sendMessage` - Send message to chat room
- `newMessage` - Receive new message
- `disconnect` - User disconnects

## AI Features

### Injury Detection Simulation
When photos are uploaded with reports:
1. AI analyzes images for injury severity
2. Returns confidence score (70-100%)
3. Categorizes as: minor injuries, severe trauma, possible fracture, or wounds requiring immediate attention
4. Helps prioritize emergency response

## Data Models

### User
```json
{
  "id": "string",
  "email": "string",
  "name": "string", 
  "role": "NGO|Vet|Citizen",
  "phone": "string",
  "address": "string",
  "verified": "boolean"
}
```

### Dog
```json
{
  "id": "string",
  "name": "string",
  "breed": "string",
  "age": "string",
  "gender": "Male|Female",
  "size": "Small|Medium|Large",
  "health": "Excellent|Good|Needs Care",
  "location": "string",
  "description": "string",
  "photos": ["string"],
  "adoptionStatus": "available|pending|adopted",
  "medicalHistory": [...]
}
```

### Report
```json
{
  "id": "string",
  "type": "injured|abandoned|aggressive|dead",
  "urgency": "low|medium|high|critical",
  "description": "string",
  "location": {
    "lat": "number",
    "lng": "number", 
    "address": "string"
  },
  "photos": ["string"],
  "status": "pending|in_progress|resolved",
  "aiAnalysis": {...}
}
```

### Safe Zone
```json
{
  "id": "string",
  "name": "string",
  "type": "shelter|veterinary|feeding_spot|rescue_center",
  "lat": "number",
  "lng": "number",
  "description": "string",
  "contact": "string",
  "timings": "string",
  "verified": "boolean"
}
```

## Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Role-based Authorization** - Endpoint access control
- **File Upload Validation** - Type and size restrictions
- **Input Validation** - Server-side validation for all inputs

## Development Notes

- **CORS enabled** for frontend on `localhost:8080`
- **Auto-reload** available with `npm run dev` 
- **Console logging** for debugging requests
- **Error handling** middleware for graceful failures

## Production Considerations

For production deployment, consider:
- Replace in-memory storage with proper database (MongoDB, PostgreSQL)
- Add Redis for session management
- Implement proper logging (Winston, Morgan)
- Add rate limiting and security middleware
- Set up proper environment variables
- Add automated testing suite
- Implement proper file storage (AWS S3, Cloudinary)
- Add email notifications for reports
- Implement push notifications
- Add proper error monitoring (Sentry)

## API Testing

You can test the API using tools like Postman or curl:

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"Citizen","phone":"+91 99999 99999","address":"Mumbai"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get dogs (use token from login)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/dogs
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.
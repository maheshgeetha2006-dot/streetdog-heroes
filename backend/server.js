const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'street-dog-safety-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// In-memory data storage (would be replaced with proper database)
let users = [
  {
    id: '1',
    email: 'admin@pawshearts.org',
    password: '$2b$10$IXUQ7ZUOrhqDgokg4DVuI.lNSzWGhzjIE', // password: 'password123'
    name: 'Paws & Hearts NGO',
    role: 'NGO',
    phone: '+91 98765 43210',
    address: 'Mumbai, Maharashtra',
    verified: true
  },
  {
    id: '2',
    email: 'dr.sharma@vetcare.com',
    password: '$2b$10$IXUQ7ZUOrhqDgokg4DVuI.lNSzWGhzjIE',
    name: 'Dr. Priya Sharma',
    role: 'Vet',
    phone: '+91 87654 32109',
    address: 'Mumbai, Maharashtra',
    verified: true
  },
  {
    id: '3',
    email: 'citizen@example.com',
    password: '$2b$10$IXUQ7ZUOrhqDgokg4DVuI.lNSzWGhzjIE',
    name: 'Rajesh Kumar',
    role: 'Citizen',
    phone: '+91 76543 21098',
    address: 'Mumbai, Maharashtra',
    verified: false
  }
];

let dogs = [
  {
    id: '1',
    name: 'Charlie',
    breed: 'Indian Pariah',
    age: '2 years',
    gender: 'Male',
    size: 'Medium',
    health: 'Excellent',
    location: 'Mumbai, Maharashtra',
    description: 'Charlie is a friendly and energetic dog who loves playing fetch. He\'s great with children and other dogs.',
    photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'],
    ngoId: '1',
    ngo: 'Paws & Hearts NGO',
    vaccinated: true,
    neutered: true,
    adoptionStatus: 'available',
    medicalHistory: [
      { date: '2024-01-15', procedure: 'Vaccination', vet: 'Dr. Sharma', notes: 'Annual vaccination completed' },
      { date: '2024-02-20', procedure: 'Health Checkup', vet: 'Dr. Sharma', notes: 'Excellent health condition' }
    ]
  },
  {
    id: '2',
    name: 'Bella',
    breed: 'Mixed Breed',
    age: '1.5 years',
    gender: 'Female',
    size: 'Small',
    health: 'Good',
    location: 'Delhi, NCR',
    description: 'Bella is a sweet and gentle companion, perfect for families. She\'s been rescued and is looking for her forever home.',
    photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'],
    ngoId: '1',
    ngo: 'Delhi Dog Rescue',
    vaccinated: true,
    neutered: false,
    adoptionStatus: 'available',
    medicalHistory: [
      { date: '2024-03-10', procedure: 'Rescue Treatment', vet: 'Dr. Patel', notes: 'Treated for minor injuries' }
    ]
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Labrador Mix',
    age: '3 years',
    gender: 'Male',
    size: 'Large',
    health: 'Excellent',
    location: 'Bangalore, Karnataka',
    description: 'Max is an intelligent and loyal companion. He knows basic commands and is great for active families.',
    photos: ['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=300&fit=crop'],
    ngoId: '1',
    ngo: 'Bangalore Animal Care',
    vaccinated: true,
    neutered: true,
    adoptionStatus: 'available',
    medicalHistory: [
      { date: '2024-02-05', procedure: 'Neutering', vet: 'Dr. Kumar', notes: 'Surgery completed successfully' },
      { date: '2024-03-15', procedure: 'Vaccination', vet: 'Dr. Kumar', notes: 'Up to date with vaccines' }
    ]
  }
];

let reports = [
  {
    id: 'RPT-001',
    type: 'injured',
    urgency: 'high',
    description: 'Dog with visible leg injury near Bandra Station',
    location: {
      lat: 19.0544,
      lng: 72.8405,
      address: 'Bandra Railway Station, Mumbai'
    },
    photos: [],
    reporterName: 'Priya Singh',
    reporterContact: '+91 99887 76655',
    reporterId: '3',
    timestamp: new Date('2024-01-20T10:30:00'),
    status: 'in_progress',
    assignedTo: '1',
    updates: [
      { timestamp: new Date(), user: 'System', message: 'Report created' },
      { timestamp: new Date(), user: 'NGO Team', message: 'Team dispatched to location' }
    ]
  }
];

let safeZones = [
  {
    id: '1',
    name: 'Paws & Hearts Animal Shelter',
    type: 'shelter',
    lat: 19.0760,
    lng: 72.8777,
    description: '24/7 animal shelter providing food, medical care, and adoption services',
    contact: '+91 98765 43210',
    timings: '24/7',
    verified: true,
    addedBy: '1'
  },
  {
    id: '2',
    name: 'VetCare Clinic',
    type: 'veterinary',
    lat: 19.0896,
    lng: 72.8656,
    description: 'Full-service veterinary clinic with emergency care for street animals',
    contact: '+91 87654 32109',
    timings: '9 AM - 8 PM',
    verified: true,
    addedBy: '2'
  },
  {
    id: '3',
    name: 'Community Feeding Point',
    type: 'feeding_spot',
    lat: 19.0825,
    lng: 72.8735,
    description: 'Regular feeding spot managed by local volunteers',
    contact: 'Volunteers WhatsApp Group',
    timings: '7 AM & 7 PM daily',
    verified: false,
    addedBy: '3'
  }
];

let messages = [
  {
    id: '1',
    senderId: '1',
    receiverId: '3',
    content: 'Thank you for reporting the injured dog at Bandra. Our team is on the way!',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    type: 'text',
    chatId: 'chat-1-3'
  },
  {
    id: '2',
    senderId: '3',
    receiverId: '1',
    content: 'The dog seems to have a leg injury. I can provide more photos if needed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'text',
    chatId: 'chat-1-3'
  }
];

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// AUTH ROUTES
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, phone, address } = req.body;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: (users.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      role,
      phone,
      address,
      verified: role === 'Citizen' // Auto-verify citizens, manual for NGO/Vet
    };

    users.push(newUser);

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        verified: newUser.verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// USER ROUTES
app.get('/api/users/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password, ...userProfile } = user;
  res.json(userProfile);
});

// DOG ROUTES
app.get('/api/dogs', (req, res) => {
  const { breed, size, location } = req.query;
  let filteredDogs = dogs.filter(dog => dog.adoptionStatus === 'available');

  if (breed && breed !== 'all') {
    filteredDogs = filteredDogs.filter(dog => dog.breed === breed);
  }
  if (size && size !== 'all') {
    filteredDogs = filteredDogs.filter(dog => dog.size === size);
  }
  if (location && location !== 'all') {
    filteredDogs = filteredDogs.filter(dog => dog.location === location);
  }

  res.json(filteredDogs);
});

app.get('/api/dogs/:id', (req, res) => {
  const dog = dogs.find(d => d.id === req.params.id);
  if (!dog) {
    return res.status(404).json({ error: 'Dog not found' });
  }
  res.json(dog);
});

app.post('/api/dogs/:id/adopt', authenticateToken, (req, res) => {
  const dogId = req.params.id;
  const dog = dogs.find(d => d.id === dogId);
  
  if (!dog) {
    return res.status(404).json({ error: 'Dog not found' });
  }

  if (dog.adoptionStatus !== 'available') {
    return res.status(400).json({ error: 'Dog is not available for adoption' });
  }

  // In a real app, this would create an adoption application
  // For now, we'll simulate the process
  dog.adoptionStatus = 'pending';
  
  res.json({ 
    message: 'Adoption application submitted successfully!',
    applicationId: `APP-${Date.now()}`,
    dogId: dogId
  });
});

// REPORT ROUTES
app.post('/api/reports', authenticateToken, upload.array('photos', 5), (req, res) => {
  try {
    const { type, urgency, description, location, reporterName, reporterContact } = req.body;
    
    const photos = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newReport = {
      id: `RPT-${Date.now()}`,
      type,
      urgency,
      description,
      location: JSON.parse(location), // Parse the JSON string
      photos,
      reporterName,
      reporterContact,
      reporterId: req.user.userId,
      timestamp: new Date(),
      status: 'pending',
      updates: [
        { timestamp: new Date(), user: 'System', message: 'Report created' }
      ]
    };

    // AI Injury Detection Simulation
    if (photos.length > 0) {
      const severityLevels = ['minor injuries', 'severe trauma', 'possible fracture', 'wounds requiring immediate attention'];
      const detectedSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
      
      newReport.aiAnalysis = {
        severity: detectedSeverity,
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        timestamp: new Date()
      };
    }

    reports.push(newReport);

    // Find nearest NGO and assign (simple distance calculation)
    const nearestNGO = users.find(u => u.role === 'NGO' && u.verified);
    if (nearestNGO) {
      newReport.assignedTo = nearestNGO.id;
      newReport.updates.push({
        timestamp: new Date(),
        user: 'System',
        message: `Assigned to ${nearestNGO.name}`
      });
    }

    res.status(201).json({
      message: 'Report submitted successfully',
      reportId: newReport.id,
      report: newReport
    });
  } catch (error) {
    console.error('Report creation error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.get('/api/reports', authenticateToken, (req, res) => {
  let userReports = reports;
  
  // Filter reports based on user role
  if (req.user.role === 'Citizen') {
    userReports = reports.filter(r => r.reporterId === req.user.userId);
  } else if (req.user.role === 'NGO') {
    userReports = reports.filter(r => r.assignedTo === req.user.userId || !r.assignedTo);
  }
  
  res.json(userReports);
});

app.get('/api/reports/:id', authenticateToken, (req, res) => {
  const report = reports.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  res.json(report);
});

app.patch('/api/reports/:id/status', authenticateToken, (req, res) => {
  const { status, message } = req.body;
  const report = reports.find(r => r.id === req.params.id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }

  report.status = status;
  report.updates.push({
    timestamp: new Date(),
    user: req.user.name || 'User',
    message: message || `Status changed to ${status}`
  });

  res.json({ message: 'Report updated successfully', report });
});

// SAFE ZONES ROUTES
app.get('/api/safezones', (req, res) => {
  const { type } = req.query;
  let filteredZones = safeZones;

  if (type && type !== 'all') {
    filteredZones = safeZones.filter(zone => zone.type === type);
  }

  res.json(filteredZones);
});

app.post('/api/safezones', authenticateToken, (req, res) => {
  const { name, type, lat, lng, description, contact, timings } = req.body;
  
  const newSafeZone = {
    id: (safeZones.length + 1).toString(),
    name,
    type,
    lat: parseFloat(lat),
    lng: parseFloat(lng),
    description,
    contact,
    timings,
    verified: false, // New locations need verification
    addedBy: req.user.userId
  };

  safeZones.push(newSafeZone);
  
  res.status(201).json({
    message: 'Safe zone added successfully',
    safeZone: newSafeZone
  });
});

// CHAT ROUTES
app.get('/api/messages/:chatId', authenticateToken, (req, res) => {
  const { chatId } = req.params;
  const chatMessages = messages.filter(m => m.chatId === chatId);
  res.json(chatMessages);
});

app.post('/api/messages', authenticateToken, (req, res) => {
  const { receiverId, content, type = 'text' } = req.body;
  
  const chatId = `chat-${Math.min(req.user.userId, receiverId)}-${Math.max(req.user.userId, receiverId)}`;
  
  const newMessage = {
    id: (messages.length + 1).toString(),
    senderId: req.user.userId,
    receiverId,
    content,
    timestamp: new Date(),
    type,
    chatId
  };

  messages.push(newMessage);
  
  // Emit to socket room
  io.to(chatId).emit('newMessage', newMessage);
  
  res.status(201).json(newMessage);
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  socket.on('sendMessage', (messageData) => {
    const newMessage = {
      ...messageData,
      id: (messages.length + 1).toString(),
      timestamp: new Date()
    };
    
    messages.push(newMessage);
    io.to(messageData.chatId).emit('newMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Street Dog Safety API server running on port ${PORT}`);
  console.log(`Socket.IO server ready for real-time communication`);
  console.log('\n--- Sample API Endpoints ---');
  console.log('POST /api/auth/register - Register new user');
  console.log('POST /api/auth/login - Login user');
  console.log('GET  /api/dogs - Get all available dogs');
  console.log('POST /api/reports - Submit emergency report');
  console.log('GET  /api/safezones - Get safe zones');
  console.log('POST /api/messages - Send message');
  console.log('\n--- Sample Login Credentials ---');
  console.log('NGO: admin@pawshearts.org / password123');
  console.log('Vet: dr.sharma@vetcare.com / password123');
  console.log('Citizen: citizen@example.com / password123');
});

module.exports = app;
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Database file setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface UserRecord {
  id: string;
  name: string;
  email: string;
  collegeId?: string;
  password?: string;
  college: string;
  city: string;
  avatarUrl: string;
  bio: string;
  skillsOffered: string[];
  skillsWanted: string[];
  coinBalance: number;
  languages: string[];
  availability: string;
  rating: number;
  reviewCount: number;
  isProfileComplete: boolean;
  isOnline: boolean;
  lastActive: string;
  isReported?: boolean;
  isBlocked?: boolean;
  isAdmin?: boolean;
  isGuest?: boolean;
  dailyCheckInClaimed?: boolean;
  createdAt?: number;
  lastLoginAt?: number;
  registrationDevice?: string;
}

interface LoginLogRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  collegeId?: string;
  type: 'REGISTRATION' | 'LOGIN' | 'SIGN_IN';
  timestamp: number;
  details?: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  loginLogs: LoginLogRecord[];
  adminNotice: string | null;
  lastUpdated: number;
}

const SEED_USERS: UserRecord[] = [
  {
    id: 'student_1',
    name: 'Priyanka Jena',
    email: 'priyanka.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-CS042',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: "Computer Science student at Shailabala Women's Autonomous College, Cuttack. Excited to trade Python, Java, and Web Development skills.",
    skillsOffered: ['Python', 'HTML', 'Java'],
    skillsWanted: ['Spoken English', 'Presentation', 'Project Management'],
    coinBalance: 100,
    languages: ['Odia', 'English', 'Hindi'],
    availability: 'Flexible',
    rating: 5.0,
    reviewCount: 12,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: false,
    isGuest: false,
    createdAt: Date.now() - 86400000 * 3,
    lastLoginAt: Date.now() - 3600000 * 2
  },
  {
    id: 'student_2',
    name: 'Subhashree Dash',
    email: 'subhashree.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-CS055',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    bio: "Computer Science 3rd Year student at Shailabala Women's College. Specialized in Core Java, OOPs, and CSS layouts.",
    skillsOffered: ['Java', 'CSS', 'HTML'],
    skillsWanted: ['Python', 'Project Management'],
    coinBalance: 140,
    languages: ['Odia', 'English', 'Hindi'],
    availability: 'Evenings & Weekends',
    rating: 4.9,
    reviewCount: 8,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false,
    createdAt: Date.now() - 86400000 * 4,
    lastLoginAt: Date.now() - 3600000 * 5
  },
  {
    id: 'student_3',
    name: 'Ananya Pattnaik',
    email: 'ananya.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2024-ENG012',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: "English Department student at SBWAC. Passionate about helping fellow students master Spoken English fluency and interview communication.",
    skillsOffered: ['Spoken English', 'Presentation'],
    skillsWanted: ['HTML', 'CSS'],
    coinBalance: 180,
    languages: ['English', 'Odia', 'Hindi'],
    availability: '4 PM - 7 PM Daily',
    rating: 5.0,
    reviewCount: 14,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false,
    createdAt: Date.now() - 86400000 * 5,
    lastLoginAt: Date.now() - 3600000 * 8
  },
  {
    id: 'student_4',
    name: 'Sweta Mohanty',
    email: 'sweta.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-ECO034',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    bio: "Economics Major & College Activity Coordinator. I teach Project Management, Agile group planning, and Excel Data Analysis.",
    skillsOffered: ['Project Management', 'Presentation'],
    skillsWanted: ['Python', 'Java'],
    coinBalance: 120,
    languages: ['Odia', 'English'],
    availability: 'Flexible / Weekends',
    rating: 4.8,
    reviewCount: 6,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: false,
    isGuest: false,
    createdAt: Date.now() - 86400000 * 6,
    lastLoginAt: Date.now() - 3600000 * 12
  },
  {
    id: 'student_5',
    name: 'Tapaswini Behera',
    email: 'tapaswini.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2024-IT019',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    bio: "IT student focusing on frontend web technologies: HTML5, modern CSS flex/grid, and JavaScript basics.",
    skillsOffered: ['HTML', 'CSS'],
    skillsWanted: ['Spoken English', 'Presentation'],
    coinBalance: 110,
    languages: ['Odia', 'English'],
    availability: '5 PM - 8 PM',
    rating: 4.9,
    reviewCount: 5,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false,
    createdAt: Date.now() - 86400000 * 7,
    lastLoginAt: Date.now() - 3600000 * 18
  },
  {
    id: 'student_6',
    name: 'Lipsa Nayak',
    email: 'lipsa.sbwc@shailabalawomenscollege.ac.in',
    collegeId: 'SBWAC-2023-MATH008',
    password: 'password123',
    college: "Shailabala Women's Autonomous College, Cuttack",
    city: 'Cuttack, Odisha',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    bio: "Mathematics Department student at Shailabala. Excited to teach Applied Mathematics, Probability, and Python math scripting.",
    skillsOffered: ['Python', 'Math & Statistics'],
    skillsWanted: ['Java', 'Spoken English'],
    coinBalance: 150,
    languages: ['Odia', 'English', 'Hindi'],
    availability: 'Morning & Evening slots',
    rating: 5.0,
    reviewCount: 9,
    isProfileComplete: true,
    isOnline: true,
    lastActive: 'Online Now',
    dailyCheckInClaimed: true,
    isGuest: false,
    createdAt: Date.now() - 86400000 * 8,
    lastLoginAt: Date.now() - 3600000 * 24
  }
];

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        users: SEED_USERS,
        loginLogs: SEED_USERS.map((u) => ({
          id: `log_init_${u.id}`,
          userId: u.id,
          userName: u.name,
          userEmail: u.email,
          collegeId: u.collegeId,
          type: 'REGISTRATION',
          timestamp: u.createdAt || Date.now() - 86400000,
          details: 'Verified Student Enrollment'
        })),
        adminNotice: "Welcome Shailabala Students! Swap Python, Java, Spoken English, and Project skills with peers. Earn +100 Skill Coins on student verification.",
        lastUpdated: Date.now()
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
      return initialDb;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure all seed users exist if missing
    if (Array.isArray(parsed.users)) {
      const existingIds = new Set(parsed.users.map((u: any) => u.id));
      const missing = SEED_USERS.filter((s) => !existingIds.has(s.id));
      if (missing.length > 0) {
        parsed.users.push(...missing);
        writeDb(parsed);
      }
    }
    return parsed;
  } catch (err) {
    console.error('Error reading DB, using defaults:', err);
    return {
      users: SEED_USERS,
      loginLogs: [],
      adminNotice: null,
      lastUpdated: Date.now()
    };
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.lastUpdated = Date.now();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to DB file:', err);
  }
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// GET /api/users - returns all registered user accounts
app.get('/api/users', (req, res) => {
  const db = readDb();
  res.json({ success: true, users: db.users, count: db.users.length });
});

// GET /api/users/login-activity - returns real-time login & creation audit log
app.get('/api/users/login-activity', (req, res) => {
  const db = readDb();
  const sorted = [...(db.loginLogs || [])].sort((a, b) => b.timestamp - a.timestamp);
  res.json({ success: true, logs: sorted });
});

// POST /api/users/register - when someone creates a student account anywhere
app.post('/api/users/register', (req, res) => {
  const db = readDb();
  const userData = req.body;

  if (!userData || !userData.name || !userData.email) {
    return res.status(400).json({ success: false, error: 'Name and email are required' });
  }

  const cleanEmail = userData.email.trim().toLowerCase();
  const existingUserIdx = db.users.findIndex((u) => u.email.toLowerCase() === cleanEmail);

  const newUser: UserRecord = {
    ...userData,
    id: userData.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    createdAt: userData.createdAt || Date.now(),
    lastLoginAt: Date.now(),
    isGuest: false,
    coinBalance: typeof userData.coinBalance === 'number' ? userData.coinBalance : 100
  };

  if (existingUserIdx >= 0) {
    // Update existing
    db.users[existingUserIdx] = { ...db.users[existingUserIdx], ...newUser };
  } else {
    // Insert new created account at beginning
    db.users.unshift(newUser);
  }

  // Log registration activity
  const log: LoginLogRecord = {
    id: `log_reg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    userId: newUser.id,
    userName: newUser.name,
    userEmail: newUser.email,
    collegeId: newUser.collegeId,
    type: 'REGISTRATION',
    timestamp: Date.now(),
    details: `New student account created with Roll ID ${newUser.collegeId || 'N/A'}`
  };
  db.loginLogs = [log, ...(db.loginLogs || [])].slice(0, 500); // keep last 500

  writeDb(db);
  res.json({ success: true, user: newUser, allUsers: db.users });
});

// POST /api/users/login - record login timestamp & credentials validation
app.post('/api/users/login', (req, res) => {
  const db = readDb();
  const { emailOrId, collegeId, name, userId } = req.body;

  let matchedUser = db.users.find((u) => {
    if (userId && u.id === userId) return true;
    if (emailOrId) {
      const clean = emailOrId.trim().toLowerCase();
      if (u.email.toLowerCase() === clean) return true;
      if (u.name.toLowerCase() === clean) return true;
      if (u.collegeId && u.collegeId.toLowerCase() === clean) return true;
    }
    if (collegeId && u.collegeId && u.collegeId.toLowerCase() === collegeId.trim().toLowerCase()) return true;
    return false;
  });

  if (matchedUser) {
    matchedUser.lastLoginAt = Date.now();
    matchedUser.lastActive = 'Online Now';
    matchedUser.isOnline = true;

    // Log login activity
    const log: LoginLogRecord = {
      id: `log_login_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: matchedUser.id,
      userName: matchedUser.name,
      userEmail: matchedUser.email,
      collegeId: matchedUser.collegeId,
      type: 'LOGIN',
      timestamp: Date.now(),
      details: `Logged in successfully via College Roll ID / Email`
    };
    db.loginLogs = [log, ...(db.loginLogs || [])].slice(0, 500);

    writeDb(db);
    return res.json({ success: true, user: matchedUser, allUsers: db.users });
  }

  // If user wasn't registered in central db yet, but sent user object
  if (req.body.user) {
    const freshUser: UserRecord = {
      ...req.body.user,
      lastLoginAt: Date.now(),
      lastActive: 'Online Now',
      isOnline: true
    };
    db.users.unshift(freshUser);

    const log: LoginLogRecord = {
      id: `log_login_${Date.now()}`,
      userId: freshUser.id,
      userName: freshUser.name,
      userEmail: freshUser.email,
      collegeId: freshUser.collegeId,
      type: 'LOGIN',
      timestamp: Date.now(),
      details: 'Logged in and synced to central database'
    };
    db.loginLogs = [log, ...(db.loginLogs || [])].slice(0, 500);

    writeDb(db);
    return res.json({ success: true, user: freshUser, allUsers: db.users });
  }

  res.status(404).json({ success: false, error: 'User not found in central database' });
});

// POST /api/users/sync-all - batch synchronize users from client (merges created accounts)
app.post('/api/users/sync-all', (req, res) => {
  const db = readDb();
  const incomingUsers: UserRecord[] = req.body.users;

  if (Array.isArray(incomingUsers)) {
    incomingUsers.forEach((inc) => {
      if (!inc.id || inc.isGuest || inc.id === 'guest_student') return;
      const idx = db.users.findIndex((u) => u.id === inc.id || (u.email && u.email.toLowerCase() === (inc.email || '').toLowerCase()));
      if (idx >= 0) {
        db.users[idx] = { ...db.users[idx], ...inc };
      } else {
        db.users.unshift(inc);
      }
    });
    writeDb(db);
  }

  res.json({ success: true, users: db.users });
});

// PUT /api/users/:id - admin update student profile / coins / blocked status
app.put('/api/users/:id', (req, res) => {
  const db = readDb();
  const userId = req.params.id;
  const updates = req.body;

  const idx = db.users.findIndex((u) => u.id === userId);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Student not found' });
  }

  db.users[idx] = { ...db.users[idx], ...updates };
  writeDb(db);

  res.json({ success: true, user: db.users[idx], allUsers: db.users });
});

// DELETE /api/users/:id - admin delete student
app.delete('/api/users/:id', (req, res) => {
  const db = readDb();
  const userId = req.params.id;

  const prevLen = db.users.length;
  db.users = db.users.filter((u) => u.id !== userId);

  if (db.users.length === prevLen) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  writeDb(db);
  res.json({ success: true, message: 'User deleted successfully', allUsers: db.users });
});

// Notice get & set
app.get('/api/admin/notice', (req, res) => {
  const db = readDb();
  res.json({ notice: db.adminNotice });
});

app.post('/api/admin/notice', (req, res) => {
  const db = readDb();
  db.adminNotice = req.body.notice || null;
  writeDb(db);
  res.json({ success: true, notice: db.adminNotice });
});

// -------------------------------------------------------------
// VITE SPA MIDDLEWARE / STATIC SERVING
// -------------------------------------------------------------

async function setupFrontend() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: Number(PORT) },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('⚡ Vite dev middleware mounted');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('📦 Serving production static assets from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Student Skills Swap server running on http://0.0.0.0:${PORT}`);
  });
}

setupFrontend().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});

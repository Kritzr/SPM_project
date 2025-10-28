# Setup Instructions

This project consists of three main components that need to be integrated:

1. **Backend API** (Express + Prisma) - Port 8080
2. **Signaling Server** (Socket.io) - Port 5000
3. **React Client** - Port 3000

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database
- (Optional) Azure Blob Storage account

## Installation Steps

### 1. Install Root Dependencies

```bash
npm install
```

This will install `concurrently` which is needed to run all services together.

### 2. Install All Service Dependencies

```bash
npm run install:all
```

Or install individually:
```bash
cd backend && npm install
cd ../signaling-server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure Environment Variables

#### Backend Configuration

Create `backend/.env` file:

```bash
PORT=8080
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/database?schema=public"
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

#### Signaling Server Configuration

Create `signaling-server/.env` file:

```bash
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

#### Client Configuration

Create `client/.env` file:

```bash
REACT_APP_SERVER_URL=http://localhost:5000
REACT_APP_API_URL=http://localhost:8080/api
```

### 4. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Start the Application

#### Development Mode (All services together)

```bash
npm run dev
```

This will start:
- Backend API on http://localhost:8080
- Signaling Server on http://localhost:5000
- React Client on http://localhost:3000

#### Or run services individually in separate terminals:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Signaling Server
npm run dev:signaling

# Terminal 3 - React Client
npm run dev:client
```

## Project Structure

```
SPM_project/
├── backend/                 # Express API Server
│   ├── src/
│   │   ├── routes/         # API Routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── signaling-server/       # Socket.io Server (WebRTC signaling)
│   ├── server.js
│   └── package.json
│
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   └── context/        # React context
│   └── package.json
│
└── package.json            # Root package with scripts
```

## Services

### Backend API (Port 8080)

Provides REST API for:
- Authentication (`/api/auth`)
- Groups (`/api/groups`)
- Meetings (`/api/meetings`)
- Attendance (`/api/attendance`)
- File uploads (`/api/files`)

### Signaling Server (Port 5000)

WebSocket server for:
- WebRTC signaling
- Real-time chat
- User presence
- Video/audio toggle events

### React Client (Port 3000)

Frontend application with:
- Video conferencing
- Chat functionality
- Screen sharing
- Collaborative whiteboard

## Troubleshooting

### Port conflicts
If a port is already in use, update the PORT in the respective `.env` file.

### Database connection
Ensure PostgreSQL is running and the DATABASE_URL in `backend/.env` is correct.

### CORS issues
Update CLIENT_URL in backend and signaling server `.env` files to match your client URL.

## Production Deployment

1. Build the React client: `npm run build`
2. Set NODE_ENV=production in all `.env` files
3. Use a process manager like PM2 to run the services
4. Configure reverse proxy (nginx) to serve the client and proxy API requests


# Odin File Manager

A cloud-based file management system that allows users to securely store, organize, and access their files from anywhere.

## Features

- **User Authentication**: Secure login and registration system
- **File Organization**: Create folders to organize your files
- **File Management**: Upload, download, and delete files
- **Cloud Storage**: Files are stored securely in Cloudinary
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

### Backend
- Node.js with Express
- PostgreSQL database with Prisma ORM
- Passport.js for authentication
- Multer for file uploads
- Cloudinary for cloud storage

### Frontend
- EJS templates
- Custom CSS
- Responsive design

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Cloudinary account

### Installation

1. Clone the repository
```bash
git clone https://github.com/AnubhabMukherjee2003/odin-file
cd odin-file
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL=your_postgres_connection_string
DIRECT_URL=your_postgres_direct_connection
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Set up the database
```bash
npx prisma migrate deploy
```

5. Start the server
```bash
npm start
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with hot reload
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:studio`: Launch Prisma Studio for database management
- `npm run db:push`: Push schema changes to the database
- `npm run db:migrate`: Create and apply migrations
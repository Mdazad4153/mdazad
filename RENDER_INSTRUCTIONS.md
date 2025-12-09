# Render Deployment Instructions

This backend is now configured to be deployed on Render.com.

## Steps to Deploy

1. **Push your code to GitHub/GitLab.**
   Ensure this `backend` folder is in your repository.

2. **Create a new Web Service on Render.**
   - Connect your repository.
   - Select the directory if it's in a subdirectory (e.g., `backend`), or leave root if this is the root.

3. **Configure Settings:**
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`

4. **Add Environment Variables:**
   You MUST set these in the "Environment" tab on Render:

   - `MONGODB_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
     *   *The app will fail to start if this is missing.*
   - `JWT_SECRET`: A long, random string for security.
   - `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://my-portfolio.netlify.app`).
     *   *This is required for CORS to work correctly. If not set, it defaults to allowing all origins (less secure).*
   - `NODE_ENV`: Set this to `production`.

## Important Note on Uploads
This backend uses local file storage for uploaded images (`/uploads`).
**Render's free tier (and standard web services) uses an ephemeral filesystem.**
This means **uploaded files will vanish** every time you redeploy or the server restarts.
For a permanent solution, you should modify the `upload.js` middleware to upload files to a cloud storage service like **Cloudinary** or **AWS S3**.

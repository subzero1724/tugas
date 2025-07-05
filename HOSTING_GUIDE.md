# Database Hosting Guide

## 🚀 Quick Setup Options

### Option 1: Railway (Recommended - Free Tier)

1. **Sign up at [Railway.app](https://railway.app)**
2. **Create a new project**
3. **Add MySQL database service**
4. **Get connection details from Railway dashboard**
5. **Set environment variables:**
   \`\`\`env
   DB_PROVIDER=railway
   RAILWAY_DB_HOST=your-host.railway.app
   RAILWAY_DB_USER=root
   RAILWAY_DB_PASSWORD=your-password
   RAILWAY_DB_NAME=railway
   RAILWAY_DB_PORT=3306
   \`\`\`

### Option 2: PlanetScale (Serverless MySQL)

1. **Sign up at [PlanetScale.com](https://planetscale.com)**
2. **Create a new database**
3. **Create a branch (main)**
4. **Get connection string**
5. **Set environment variables:**
   \`\`\`env
   DB_PROVIDER=planetscale
   PLANETSCALE_HOST=your-db.planetscale.com
   PLANETSCALE_USERNAME=your-username
   PLANETSCALE_PASSWORD=your-password
   \`\`\`

### Option 3: Aiven (Cloud Database)

1. **Sign up at [Aiven.io](https://aiven.io)**
2. **Create MySQL service**
3. **Wait for service to start**
4. **Get connection details**
5. **Set environment variables:**
   \`\`\`env
   DB_PROVIDER=aiven
   AIVEN_HOST=your-service.aivencloud.com
   AIVEN_USER=avnadmin
   AIVEN_PASSWORD=your-password
   AIVEN_DATABASE=defaultdb
   AIVEN_PORT=3306
   \`\`\`

### Option 4: FreeSQLDatabase (Free MySQL)

1. **Visit [FreeSQLDatabase.com](https://www.freesqldatabase.com)**
2. **Create free account**
3. **Create database**
4. **Get connection details**
5. **Set environment variables:**
   \`\`\`env
   DB_PROVIDER=freesqldatabase
   FREE_DB_HOST=sql12.freesqldatabase.com
   FREE_DB_USER=your-username
   FREE_DB_PASSWORD=your-password
   FREE_DB_NAME=your-database
   FREE_DB_PORT=3306
   \`\`\`

## 🔧 Setup Steps

### 1. Choose Your Hosting Provider
Select one of the options above based on your needs:
- **Railway**: Best for beginners, generous free tier
- **PlanetScale**: Serverless, great for scaling
- **Aiven**: Enterprise-grade, reliable
- **FreeSQLDatabase**: Completely free, basic features

### 2. Configure Environment Variables
Add the environment variables to your hosting platform:

**For Vercel:**
- Go to your project settings
- Add environment variables in the "Environment Variables" section

**For Netlify:**
- Go to Site settings > Environment variables
- Add your database configuration

**For Railway:**
- Add variables in your service settings

### 3. Initialize Database
After deploying your app:
1. Visit `/setup` page on your deployed app
2. Click "Setup Database" button
3. Wait for automatic table creation and data insertion

### 4. Verify Setup
- Check database connection status on homepage
- Try creating a new invoice
- Verify data persistence

## 🌐 Deployment Platforms

### Deploy to Vercel (Recommended)
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
\`\`\`

### Deploy to Netlify
\`\`\`bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
\`\`\`

### Deploy to Railway
\`\`\`bash
# Connect your GitHub repo to Railway
# Railway will auto-deploy on git push
\`\`\`

## 🔒 Security Notes

1. **Never commit database credentials to git**
2. **Use environment variables for all sensitive data**
3. **Enable SSL connections when available**
4. **Regularly backup your database**
5. **Monitor database usage and limits**

## 📊 Database Limits

| Provider | Storage | Connections | Bandwidth |
|----------|---------|-------------|-----------|
| Railway | 1GB free | 100 | 100GB |
| PlanetScale | 5GB free | 1000 | 1TB |
| Aiven | 1 month free | Varies | Varies |
| FreeSQLDatabase | 5MB | 5 | Limited |

## 🆘 Troubleshooting

### Connection Issues
1. Check environment variables
2. Verify database service is running
3. Check firewall/security group settings
4. Test connection using database client

### Setup Issues
1. Visit `/api/test-db` to check connection
2. Use `/setup` page for automatic setup
3. Check logs for detailed error messages
4. Verify database permissions

### Performance Issues
1. Add database indexes
2. Optimize queries
3. Use connection pooling
4. Monitor database metrics

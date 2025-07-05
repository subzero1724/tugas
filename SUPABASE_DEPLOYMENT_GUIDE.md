# 🚀 Supabase Deployment Guide

## Step 1: Create Supabase Project

1. **Sign up at [supabase.com](https://supabase.com)**
2. **Click "New Project"**
3. **Choose your organization**
4. **Enter project details:**
   - Name: `invoice-management`
   - Database Password: (generate strong password)
   - Region: Choose closest to your users

## Step 2: Get API Keys

1. **Go to Settings → API**
2. **Copy these values:**
   - Project URL: `https://your-project.supabase.co`
   - Anon (public) key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - Service role (secret) key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Step 3: Run SQL Migrations

1. **Go to SQL Editor in Supabase Dashboard**
2. **Create new query**
3. **Copy and run `supabase/migrations/001_create_tables.sql`**
4. **Create another query**
5. **Copy and run `supabase/migrations/002_insert_sample_data.sql`**

## Step 4: Configure Environment Variables

### For Vercel:
\`\`\`bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
\`\`\`

### For Netlify:
1. Go to Site settings → Environment variables
2. Add the three environment variables

### For Railway:
1. Go to your service settings
2. Add environment variables in Variables tab

## Step 5: Deploy Your Application

### Deploy to Vercel (Recommended):
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and add environment variables
\`\`\`

### Deploy to Netlify:
\`\`\`bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=.next
\`\`\`

## Step 6: Test Your Deployment

1. **Visit your deployed app**
2. **Go to `/setup` page**
3. **Click "Test Supabase Connection"**
4. **Verify green success message**
5. **Test creating an invoice**

## 🔧 Supabase Features Used

### Database:
- **PostgreSQL** with full SQL support
- **Real-time subscriptions** for live updates
- **Row Level Security** for data protection
- **Automatic API generation**

### Performance:
- **Connection pooling** built-in
- **Global CDN** for fast access
- **Automatic backups**
- **Point-in-time recovery**

### Security:
- **JWT authentication** ready
- **Row-level security policies**
- **API key management**
- **SSL/TLS encryption**

## 📊 Free Tier Limits

- **Database**: 500MB storage
- **Bandwidth**: 5GB per month
- **API requests**: 50,000 per month
- **Authentication**: 50,000 monthly active users
- **Storage**: 1GB file storage

## 🔍 Monitoring & Maintenance

### Supabase Dashboard:
- **Database usage** monitoring
- **API logs** and analytics
- **Performance metrics**
- **Real-time activity**

### Backup Strategy:
- **Automatic daily backups** (7 days retention)
- **Point-in-time recovery** available
- **Manual backup** via pg_dump

## 🆘 Troubleshooting

### Common Issues:

1. **Connection Failed:**
   - Check environment variables
   - Verify API keys are correct
   - Ensure project is not paused

2. **Tables Not Found:**
   - Run SQL migrations in correct order
   - Check SQL Editor for errors
   - Verify table creation in Table Editor

3. **Permission Denied:**
   - Check Row Level Security policies
   - Verify service role key usage
   - Review API permissions

### Getting Help:
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [supabase.com/community](https://supabase.com/community)
- **GitHub Issues**: Report bugs and get help

## 🎉 Success!

Your invoice management system is now running on Supabase with:
- ✅ PostgreSQL database
- ✅ Real-time capabilities
- ✅ Automatic API endpoints
- ✅ Built-in authentication ready
- ✅ Global CDN delivery
- ✅ Automatic backups

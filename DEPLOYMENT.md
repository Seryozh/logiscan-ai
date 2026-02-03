# Deployment Guide

This guide covers deploying LogiScan AI to production environments.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the recommended platform for deploying Next.js applications with zero configuration.

### Prerequisites
- GitHub account
- Vercel account (free tier works great)
- OpenAI API key
- Supabase project

### Step-by-Step Deployment

1. **Prepare your repository**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure Environment Variables**

   In Vercel dashboard → Settings → Environment Variables, add:

   ```
   OPENAI_API_KEY=sk-your-openai-key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

   **Important:** Add these for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for build
   - Your app is live! 🎉

5. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain
   - Follow DNS instructions

### Continuous Deployment

Once connected, Vercel automatically:
- Deploys every push to `main` branch
- Creates preview deployments for PRs
- Rolls back instantly if needed

## 📱 PWA Installation

After deployment, users can install as a mobile app:

### iOS (Safari)
1. Open deployed URL in Safari
2. Tap Share button
3. Select "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open deployed URL in Chrome
2. Tap menu (three dots)
3. Select "Add to Home screen"
4. Tap "Add"

The app will now work offline and launch like a native app!

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Project**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Create new project
   - Save your database password

2. **Run Schema**
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `database/schema.sql`
   - Execute the SQL

3. **Get API Credentials**
   - Go to Settings → API
   - Copy "Project URL" → This is `NEXT_PUBLIC_SUPABASE_URL`
   - Copy "anon public" key → This is `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Configure Row Level Security (Production)**

   For production with authentication:
   ```sql
   -- Remove anonymous access policy
   DROP POLICY "Allow all operations for anon users" ON packages;

   -- Add authenticated user policies
   CREATE POLICY "Users can read their own packages"
     ON packages FOR SELECT
     USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert their own packages"
     ON packages FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   ```

## 🔐 Security Checklist

Before going to production:

- [ ] Environment variables stored securely (not in code)
- [ ] `.env` file in `.gitignore` (already configured)
- [ ] Supabase RLS policies configured for your use case
- [ ] API keys have appropriate spending limits
- [ ] Error messages don't expose sensitive info
- [ ] CORS configured if using custom domain

## 📊 Monitoring

### OpenAI API Usage
- Monitor at [platform.openai.com/usage](https://platform.openai.com/usage)
- Set up billing alerts
- Expected cost: ~$0.01-0.05 per scan (with compression)

### Supabase Database
- Monitor at Supabase dashboard → Database
- Check storage usage
- Review slow queries in Query Performance

### Vercel Analytics
- Enable in Vercel dashboard → Analytics
- Track page loads, API routes
- Monitor error rates

## 🐛 Troubleshooting

### Build Failures

**Error: "OPENAI_API_KEY is not defined"**
- Solution: Add environment variables in Vercel settings
- Make sure to add for all environments

**Error: "Module not found"**
- Solution: Delete `node_modules` and `package-lock.json`, run `npm install`

### Runtime Issues

**"No images detected" on scan**
- Check OpenAI API key is valid
- Verify API has available credits
- Ensure image is < 20MB after compression

**Database connection failed**
- Verify Supabase URL and anon key
- Check Supabase project is not paused (free tier auto-pauses after 7 days inactivity)
- Confirm RLS policies allow your operations

## 💰 Cost Estimates

### Monthly Costs (100 scans/day)

| Service | Cost | Notes |
|---------|------|-------|
| **Vercel** | $0 | Free tier sufficient |
| **Supabase** | $0 | Free tier: 500MB DB, 2GB bandwidth |
| **OpenAI API** | ~$30-50 | $0.01/scan with compression (~3K scans) |
| **Total** | ~$30-50/month | Scales with usage |

### Cost Optimization Tips

1. **Image Compression** (already implemented)
   - Reduces API costs by ~90%
   - Critical for production use

2. **Caching**
   - Client-side inventory cache reduces database queries
   - Service worker caches static assets

3. **Prompt Optimization**
   - Temperature = 0 reduces API retries
   - Strict schema reduces token usage

4. **Rate Limiting** (consider adding)
   - Prevent abuse
   - Control costs

## 🔄 Updates and Maintenance

### Updating Production

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically deploys within 1-2 minutes.

### Database Migrations

For schema changes:
1. Test in Supabase development project
2. Export SQL migration
3. Run in production Supabase project
4. Deploy app code that uses new schema

### Rollback

If something breaks:
1. Go to Vercel dashboard → Deployments
2. Find last working deployment
3. Click "..." menu → Promote to Production
4. Instant rollback! ✨

## 📞 Support

- **Vercel Issues:** [vercel.com/support](https://vercel.com/support)
- **Supabase Issues:** [supabase.com/support](https://supabase.com/support)
- **OpenAI Issues:** [help.openai.com](https://help.openai.com)

---

**Ready to deploy? Run through this checklist and you'll be live in minutes! 🚀**

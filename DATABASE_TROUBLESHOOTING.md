# Database Connection Troubleshooting

## Common Issue: Neon Database Sleep Mode

If you're using Neon's free tier, your database automatically goes to sleep after periods of inactivity. This can cause connection errors when the app tries to access the database.

### Symptoms:
```
PrismaClientInitializationError: Can't reach database server at `your-neon-db-url`
```

### Quick Fixes:

1. **Wake up the database manually:**
   ```bash
   npx prisma db push
   ```

2. **Or try to connect with Prisma Studio:**
   ```bash
   npx prisma studio
   ```

3. **Check database health:**
   ```bash
   npx prisma generate
   ```

### Automated Solutions:

The app now includes automatic database wake-up functionality:

- **Database Health Check**: Automatically checks if the database is responsive
- **Retry Logic**: Waits up to 3 attempts with delays to allow the database to wake up
- **Graceful Error Handling**: Shows user-friendly error messages with refresh options

### For Production:

Consider upgrading to a paid Neon plan or using a different database provider for production to avoid sleep mode issues.

### Environment Variables:

Make sure your `.env` file has the correct `DATABASE_URL`:
```
DATABASE_URL="postgresql://username:password@your-neon-url/database?sslmode=require"
```

### Testing Database Connection:

Run this command to test your database connection:
```bash
npx prisma db push
```

If successful, the database is awake and ready to use.

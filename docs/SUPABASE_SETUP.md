# Supabase Setup Guide for Ancient History Trivia

This guide explains how to set up Supabase for the Ancient History Trivia app to store and deliver questions on demand, replacing Firestore which is being discontinued on August 25, 2025.

## Table of Contents

1. [Overview](#overview)
2. [Creating a Supabase Project](#creating-a-supabase-project)
3. [Setting Up Database Tables](#setting-up-database-tables)
4. [Setting Up Storage Buckets](#setting-up-storage-buckets)
5. [Configuring Environment Variables](#configuring-environment-variables)
6. [Uploading Question Bundles](#uploading-question-bundles)
7. [Testing the Integration](#testing-the-integration)
8. [Security Considerations](#security-considerations)

## Overview

The Ancient History Trivia app uses Supabase for:

1. **Storing question bundle metadata** in the database
2. **Storing complete question bundles** in Storage
3. **Tracking user purchases and subscriptions** in the database
4. **Delivering questions on demand** to minimize local storage usage on mobile devices

This hybrid approach allows the app to:
- Minimize local storage usage
- Support offline access to purchased bundles
- Efficiently deliver questions to users
- Scale to handle many question bundles and users

## Creating a Supabase Project

1. Sign up for a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project:
   - Click "New Project"
   - Enter a name (e.g., "Ancient History Trivia")
   - Choose a region close to your target audience
   - Set a secure database password
   - Click "Create new project"
3. Wait for the project to be created (this may take a few minutes)
4. Once created, you'll be taken to the project dashboard

## Setting Up Database Tables

You can set up the required database tables in two ways:

### Option 1: Using the SQL Editor

1. In your Supabase project, go to the "SQL Editor" section
2. Create a new query and paste the following SQL:

```sql
-- Bundles table
CREATE TABLE bundles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price NUMERIC NOT NULL,
  question_count INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  format TEXT NOT NULL,
  version TEXT NOT NULL,
  release_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_current_version BOOLEAN DEFAULT TRUE,
  storage_path TEXT NOT NULL
);

-- Questions table (for metadata only, actual questions in Storage)
CREATE TABLE questions (
  id TEXT PRIMARY KEY,
  bundle_id TEXT REFERENCES bundles(id),
  difficulty TEXT NOT NULL,
  category TEXT NOT NULL,
  region TEXT,
  period TEXT,
  format TEXT NOT NULL
);

-- User purchases table
CREATE TABLE user_purchases (
  user_id TEXT NOT NULL,
  bundle_id TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, bundle_id)
);

-- User subscriptions table
CREATE TABLE user_subscriptions (
  user_id TEXT PRIMARY KEY,
  tier TEXT NOT NULL,
  period TEXT NOT NULL,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);
```

3. Click "Run" to execute the SQL and create the tables

### Option 2: Using the Enhanced Upload Script

The project includes an enhanced upload script that can create the tables automatically:

1. Install the required dependencies:
   ```bash
   yarn add dotenv @supabase/supabase-js
   ```

2. Create a `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Run the enhanced upload script:
   ```bash
   ts-node scripts/upload-bundles-to-supabase-enhanced.ts
   ```

## Setting Up Storage Buckets

1. In your Supabase project, go to the "Storage" section
2. Click "Create a new bucket"
3. Enter "trivia-bundles" as the bucket name
4. Choose "Private" for the bucket type
5. Click "Create bucket"

## Configuring Environment Variables

1. Copy the `.env.supabase.example` file to `.env`:
   ```bash
   cp .env.supabase.example .env
   ```

2. Update the `.env` file with your Supabase credentials:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_STORAGE_BUCKET=trivia-bundles
   ```

   You can find these values in your Supabase project settings:
   - Go to Project Settings > API
   - Copy the URL and anon key
   - For the service role key (used for admin operations), use the "service_role" key

3. For the client-side app, add the following to your `.env.local` file:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SUPABASE_STORAGE_BUCKET=trivia-bundles
   ```

## Uploading Question Bundles

The enhanced upload script (`scripts/upload-bundles-to-supabase-enhanced.ts`) handles:
1. Creating database tables if they don't exist
2. Creating the storage bucket if it doesn't exist
3. Uploading question bundles to storage
4. Updating bundle metadata in the database
5. Uploading sample questions to the questions table

To upload your question bundles:

1. Ensure your `.env` file is set up with the correct Supabase credentials
2. Run the script:
   ```bash
   ts-node scripts/upload-bundles-to-supabase-enhanced.ts
   ```

## Testing the Integration

1. Start the development server:
   ```bash
   yarn dev
   ```

2. Open the app in your browser
3. Navigate to the Store screen
4. Try to access a bundle
5. Check the browser console for logs from the QuestionService
6. Verify that questions are being loaded from Supabase

## Security Considerations

### Row-Level Security (RLS)

Supabase uses PostgreSQL's Row-Level Security to control access to data. You should set up RLS policies to ensure users can only access data they're authorized to see.

1. In your Supabase project, go to the "Authentication" section
2. Enable "Row Level Security" for all tables
3. Add policies for each table:

#### Bundles Table Policy

```sql
-- Anyone can read bundle metadata
CREATE POLICY "Public bundles are viewable by everyone" ON bundles
  FOR SELECT USING (true);

-- Only admins can insert/update/delete bundles
CREATE POLICY "Only admins can modify bundles" ON bundles
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
```

#### User Purchases Table Policy

```sql
-- Users can only view their own purchases
CREATE POLICY "Users can view their own purchases" ON user_purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Only the system can insert purchases
CREATE POLICY "Only system can insert purchases" ON user_purchases
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM admin_users));
```

#### User Subscriptions Table Policy

```sql
-- Users can only view their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Only the system can insert/update subscriptions
CREATE POLICY "Only system can modify subscriptions" ON user_subscriptions
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM admin_users));
```

### Storage Security

For the storage bucket:

1. Go to the "Storage" section
2. Select the "trivia-bundles" bucket
3. Go to "Policies"
4. Add the following policies:

#### Read Policy

```sql
-- Users can read bundles they've purchased
((auth.uid() IN (
  SELECT user_id FROM user_purchases WHERE bundle_id = SPLIT_PART(name, '_', 1)
)) OR (
  -- Or if they have an active subscription
  auth.uid() IN (
    SELECT user_id FROM user_subscriptions 
    WHERE is_active = true AND expires_at > NOW()
  )
))
```

#### Write Policy

```sql
-- Only admins can upload bundles
auth.uid() IN (SELECT user_id FROM admin_users)
```

## Conclusion

With Supabase set up according to this guide, the Ancient History Trivia app will have a robust, scalable, and efficient question storage and delivery system that minimizes local storage usage while providing excellent offline support.

This solution replaces Firestore (which is being discontinued on August 25, 2025) with a modern, open-source alternative that provides similar functionality with additional benefits.

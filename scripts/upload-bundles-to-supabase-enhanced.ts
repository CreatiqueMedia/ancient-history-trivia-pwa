// Enhanced script to upload trivia bundles to Supabase with database integration
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { QUESTION_BUNDLES } from '../src/data/bundles';
import { getQuestionsForBundle } from '../src/data/questions';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET_NAME = 'trivia-bundles';
const QUARTER = '2025-Q3';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

/**
 * Main function to upload bundles to Supabase
 */
async function uploadBundles() {
  console.log('Starting enhanced bundle upload process...');
  
  // Create the bucket if it doesn't exist
  const { data: bucketData, error: bucketError } = await supabase.storage.createBucket(BUCKET_NAME, {
    public: false,
    allowedMimeTypes: ['application/json'],
    fileSizeLimit: 5242880, // 5MB
  });
  
  if (bucketError && bucketError.message !== 'Bucket already exists') {
    console.error('Error creating bucket:', bucketError.message);
    process.exit(1);
  }
  
  console.log(`Bucket '${BUCKET_NAME}' ready for uploads`);
  
  // Process each bundle
  for (const bundle of QUESTION_BUNDLES) {
    await processBundle(bundle);
  }
  
  console.log('Bundle upload process completed successfully!');
}

/**
 * Process a single bundle
 */
async function processBundle(bundle: any) {
  console.log(`Processing bundle: ${bundle.id}`);
  
  // Get questions for this bundle
  const questions = getQuestionsForBundle(bundle.id);
  
  if (questions.length === 0) {
    console.warn(`No questions found for bundle ${bundle.id}, skipping...`);
    return;
  }
  
  // Create bundle file path
  const fileName = `${bundle.id}_${QUARTER}.json`;
  const storagePath = `bundles/${fileName}`;
  
  // Create bundle JSON with questions
  const bundleWithQuestions = {
    ...bundle,
    questions
  };
  
  // Upload bundle to Supabase Storage
  const fileBuffer = Buffer.from(JSON.stringify(bundleWithQuestions, null, 2));
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, { 
      upsert: true, 
      contentType: 'application/json' 
    });
  
  if (uploadError) {
    console.error(`Upload failed for bundle ${bundle.id}:`, uploadError.message);
    return;
  }
  
  console.log(`Successfully uploaded bundle ${bundle.id} to Storage at ${storagePath}`);
  
  // Update bundle metadata in database
  const { error: dbError } = await supabase
    .from('bundles')
    .upsert({
      id: bundle.id,
      name: bundle.name,
      description: bundle.description,
      category: bundle.category,
      subcategory: bundle.subcategory,
      price: bundle.price,
      question_count: bundle.questionCount,
      difficulty: bundle.difficulty,
      format: bundle.format,
      version: bundle.version,
      release_date: bundle.releaseDate,
      is_current_version: bundle.isCurrentVersion,
      storage_path: storagePath
    });
  
  if (dbError) {
    console.error(`Database update failed for bundle ${bundle.id}:`, dbError.message);
    return;
  }
  
  console.log(`Successfully updated database metadata for bundle ${bundle.id}`);
  
  // Upload sample questions to the questions table
  const sampleQuestions = questions.slice(0, 10);
  
  for (const question of sampleQuestions) {
    const { error: questionError } = await supabase
      .from('questions')
      .upsert({
        id: question.id,
        bundle_id: bundle.id,
        difficulty: question.difficulty,
        category: question.category,
        region: question.region,
        period: question.period,
        format: question.format || 'Multiple Choice'
      });
    
    if (questionError) {
      console.warn(`Failed to upload sample question ${question.id}:`, questionError.message);
    }
  }
  
  console.log(`Successfully uploaded ${sampleQuestions.length} sample questions for bundle ${bundle.id}`);
}

/**
 * Create database tables if they don't exist
 */
async function setupDatabase() {
  console.log('Setting up database tables...');
  
  // Create bundles table
  const { error: bundlesError } = await supabase.rpc('create_bundles_table_if_not_exists');
  
  if (bundlesError) {
    console.error('Error creating bundles table:', bundlesError.message);
    
    // Try direct SQL if RPC fails
    const { error: sqlError } = await supabase.from('_sql').select(`
      CREATE TABLE IF NOT EXISTS bundles (
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
    `);
    
    if (sqlError) {
      console.error('Error creating bundles table with direct SQL:', sqlError.message);
      process.exit(1);
    }
  }
  
  // Create questions table
  const { error: questionsError } = await supabase.rpc('create_questions_table_if_not_exists');
  
  if (questionsError) {
    console.error('Error creating questions table:', questionsError.message);
    
    // Try direct SQL if RPC fails
    const { error: sqlError } = await supabase.from('_sql').select(`
      CREATE TABLE IF NOT EXISTS questions (
        id TEXT PRIMARY KEY,
        bundle_id TEXT REFERENCES bundles(id),
        difficulty TEXT NOT NULL,
        category TEXT NOT NULL,
        region TEXT,
        period TEXT,
        format TEXT NOT NULL
      );
    `);
    
    if (sqlError) {
      console.error('Error creating questions table with direct SQL:', sqlError.message);
      process.exit(1);
    }
  }
  
  // Create user_purchases table
  const { error: purchasesError } = await supabase.rpc('create_user_purchases_table_if_not_exists');
  
  if (purchasesError) {
    console.error('Error creating user_purchases table:', purchasesError.message);
    
    // Try direct SQL if RPC fails
    const { error: sqlError } = await supabase.from('_sql').select(`
      CREATE TABLE IF NOT EXISTS user_purchases (
        user_id TEXT NOT NULL,
        bundle_id TEXT NOT NULL,
        purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, bundle_id)
      );
    `);
    
    if (sqlError) {
      console.error('Error creating user_purchases table with direct SQL:', sqlError.message);
      process.exit(1);
    }
  }
  
  // Create user_subscriptions table
  const { error: subscriptionsError } = await supabase.rpc('create_user_subscriptions_table_if_not_exists');
  
  if (subscriptionsError) {
    console.error('Error creating user_subscriptions table:', subscriptionsError.message);
    
    // Try direct SQL if RPC fails
    const { error: sqlError } = await supabase.from('_sql').select(`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        user_id TEXT PRIMARY KEY,
        tier TEXT NOT NULL,
        period TEXT NOT NULL,
        starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE
      );
    `);
    
    if (sqlError) {
      console.error('Error creating user_subscriptions table with direct SQL:', sqlError.message);
      process.exit(1);
    }
  }
  
  console.log('Database tables setup complete!');
}

// Run the script
async function main() {
  try {
    await setupDatabase();
    await uploadBundles();
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();

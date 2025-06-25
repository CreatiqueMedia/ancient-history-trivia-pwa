// Upload the exported trivia bundles JSON to Supabase Storage
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load your Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET_NAME = 'trivia-bundles';
const FILE_NAME = 'trivia-bundles-2025-Q3.json';
const LOCAL_PATH = path.join(__dirname, `../public/${FILE_NAME}`);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your environment.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function uploadBundle() {
  const fileBuffer = fs.readFileSync(LOCAL_PATH);
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(FILE_NAME, fileBuffer, { upsert: true, contentType: 'application/json' });
  if (error) {
    console.error('Upload failed:', error.message);
    process.exit(1);
  }
  console.log(`Successfully uploaded ${FILE_NAME} to Supabase Storage bucket '${BUCKET_NAME}'.`);
}

uploadBundle();

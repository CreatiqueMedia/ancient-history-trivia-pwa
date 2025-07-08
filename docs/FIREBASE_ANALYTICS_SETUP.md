# Firebase Analytics Setup Guide

## Getting Your Measurement ID

1. **Go to Firebase Console**: https://console.firebase.google.com/project/ancient-history-trivia
2. **Click "Analytics" in the left sidebar**
3. **If Analytics isn't set up yet:**
   - Click "Get started" 
   - Choose your Google Analytics account (or create one)
   - Accept the terms
   - Click "Enable Google Analytics"

4. **Once enabled, go to Project Settings**:
   - Click the gear icon (⚙️) in the top left
   - Go to "General" tab
   - Scroll down to "Your apps" section
   - Find your web app
   - Copy the "Measurement ID" (starts with G-XXXXXXXXXX)

## Adding the Measurement ID to Your Project

Add this to your environment variables:

```bash
# In your .env file or deployment environment
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Testing Analytics

Once you add the measurement ID and redeploy, you can test analytics:

1. **Firebase Console > Analytics > Realtime**
2. **Open your app in a browser**
3. **Navigate around, take a quiz, etc.**
4. **Check if events appear in the Realtime view**

## Debug Analytics (Development)

To see analytics events in development:

1. **Open browser DevTools**
2. **Go to Console tab**
3. **Look for `[Analytics]` messages**
4. **Events will be logged to console in development mode**

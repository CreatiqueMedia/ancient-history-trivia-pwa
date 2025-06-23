import React, { useEffect, useRef } from 'react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

interface FirebaseAuthUIProps {
  onSignInSuccess?: () => void;
}

const FirebaseAuthUI: React.FC<FirebaseAuthUIProps> = ({ onSignInSuccess }) => {
  const uiRef = useRef<HTMLDivElement>(null);
  const ui = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (!uiRef.current) return;

    // Initialize FirebaseUI only if it hasn't been initialized
    if (!ui.current) {
      ui.current = new firebaseui.auth.AuthUI(auth);
    }

    const uiConfig: firebaseui.auth.Config = {
      signInFlow: 'popup', // Force popup instead of redirect
      signInSuccessUrl: window.location.origin,
      signInOptions: [
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          customParameters: {
            prompt: 'select_account'
          }
        },
        {
          provider: FacebookAuthProvider.PROVIDER_ID
        },
        {
          provider: 'apple.com'
        },
        {
          provider: 'anonymous'
        }
      ],
      callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => {
          if (onSignInSuccess) {
            onSignInSuccess();
          }
          return false; // Don't redirect
        },
        signInFailure: (error) => {
          console.error('FirebaseUI sign-in failure:', error);
          return Promise.resolve();
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
      tosUrl: '/terms',
      privacyPolicyUrl: '/privacy'
    };

    // Start the UI
    ui.current.start(uiRef.current, uiConfig);

    // Cleanup function
    return () => {
      if (ui.current) {
        ui.current.reset();
      }
    };
  }, [onSignInSuccess]);

  return (
    <div>
      <div>FirebaseUI Loading...</div>
      <div ref={uiRef} className="firebaseui-container" />
    </div>
  );
};

export default FirebaseAuthUI;

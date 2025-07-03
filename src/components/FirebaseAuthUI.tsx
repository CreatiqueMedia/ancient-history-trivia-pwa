import React, { useEffect, useRef } from 'react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

// Custom CSS to hide Facebook button if it appears
const hideFacebookButtonStyle = `
  .firebaseui-idp-facebook,
  .firebaseui-idp-button[data-provider-id="facebook.com"],
  button[data-provider-id="facebook.com"],
  .firebaseui-list-item:has([data-provider-id="facebook.com"]),
  .firebaseui-idp-list .firebaseui-list-item:has(.firebaseui-idp-facebook) {
    display: none !important;
  }
  
  /* Hide any button with Facebook blue color or Facebook text */
  button[style*="#1877F2"],
  button[style*="rgb(24, 119, 242)"],
  .firebaseui-idp-button:has(.firebaseui-idp-text:contains("Facebook")),
  .firebaseui-idp-button.firebaseui-idp-facebook,
  .bg-\\[\\#1877F2\\] {
    display: none !important;
  }
  
  /* Hide any element containing Facebook text */
  *:contains("Facebook"),
  *:contains("facebook") {
    display: none !important;
  }
`;

interface FirebaseAuthUIProps {
  onSignInSuccess?: () => void;
}

const FirebaseAuthUI: React.FC<FirebaseAuthUIProps> = ({ onSignInSuccess }) => {
  const uiRef = useRef<HTMLDivElement>(null);
  const ui = useRef<firebaseui.auth.AuthUI | null>(null);

  useEffect(() => {
    if (!uiRef.current) return;

    // Inject CSS to hide Facebook button
    const styleElement = document.createElement('style');
    styleElement.id = 'hide-facebook-auth-styles';
    styleElement.textContent = hideFacebookButtonStyle;
    document.head.appendChild(styleElement);

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
        // Apple provider temporarily disabled - not configured in Firebase Console
        // {
        //   provider: 'apple.com'
        // },
        {
          provider: 'anonymous'
        }
        // Facebook provider removed - not configured in Firebase Console
        // To add Facebook: Enable Facebook provider in Firebase Console Authentication
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

    // Additional cleanup to remove Facebook buttons after UI loads
    const removeFacebookButtons = () => {
      const facebookButtons = document.querySelectorAll(
        '.firebaseui-idp-facebook, ' +
        'button[data-provider-id="facebook.com"], ' +
        'button[style*="#1877F2"], ' +
        'button[style*="rgb(24, 119, 242)"], ' +
        '.bg-\\[\\#1877F2\\]'
      );
      facebookButtons.forEach(button => {
        button.remove();
      });
    };

    // Run removal after a short delay to ensure UI is loaded
    const timeoutId = setTimeout(removeFacebookButtons, 1000);

    // Cleanup function
    return () => {
      if (ui.current) {
        ui.current.reset();
      }
      // Remove injected styles
      const injectedStyle = document.getElementById('hide-facebook-auth-styles');
      if (injectedStyle) {
        injectedStyle.remove();
      }
      clearTimeout(timeoutId);
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

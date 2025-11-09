import { useState } from 'react';
import { supabase, supabaseConfig } from '../lib/supabase';
import { LogIn } from 'lucide-react';

const { url: supabaseUrl, anonKey: supabaseAnonKey } = supabaseConfig;

type SupabaseAuthError = {
  message?: string;
  error_description?: string;
};

const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const authError = error as SupabaseAuthError;
    if (typeof authError.error_description === 'string') {
      return authError.error_description;
    }
    if (typeof authError.message === 'string') {
      return authError.message;
    }
  }
  return 'Failed to sign in. Please check your configuration.';
};

type OAuthProvider = 'google' | 'github';

export default function Login() {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    try {
      setLoadingProvider(provider);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      // Note: For implicit flow, the user will be redirected automatically
      // No need to handle data here as redirect happens automatically
    } catch (error: unknown) {
      console.error('Login error:', error);
      setError(extractErrorMessage(error));
      setLoadingProvider(null);
    }
    // Note: Don't set loading to false on success - user will be redirected
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Prompt Vault</h1>
            <p className="text-gray-300">AI Prompt Management System</p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-200 text-sm">
                {error}
              </div>
            )}

            {!supabaseUrl || !supabaseAnonKey ? (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-yellow-200 text-sm space-y-2">
                <p className="font-semibold">⚠️ Configuration Required</p>
                <p>
                  Please create a{' '}
                  <code className="bg-yellow-900/50 px-1 rounded">
                    .env.local
                  </code>{' '}
                  file in the frontend directory with:
                </p>
                <pre className="bg-black/30 p-2 rounded text-xs mt-2 overflow-x-auto">
                  {`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GITHUB_CLIENT_ID=your_github_client_id`}
                </pre>
                <p className="text-xs mt-2">
                  See{' '}
                  <code className="bg-yellow-900/50 px-1 rounded">
                    QUICK_START.md
                  </code>{' '}
                  for setup instructions.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  disabled={loadingProvider !== null}
                  className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProvider === 'google' ? (
                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleOAuthLogin('github')}
                  disabled={loadingProvider !== null}
                  className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingProvider === 'github' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.94.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.44-3.88-1.44-.53-1.37-1.3-1.74-1.3-1.74-1.06-.72.08-.7.08-.7 1.18.08 1.8 1.21 1.8 1.21 1.04 1.78 2.72 1.27 3.38.97.1-.75.41-1.27.75-1.56-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.44.11-3 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 2.9-.39c.99 0 1.99.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.56.23 2.71.11 3 .74.8 1.19 1.82 1.19 3.08 0 4.43-2.69 5.4-5.25 5.68.42.36.8 1.08.8 2.18 0 1.58-.01 2.86-.01 3.25 0 .31.21.67.8.56A10.5 10.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z"
                        />
                      </svg>
                      Sign in with GitHub
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-gray-400">
            Secure authentication powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
}

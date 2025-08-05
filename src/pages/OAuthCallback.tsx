import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const OAuthCallback = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing OAuth callback...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');
        const state = urlParams.get('state');

        console.log('OAuth callback received:', { code, error, state });

        if (error) {
          console.error('OAuth error:', error);
          setStatus('error');
          setMessage(`OAuth error: ${error}`);
          setTimeout(() => {
            window.location.href = '/assistants/communication';
          }, 3000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setStatus('error');
          setMessage('No authorization code received');
          setTimeout(() => {
            window.location.href = '/assistants/communication';
          }, 3000);
          return;
        }

        // Get provider from sessionStorage
        const provider = sessionStorage.getItem('oauth_provider') as 'google' | 'microsoft';
        if (!provider) {
          console.error('No provider found in sessionStorage');
          setStatus('error');
          setMessage('No provider information found');
          setTimeout(() => {
            window.location.href = '/assistants/communication';
          }, 3000);
          return;
        }

        console.log('Processing OAuth for provider:', provider);

        // Exchange code for tokens using Supabase function
        const { data, error: tokenError } = await supabase.functions.invoke('calendar-oauth', {
          body: {
            action: 'exchange_code',
            provider,
            code,
            redirect_uri: `${window.location.origin}/oauth/callback`
          }
        });

        if (tokenError) {
          console.error('Token exchange error:', tokenError);
          setStatus('error');
          setMessage(`Failed to exchange code: ${tokenError.message}`);
          setTimeout(() => {
            window.location.href = '/assistants/communication';
          }, 3000);
          return;
        }

        console.log('Token exchange successful:', data);

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          console.error('User not authenticated');
          setStatus('error');
          setMessage('User not authenticated');
          setTimeout(() => {
            window.location.href = '/assistants/communication';
          }, 3000);
          return;
        }

        // Create integration record
        const { data: integration, error: dbError } = await supabase
          .from('calendar_integrations')
          .insert({
            user_id: user.id,
            provider: provider,
            provider_account_id: `oauth_${provider}_${Date.now()}`,
            calendar_name: `${provider === 'google' ? 'Google' : 'Microsoft'} Calendar`,
            is_primary: false,
            sync_enabled: true,
            sync_direction: 'bidirectional',
            last_sync_at: new Date().toISOString()
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          setStatus('error');
          setMessage(`Failed to save integration: ${dbError.message}`);
          setTimeout(() => {
            window.location.href = '/assistants/communication';
          }, 3000);
          return;
        }

        console.log('Integration created successfully:', integration);

        // Clear sessionStorage
        sessionStorage.removeItem('oauth_provider');

        // Success - redirect back to communication assistant
        setStatus('success');
        setMessage(`${provider === 'google' ? 'Google' : 'Microsoft'} calendar connected successfully!`);
        
        setTimeout(() => {
          window.location.href = '/assistants/communication';
        }, 2000);

      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setTimeout(() => {
          window.location.href = '/assistants/communication';
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing OAuth</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="text-green-500 text-4xl mb-4">✓</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting back to app...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="text-red-500 text-4xl mb-4">✗</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
              <p className="text-gray-600">{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting back to app...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 
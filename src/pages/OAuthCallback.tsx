import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const OAuthCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            console.log('🔍 OAuthCallback: Page loaded!');
            console.log('🔍 OAuthCallback: URL:', window.location.href);
            console.log('🔍 OAuthCallback: Search params:', window.location.search);

            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const state = urlParams.get('state');
            const error = urlParams.get('error');

            console.log('🔍 OAuthCallback: Code:', code);
            console.log('🔍 OAuthCallback: State:', state);
            console.log('🔍 OAuthCallback: Error:', error);

            if (error) {
                console.error('OAuth error:', error);
                // Post error message to parent window
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'calendar-oauth-error',
                        error: error
                    }, window.location.origin);
                }
                window.close();
                return;
            }

            // If no code, send a test success message to see if the popup communication works
            if (!code) {
                console.log('🔍 OAuthCallback: No code found, sending test success message');
                if (window.opener) {
                    const testMessage = {
                        type: 'calendar-oauth-success',
                        provider: 'google',
                        code: 'test-code',
                        integration: {
                            id: 'test-integration',
                            provider: 'google',
                            provider_account_id: 'test-account',
                            calendar_name: 'Google Calendar (Test)',
                            is_primary: false,
                            sync_enabled: true,
                            sync_direction: 'bidirectional',
                            last_sync_at: new Date().toISOString()
                        }
                    };
                    console.log('🔍 OAuthCallback: Sending test message:', testMessage);
                    window.opener.postMessage(testMessage, window.location.origin);
                    setTimeout(() => {
                        console.log('🔍 OAuthCallback: Closing popup after test');
                        window.close();
                    }, 2000);
                }
                return;
            }

            if (code) {
                try {
                    console.log('OAuth callback received code:', code);

                    // Determine provider from URL or state
                    const provider = window.location.pathname.includes('google') ? 'google' : 'microsoft';
                    console.log('Determined provider:', provider);

                    // Create the integration record in the database
                    console.log('Getting current user...');
                    const { data: { user }, error: authError } = await supabase.auth.getUser();

                    if (authError) {
                        console.error('Auth error:', authError);
                        throw new Error(`Authentication failed: ${authError.message}`);
                    }

                    if (!user) {
                        console.error('No user found');
                        // Fallback: Create integration without user_id (will be updated by main app)
                        console.log('Creating integration without user_id as fallback...');
                        const { data: integration, error: dbError } = await supabase
                            .from('calendar_integrations')
                            .insert({
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
                            console.error('Database error details:', dbError);
                            console.error('Database error code:', dbError.code);
                            console.error('Database error message:', dbError.message);
                            console.error('Database error details:', dbError.details);
                            throw new Error(`Failed to create integration: ${dbError.message}`);
                        }

                        console.log('Integration created successfully (fallback):', integration);

                        // Success - post message to parent window
                        if (window.opener) {
                            console.log('Sending success message to parent window');
                            const successMessage = {
                                type: 'calendar-oauth-success',
                                provider,
                                code,
                                integration
                            };
                            console.log('Success message content:', successMessage);
                            window.opener.postMessage(successMessage, window.location.origin);
                            console.log('Success message sent, closing popup in 1 second...');
                            setTimeout(() => {
                                console.log('Closing popup window');
                                window.close();
                            }, 1000);
                        } else {
                            console.log('No opener found, redirecting to app');
                            window.location.href = '/assistants/communication';
                        }
                        return;
                    }

                    console.log('User authenticated:', user.id);

                    console.log('Creating integration record...');
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
                        console.error('Database error details:', dbError);
                        console.error('Database error code:', dbError.code);
                        console.error('Database error message:', dbError.message);
                        console.error('Database error details:', dbError.details);
                        throw new Error(`Failed to create integration: ${dbError.message}`);
                    }

                    console.log('Integration created successfully:', integration);

                    // Success - post message to parent window
                    if (window.opener) {
                        console.log('Sending success message to parent window');
                        const successMessage = {
                            type: 'calendar-oauth-success',
                            provider,
                            code,
                            integration
                        };
                        console.log('Success message content:', successMessage);
                        window.opener.postMessage(successMessage, window.location.origin);
                        console.log('Success message sent, closing popup in 1 second...');
                        setTimeout(() => {
                            console.log('Closing popup window');
                            window.close();
                        }, 1000);
                    } else {
                        // If no opener, redirect back to the app
                        console.log('No opener found, redirecting to app');
                        window.location.href = '/assistants/communication';
                    }
                } catch (error) {
                    console.error('OAuth callback error:', error);
                    if (window.opener) {
                        window.opener.postMessage({
                            type: 'calendar-oauth-error',
                            error: error.message
                        }, window.location.origin);
                    }
                    window.close();
                }
            } else {
                // No code provided
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'calendar-oauth-error',
                        error: 'No authorization code provided'
                    }, window.location.origin);
                }
                window.close();
            }
        };

        handleOAuthCallback();
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Processing OAuth callback...</p>
            </div>
        </div>
    );
}; 
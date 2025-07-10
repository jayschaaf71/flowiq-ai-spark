import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface InvitationEmailProps {
  email: string;
  role: string;
  inviterName?: string;
  signupUrl: string;
  tenantName?: string;
}

export const InvitationEmail = ({
  email,
  role,
  inviterName,
  signupUrl,
  tenantName = "FlowIQ Healthcare Platform"
}: InvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>You've been invited to join {tenantName}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with FlowIQ branding */}
        <Section style={header}>
          <div style={logoContainer}>
            <Text style={logo}>FlowIQ</Text>
            <Text style={tagline}>Healthcare Platform</Text>
          </div>
        </Section>

        {/* Main content */}
        <Section style={content}>
          <Heading style={h1}>You're Invited!</Heading>
          
          <Text style={greeting}>Hello,</Text>
          
          <Text style={paragraph}>
            {inviterName ? `${inviterName} has` : 'You have been'} invited you to join <strong>{tenantName}</strong> as a <strong>{role}</strong>.
          </Text>

          <Text style={paragraph}>
            FlowIQ streamlines healthcare operations with intelligent workflow automation, 
            patient management, and seamless communication tools designed specifically for healthcare professionals.
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Button href={signupUrl} style={button}>
              Accept Invitation & Join Team
            </Button>
          </Section>

          <Text style={paragraph}>
            Or copy and paste this link into your browser:
          </Text>
          
          <Section style={linkContainer}>
            <Text style={linkText}>{signupUrl}</Text>
          </Section>

          <Hr style={hr} />

          {/* Features highlight */}
          <Section style={featuresSection}>
            <Text style={featuresTitle}>What you'll get access to:</Text>
            <ul style={featuresList}>
              <li style={featureItem}>📊 Patient Management Dashboard</li>
              <li style={featureItem}>📅 Intelligent Appointment Scheduling</li>
              <li style={featureItem}>💬 Secure Team Communication</li>
              <li style={featureItem}>📋 Digital Forms & Documentation</li>
              <li style={featureItem}>📈 Analytics & Reporting</li>
            </ul>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This invitation will expire in 7 days. If you didn't expect this invitation, 
            you can safely ignore this email.
          </Text>

          <Text style={footerSecondary}>
            Need help? Contact our support team or visit our help center.
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerBranding}>
            Powered by <strong>FlowIQ</strong> - Healthcare Workflow Intelligence
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default InvitationEmail;

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#ffffff',
  borderRadius: '8px 8px 0 0',
  padding: '32px 40px 24px',
  borderBottom: '3px solid #06b6d4',
};

const logoContainer = {
  textAlign: 'center' as const,
};

const logo = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#06b6d4',
  margin: '0',
  lineHeight: '1',
};

const tagline = {
  fontSize: '14px',
  color: '#64748b',
  margin: '4px 0 0 0',
  fontWeight: '500',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '0 40px 40px',
  borderRadius: '0 0 8px 8px',
};

const h1 = {
  color: '#1e293b',
  fontSize: '28px',
  fontWeight: '700',
  margin: '32px 0 24px 0',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#334155',
  fontSize: '16px',
  margin: '0 0 16px 0',
};

const paragraph = {
  color: '#475569',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px 0',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#06b6d4',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  border: 'none',
  cursor: 'pointer',
};

const linkContainer = {
  backgroundColor: '#f1f5f9',
  borderRadius: '6px',
  padding: '16px',
  margin: '16px 0 24px 0',
};

const linkText = {
  color: '#475569',
  fontSize: '14px',
  lineHeight: '20px',
  wordBreak: 'break-all' as const,
  margin: '0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '24px 0',
};

const featuresSection = {
  margin: '24px 0',
};

const featuresTitle = {
  color: '#334155',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const featuresList = {
  margin: '0',
  paddingLeft: '0',
  listStyle: 'none',
};

const featureItem = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px 0',
  paddingLeft: '0',
};

const footer = {
  color: '#64748b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0 16px 0',
};

const footerSecondary = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0',
};

const footerSection = {
  backgroundColor: '#f8fafc',
  textAlign: 'center' as const,
  padding: '24px',
  borderRadius: '0 0 8px 8px',
};

const footerBranding = {
  color: '#64748b',
  fontSize: '12px',
  margin: '0',
};
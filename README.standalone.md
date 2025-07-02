# AppointmentIQ - Standalone Deployment

AppointmentIQ is an AI-powered appointment scheduling platform that can be deployed as a standalone application for healthcare practices, service businesses, and any organization requiring intelligent appointment management.

## 🚀 Features

- **AI-Powered Scheduling**: Intelligent conflict detection and resolution
- **Voice Booking**: Speak to book appointments naturally
- **Multi-Provider Support**: Manage multiple providers and resources
- **Waitlist Management**: Automated waitlist with smart notifications
- **Real-time Availability**: Live availability updates
- **Mobile Optimized**: Works seamlessly on all devices

## 🛠 Standalone Deployment

### Development

```bash
# Start standalone development server
npm run dev:standalone

# Access at http://localhost:8081
```

### Production Build

```bash
# Build standalone version
npm run build:standalone

# Preview production build
npm run preview:standalone
```

### Deployment Options

#### 1. Static Hosting (Netlify, Vercel, AWS S3)

```bash
npm run build:standalone
# Deploy the `dist-standalone` folder
```

#### 2. Docker Deployment

```dockerfile
FROM nginx:alpine
COPY dist-standalone /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. CDN Integration

The standalone build is optimized for CDN delivery with:
- Asset optimization and compression
- Cache-friendly file naming
- Preloaded critical resources

## ⚙️ Configuration

### Environment Variables

Create `.env.standalone` for custom configuration:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_TITLE=Your Practice Name
VITE_PRIMARY_COLOR=#3b82f6
VITE_ENABLE_VOICE_BOOKING=true
VITE_ENABLE_WAITLIST=true
```

### Branding Customization

Update `src/standalone-main.tsx` to customize:

```typescript
const tenantConfig = {
  branding: {
    primaryColor: '#your-color',
    name: 'Your Practice Name',
    logo: '/your-logo.png'
  },
  features: {
    voiceBooking: true,
    aiConflictResolution: true,
    multiProvider: true,
    waitlistManagement: true
  }
};
```

## 🏥 Use Cases

- **Medical Practices**: Doctors, dentists, specialists
- **Wellness Centers**: Spas, massage therapy, physical therapy
- **Service Businesses**: Consultants, advisors, coaches
- **Educational**: Tutoring, training sessions
- **Beauty & Personal Care**: Salons, barbershops, aesthetics

## 📱 Mobile PWA

AppointmentIQ can be installed as a Progressive Web App:

1. Open in mobile browser
2. Tap "Add to Home Screen"
3. Use like a native app

## 🔐 Security & Compliance

- HIPAA-compliant data handling
- End-to-end encryption for sensitive data
- Secure authentication and authorization
- Regular security audits and updates

## 🆘 Support

- **Documentation**: [docs.appointmentiq.ai](https://docs.appointmentiq.ai)
- **Support Email**: support@appointmentiq.ai
- **Community**: [community.appointmentiq.ai](https://community.appointmentiq.ai)

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ by the AppointmentIQ Team
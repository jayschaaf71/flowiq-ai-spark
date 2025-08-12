# SFTP Server Setup for Sleep Impressions ETL

## 🎯 **Overview**

We need to set up an SFTP server at `imports.flowiq.ai` to receive CSV files from Sleep Impressions and process them through our ETL pipeline.

## 🏗️ **Infrastructure Requirements**

### **Option 1: VPS/Dedicated Server (Recommended)**

**Server Specifications:**
- **OS**: Ubuntu 22.04 LTS
- **CPU**: 2 cores minimum
- **RAM**: 4GB minimum
- **Storage**: 50GB SSD
- **Network**: Public IP with domain `imports.flowiq.ai`

### **Option 2: Cloud SFTP Service**

**Services to Consider:**
- **AWS Transfer Family**: Managed SFTP service
- **Azure File Sync**: Microsoft's solution
- **Google Cloud Storage**: With SFTP gateway
- **DigitalOcean Spaces**: With SFTP access

## 🔧 **Manual Setup (Option 1)**

### **Step 1: Server Provisioning**

```bash
# Install Ubuntu 22.04 LTS
# Configure with public IP
# Set up domain DNS: imports.flowiq.ai → [SERVER_IP]
```

### **Step 2: Install SFTP Server**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install OpenSSH server
sudo apt install openssh-server -y

# Configure SSH for SFTP only
sudo nano /etc/ssh/sshd_config
```

**Add to sshd_config:**
```bash
# SFTP Configuration
Subsystem sftp internal-sftp
Match Group sftp
    ChrootDirectory /home/sftp
    ForceCommand internal-sftp
    AllowTcpForwarding no
    X11Forwarding no
    PasswordAuthentication yes
```

### **Step 3: Create SFTP User and Directory**

```bash
# Create sftp group
sudo groupadd sftp

# Create etl_si user
sudo useradd -m -d /home/sftp/etl_si -s /bin/false -G sftp etl_si

# Set password
sudo passwd etl_si

# Create directory structure
sudo mkdir -p /home/sftp/midwest/si/archive
sudo mkdir -p /home/sftp/midwest/si/outbound

# Set permissions
sudo chown -R etl_si:sftp /home/sftp/midwest
sudo chmod -R 755 /home/sftp
sudo chmod -R 775 /home/sftp/midwest/si

# Restart SSH service
sudo systemctl restart ssh
```

### **Step 4: Test SFTP Connection**

```bash
# Test from local machine
sftp etl_si@imports.flowiq.ai

# Test file upload
echo "test" > test.csv
sftp etl_si@imports.flowiq.ai
cd /midwest/si/
put test.csv
ls
rm test.csv
exit
```

## ☁️ **Cloud Setup (Option 2)**

### **AWS Transfer Family Setup**

```bash
# Create IAM role for SFTP
aws iam create-role --role-name SFTPUserRole --assume-role-policy-document file://trust-policy.json

# Create SFTP server
aws transfer create-server \
  --protocols SFTP \
  --identity-provider-type SERVICE_MANAGED \
  --endpoint-type PUBLIC \
  --domain S3

# Create SFTP user
aws transfer create-user \
  --server-id [SERVER_ID] \
  --user-name etl_si \
  --role SFTPUserRole \
  --home-directory /midwest/si \
  --policy file://sftp-policy.json
```

**sftp-policy.json:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowListingOfUserFolder",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket"
      ],
      "Condition": {
        "StringLike": {
          "s3:prefix": [
            "midwest/si/*"
          ]
        }
      }
    },
    {
      "Sid": "HomeDirObjectAccess",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket/midwest/si/*"
    }
  ]
}
```

## 🔐 **Security Configuration**

### **Firewall Setup**

```bash
# Configure UFW firewall
sudo ufw allow ssh
sudo ufw allow 22
sudo ufw enable

# Or use iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 21 -j DROP  # Block FTP
```

### **SSH Security**

```bash
# Disable root login
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no

# Use key-based authentication (optional)
ssh-keygen -t rsa -b 4096 -C "etl_si@flowiq.ai"
ssh-copy-id etl_si@imports.flowiq.ai

# Restart SSH
sudo systemctl restart ssh
```

## 📁 **Directory Structure**

```
/home/sftp/
└── midwest/
    └── si/
        ├── archive/          # Processed files
        ├── outbound/         # Future: status updates
        └── [CSV files]      # New files to process
```

**File Naming Convention:**
- `billing_log_YYYY-MM-DD.csv`
- `patient_visit_log_YYYY-MM-DD.csv`
- `insurance_pat_ref_YYYY-MM-DD.csv`
- `Claims_Report_YYYY-MM-DD.csv`

## 🔄 **Automation Setup**

### **File Monitoring Script**

```bash
#!/bin/bash
# /home/sftp/scripts/monitor_files.sh

SFTP_DIR="/home/sftp/midwest/si"
API_ENDPOINT="https://your-domain.vercel.app/api/etl/sleepimpressions"

# Check for new CSV files
for file in $SFTP_DIR/*.csv; do
    if [ -f "$file" ]; then
        echo "Found new file: $file"
        # Trigger ETL processing
        curl -X POST $API_ENDPOINT
        break
    fi
done
```

### **Cron Job for Monitoring**

```bash
# Add to crontab
crontab -e

# Check every 5 minutes for new files
*/5 * * * * /home/sftp/scripts/monitor_files.sh
```

## 🧪 **Testing Procedures**

### **Test File Upload**

```bash
# Create test files
cat > billing_log_2025-01-16.csv << EOF
Patient ID,Visit Date,CPT Code,Claim Amount
P001,2025-01-16,95810,1500.00
P002,2025-01-16,95811,1200.00
EOF

# Upload via SFTP
sftp etl_si@imports.flowiq.ai
cd /midwest/si/
put billing_log_2025-01-16.csv
ls
exit
```

### **Test ETL Processing**

```bash
# Trigger ETL manually
curl -X POST https://your-domain.vercel.app/api/etl/sleepimpressions

# Check database for processed data
psql -h your-db-host -U your-user -d your-db -c "
SELECT COUNT(*) FROM encounter WHERE source = 'sleepimpr';
"
```

## 📊 **Monitoring and Logging**

### **SFTP Logs**

```bash
# View SFTP access logs
sudo tail -f /var/log/auth.log | grep sftp

# Monitor file changes
inotifywait -m /home/sftp/midwest/si -e create,modify,delete
```

### **System Monitoring**

```bash
# Check disk usage
df -h /home/sftp

# Check SFTP service status
sudo systemctl status ssh

# Monitor network connections
netstat -tulpn | grep :22
```

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **Connection Refused**
   ```bash
   # Check SSH service
   sudo systemctl status ssh
   
   # Check firewall
   sudo ufw status
   ```

2. **Permission Denied**
   ```bash
   # Check file permissions
   ls -la /home/sftp/midwest/si/
   
   # Fix permissions
   sudo chown -R etl_si:sftp /home/sftp/midwest
   sudo chmod -R 775 /home/sftp/midwest/si
   ```

3. **Authentication Failed**
   ```bash
   # Reset password
   sudo passwd etl_si
   
   # Check user exists
   id etl_si
   ```

## 📞 **Support Contacts**

- **Infrastructure**: [Your DevOps Team]
- **Domain DNS**: [Your Network Admin]
- **Security**: [Your Security Team]
- **Sleep Impressions**: [Their Technical Contact]

## ✅ **Setup Complete**

Once the SFTP server is operational, the Sleep Impressions ETL pipeline will be able to automatically process CSV files and integrate them into FlowIQ's revenue optimization system.

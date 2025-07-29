#!/bin/bash

# FlowIQ Monitoring Script
# Usage: ./scripts/monitor.sh [duration_minutes]

set -e

DURATION=${1:-60}  # Default to 60 minutes
INTERVAL=30  # Check every 30 seconds
LOG_FILE="monitoring-$(date +%Y%m%d-%H%M%S).log"

echo "🔍 Starting FlowIQ monitoring for $DURATION minutes..."
echo "📝 Log file: $LOG_FILE"
echo "⏱️ Check interval: $INTERVAL seconds"

# Initialize counters
total_checks=0
successful_checks=0
failed_checks=0
start_time=$(date +%s)

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check endpoint
check_endpoint() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
    
    if [ "$response" = "200" ]; then
        log "✅ $name: OK ($response)"
        return 0
    else
        log "❌ $name: FAILED ($response)"
        return 1
    fi
}

# Function to check performance
check_performance() {
    local url=$1
    local name=$2
    
    start_time_check=$(date +%s.%N)
    curl -s "$url" > /dev/null 2>&1
    end_time_check=$(date +%s.%N)
    load_time=$(echo "$end_time_check - $start_time_check" | bc)
    
    if (( $(echo "$load_time < 3.0" | bc -l) )); then
        log "⚡ $name: OK (${load_time}s)"
        return 0
    else
        log "🐌 $name: SLOW (${load_time}s)"
        return 1
    fi
}

# Main monitoring loop
log "🚀 Starting monitoring session..."

while true; do
    current_time=$(date +%s)
    elapsed_minutes=$(( (current_time - start_time) / 60 ))
    
    if [ $elapsed_minutes -ge $DURATION ]; then
        log "⏰ Monitoring duration reached. Stopping..."
        break
    fi
    
    log "🔍 Check #$((total_checks + 1)) (${elapsed_minutes}/${DURATION} minutes elapsed)"
    
    # Check main app
    check_endpoint "https://flowiq-ai-spark-diug6m0uf-flow-iq.vercel.app/health" "Main App Health" && ((successful_checks++)) || ((failed_checks++))
    ((total_checks++))
    
    # Check tenant routing
    check_endpoint "https://midwest-dental-sleep.flow-iq.ai" "Midwest Dental Sleep" && ((successful_checks++)) || ((failed_checks++))
    ((total_checks++))
    
    check_endpoint "https://west-county-spine.flow-iq.ai" "West County Spine" && ((successful_checks++)) || ((failed_checks++))
    ((total_checks++))
    
    # Check database connectivity
    check_endpoint "https://jnpzabmqieceoqjypvve.supabase.co/rest/v1/" "Database Connectivity" && ((successful_checks++)) || ((failed_checks++))
    ((total_checks++))
    
    # Performance checks (less frequent)
    if [ $((total_checks % 4)) -eq 0 ]; then
        check_performance "https://flowiq-ai-spark-diug6m0uf-flow-iq.vercel.app" "Main App Performance" && ((successful_checks++)) || ((failed_checks++))
        ((total_checks++))
    fi
    
    # Calculate success rate
    success_rate=$(( (successful_checks * 100) / total_checks ))
    log "📊 Current success rate: ${success_rate}% (${successful_checks}/${total_checks})"
    
    # Alert if success rate drops below 90%
    if [ $success_rate -lt 90 ]; then
        log "🚨 WARNING: Success rate below 90%!"
    fi
    
    # Wait for next check
    sleep $INTERVAL
done

# Final summary
log "📊 Monitoring Summary"
log "====================="
log "Total checks: $total_checks"
log "Successful: $successful_checks"
log "Failed: $failed_checks"
log "Final success rate: $(( (successful_checks * 100) / total_checks ))%"
log "Duration: $DURATION minutes"
log "Log file: $LOG_FILE"

if [ $success_rate -ge 95 ]; then
    log "🎉 Excellent system health!"
    exit 0
elif [ $success_rate -ge 90 ]; then
    log "✅ Good system health"
    exit 0
else
    log "⚠️ System health needs attention"
    exit 1
fi 
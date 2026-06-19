#!/bin/bash
# Upload Session 67 fixes to HostGator
# Usage: bash upload-fix.sh

set -e

echo "🔄 Uploading Session 67 fixes to jfsn.com..."

# Create temp FTP script
cat > /tmp/ftp-upload.txt << 'EOF'
open jfsn.com
user jeffery@jfsn.com
prompt
put search.js /search.js
put sw.js /sw.js
quit
EOF

# Run FTP upload
ftp -n < /tmp/ftp-upload.txt

# Cleanup
rm /tmp/ftp-upload.txt

echo "✅ Upload complete!"
echo "Next: Hard refresh archive.html in your browser (Cmd+Shift+R)"

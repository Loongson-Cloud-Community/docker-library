#!/bin/bash

# Set base URL and temp directory
BASE_URL="https://raw.githubusercontent.com/open-policy-agent/gatekeeper-library/master/library"
TEMP_DIR="tpl-tmp"
FINAL_DIR="charts/gatekeeper/charts/agent/files"
VALUES_FILE="charts/gatekeeper/charts/agent/values.yaml"

# Create directories if they don't exist
rm -rf "$TEMP_DIR"  # Clean up any existing temp directory
mkdir -p "$TEMP_DIR"
mkdir -p "$FINAL_DIR"

# Array to store all template names
TEMPLATE_NAMES=charts/gatekeeper/templates.txt

if [ -f "$TEMPLATE_NAMES" ]; then
  rm -f TEMPLATE_NAMES
fi

# Download function
download_templates() {
    local category=$1
    
    echo "Fetching $category templates..."
    
    # Use GitHub API to get directory list
    curl -s "https://api.github.com/repos/open-policy-agent/gatekeeper-library/contents/library/$category" | \
    grep "\"name\"" | \
    grep -v "template.yaml" | \
    awk -F'"' '{print $4}' | \
    while read -r dir; do
        echo "Downloading template from $category/$dir..."
        HTTP_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/$category/$dir/template.yaml" -o "$TEMP_DIR/${dir}.yaml")
        
        if [ "$HTTP_RESPONSE" = "200" ]; then
            echo "Successfully downloaded and renamed to ${dir}.yaml"
            echo "$dir" >> $TEMPLATE_NAMES
        else
            echo "Failed to download template for $dir (HTTP Status: $HTTP_RESPONSE)"
            rm -f "$TEMP_DIR/${dir}.yaml"
        fi
    done
}

# Download templates from general and pod-security-policy directories
for category in "general" "pod-security-policy"; do
    download_templates "$category"
done

# Create tar.gz archive (excluding hidden files)
echo "Creating tar.gz archive..."
cd "$TEMP_DIR"
if [[ "$OSTYPE" == "darwin"* ]]; then
    tar -czf "gatekeeper-templates.tar.gz" --exclude=".*" --exclude="._*" --no-mac-metadata --no-xattrs *.yaml
    # or 
    # COPYFILE_DISABLE=1 tar -czf "gatekeeper-templates.tar.gz" --exclude=".*" --exclude="._*" --no-xattrs *.yaml
else
    tar -czf "gatekeeper-templates.tar.gz" --exclude=".*" --exclude="._*" --no-xattrs *.yaml
fi

# Move archive to final directory and cleanup
mv "gatekeeper-templates.tar.gz" "../$FINAL_DIR/"
cd ..
rm -rf "$TEMP_DIR"
echo "Download completed. Templates archive is saved in $FINAL_DIR/gatekeeper-templates.tar.gz"
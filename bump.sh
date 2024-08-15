#!/bin/bash

# Get the current version from backend's package.json
current_version=$(jq -r '.version' backend/package.json)

# Extract the patch version number
patch_version=$(echo $current_version | cut -d. -f3)

# If the patch version number is greater than 4, increase the minor version number
if [ $patch_version -gt 4 ]; then
    # Increase the minor version in backend's package.json
    (cd backend && npm version minor)
else
    # Increase the patch version in backend's package.json
    (cd backend && npm version patch)
fi

# Get the new version from backend's package.json
new_version=$(jq -r '.version' backend/package.json)

# Update the version in frontend's package.json
jq --arg version "$new_version" '.version = $version' frontend/package.json > tmp.$$.json && mv tmp.$$.json frontend/package.json

# Print the new version
echo "Version bumped to $new_version in both backend and frontend directories."

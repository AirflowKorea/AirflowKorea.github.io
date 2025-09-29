#!/usr/bin/env node

import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ORGANIZERS_FILE = path.join(__dirname, '../public/data/organizers.yaml');

function sortOrganizers() {
  try {
    // Read the YAML file
    const fileContents = fs.readFileSync(ORGANIZERS_FILE, 'utf8');

    // Extract comments from the original file
    const lines = fileContents.split('\n');
    const headerComments = [];
    let commentIndex = 0;

    // Collect header comments (lines starting with #)
    while (
      commentIndex < lines.length &&
      lines[commentIndex].trim().startsWith('#')
    ) {
      headerComments.push(lines[commentIndex]);
      commentIndex++;
    }

    // Add empty line after comments if it exists
    if (commentIndex < lines.length && lines[commentIndex].trim() === '') {
      headerComments.push('');
      commentIndex++;
    }

    const data = yaml.load(fileContents);

    if (!data.organizers) {
      console.log('No organizers section found in the YAML file');
      return;
    }

    // Get generation keys and sort them by generation number (descending)
    const generationKeys = Object.keys(data.organizers)
      .filter(key => key.startsWith('generation_'))
      .sort((a, b) => {
        const numA = parseInt(a.split('_')[1]);
        const numB = parseInt(b.split('_')[1]);
        return numB - numA; // Descending order
      });

    // Create new sorted organizers object
    const sortedOrganizers = {};

    generationKeys.forEach(genKey => {
      const organizers = data.organizers[genKey];

      if (Array.isArray(organizers)) {
        // Sort organizers by name (가나다 순)
        const sortedOrganizerList = organizers.sort((a, b) => {
          return a.name.localeCompare(b.name, 'ko');
        });

        // Reassign ID values based on sorted order
        sortedOrganizerList.forEach((organizer, index) => {
          organizer.id = (index + 1).toString();
        });

        sortedOrganizers[genKey] = sortedOrganizerList;
      } else {
        sortedOrganizers[genKey] = organizers;
      }
    });

    // Update the data object
    data.organizers = sortedOrganizers;

    // Convert back to YAML with proper formatting
    const yamlString = yaml.dump(data, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    // Combine header comments with the YAML content
    const finalContent =
      headerComments.length > 0
        ? headerComments.join('\n') + '\n' + yamlString
        : yamlString;

    // Write back to file
    fs.writeFileSync(ORGANIZERS_FILE, finalContent, 'utf8');

    console.log('organizers.yaml has been sorted successfully');
    console.log(
      `- Generations sorted in descending order: ${generationKeys.join(', ')}`
    );
    generationKeys.forEach(genKey => {
      const count = data.organizers[genKey].length;
      console.log(
        `- ${genKey}: ${count} organizers sorted by name and re-numbered`
      );
    });
  } catch (error) {
    console.error('Error sorting organizers.yaml:', error.message);
    process.exit(1);
  }
}

// Run the function if this script is called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  sortOrganizers();
}

export { sortOrganizers };

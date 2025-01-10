// ./scripts/generate-controller.ts
import * as fs from 'fs';
import * as path from 'path';

const controllerName = process.argv[2];

if (!controllerName) {
    console.error('Please specify a controller name: npm run g:c <controller_name>');
    process.exit(1);
}

// Define paths and filenames
const controllerDir = path.join(__dirname, '../app/controllers', controllerName);
const files = [
    { name: `${controllerName}.controller.ts`, content: `// ${controllerName}.controller.ts\n\nexport const ${capitalize(controllerName)}Controllers = {}\n` },
    { name: `${controllerName}.route.ts`, content: `// ${controllerName}.route.ts\n\nimport { Router } from 'express';\n\nconst ${controllerName.toLowerCase()} = Router();\n\nexport const ${capitalize(controllerName)}Routes = ${controllerName.toLowerCase()};\n` },
    { name: `${controllerName}.services.ts`, content: `// ${controllerName}.services.ts\n\nexport const ${capitalize(controllerName)}Services = {}\n` },
    { name: `${controllerName}.validation.ts`, content: `// ${controllerName}.validation.ts\n\nexport const ${capitalize(controllerName)}Validation =  {};\n` },
];

// Utility function to capitalize the first letter of the controller name
function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Ensure the directory exists
if (!fs.existsSync(controllerDir)) {
    fs.mkdirSync(controllerDir, { recursive: true });
}

// Create each file in the directory
files.forEach(({ name, content }) => {
    const filePath = path.join(controllerDir, name);
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
});

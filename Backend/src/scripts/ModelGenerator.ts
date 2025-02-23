// ./scripts/generate-model.ts
import * as fs from "fs";
import * as path from "path";

const modelName = process.argv[2];

if (!modelName) {
  console.error("Please specify a model name: npm run g:m <model_name>");
  process.exit(1);
}

// Define paths and filenames
const modelDir = path.join(__dirname, "../app/models");
const validationDir = path.join(modelDir, "validations");

const files = [
  {
    path: path.join(modelDir, `${modelName}.model.ts`),
    content: `// ${modelName}.model.ts\n\nimport { Schema, model, Document } from 'mongoose';\n\ninterface I${capitalize(modelName)} extends Document {\n  // Define your schema properties here\n}\n\nconst ${modelName}Schema = new Schema<I${capitalize(modelName)}>({\n  // Define schema structure here\n});\n\nexport const ${capitalize(modelName)}Model = model<I${capitalize(modelName)}>('${capitalize(modelName)}', ${modelName}Schema);\n`,
  },
  {
    path: path.join(validationDir, `${modelName}.validation.ts`),
    content: `// ${modelName}.validation.ts\n\nimport { z } from 'zod';\n\nexport const ${modelName}ValidationSchema = z.object({\n  // Define your validation schema here\n});\n`,
  },
];

// Utility function to capitalize the first letter of the model name
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Ensure directories exist
[modelDir, validationDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Create each file in its respective directory
files.forEach(({ path, content }) => {
  fs.writeFileSync(path, content);
  console.log(`Created ${path}`);
});

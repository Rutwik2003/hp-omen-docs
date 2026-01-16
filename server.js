import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const CONTENT_DIR = path.join(__dirname, 'src', 'content');

// Helper to recursively get files
async function getFiles(dir) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(dirents.map((dirent) => {
    const res = path.resolve(dir, dirent.name);
    return dirent.isDirectory() ? getFiles(res) : res;
  }));
  return Array.prototype.concat(...files);
}

// GET: List all content files
app.get('/api/content', async (req, res) => {
  try {
    const files = await getFiles(CONTENT_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    // Read all files to metadata
    const content = await Promise.all(jsonFiles.map(async (filePath) => {
      const data = await fs.readFile(filePath, 'utf-8');
      const relativePath = path.relative(CONTENT_DIR, filePath);
      // Normalized path for frontend (e.g., "quickstart/setup.json")
      const id = relativePath.replace(/\\/g, '/'); 
      return {
        id,
        ...JSON.parse(data)
      };
    }));

    res.json(content);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Failed to list content' });
  }
});

// POST: Save content file
app.post('/api/save', async (req, res) => {
  const { id, content } = req.body;
  if (!id || !content) {
    return res.status(400).json({ error: 'Missing id or content' });
  }

  try {
    const filePath = path.join(CONTENT_DIR, id);
    
    // Ensure dir exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
    
    console.log(`Saved: ${id}`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    res.status(500).json({ error: 'Failed to save content' });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Custom Admin API running on http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'contacts.json');

function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/contacts', (req, res) => res.json(readData()));
app.get('/api/contacts/:id', (req, res) => {
  const c = readData().find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c);
});
app.post('/api/contacts', (req, res) => {
  const contacts = readData();
  const { name, email, phone } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const newContact = { id: uuidv4(), name, email: email || '', phone: phone || '' };
  contacts.push(newContact);
  writeData(contacts);
  res.status(201).json(newContact);
});
app.put('/api/contacts/:id', (req, res) => {
  const contacts = readData();
  const idx = contacts.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { name, email, phone } = req.body;
  contacts[idx] = { ...contacts[idx], name: name ?? contacts[idx].name, email: email ?? contacts[idx].email, phone: phone ?? contacts[idx].phone };
  writeData(contacts);
  res.json(contacts[idx]);
});
app.delete('/api/contacts/:id', (req, res) => {
  let contacts = readData();
  const idx = contacts.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = contacts.splice(idx, 1)[0];
  writeData(contacts);
  res.json(removed);
});

// Serve static client files from ../client for same-origin hosting (avoids CORS)
const clientDir = path.join(__dirname, '..', 'client');
if (fs.existsSync(clientDir)) {
  app.use(express.static(clientDir));
  // Fallback to index.html for client-side routing or root (avoid path pattern parsing issues)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    const indexPath = path.join(clientDir, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return next();
  });
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Contacts API & static server listening on http://localhost:${port}`));

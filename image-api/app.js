const express = require('express');
const multer = require('multer');
const cors = require('cors')
const path = require('path');
const app = express();
const PORT = 3000;
app.use(cors())


// Configuration de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/'); // Dossier de destination
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom du fichier
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Filtrer les fichiers par type MIME
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error('Fichier invalide. Seuls les images sont acceptées.'));
  },
});


// Middleware pour parser JSON (optionnel)
app.use(express.json());
app.use(express.static('public'));


// Route pour uploader une image
app.post('/upload', upload.single('image'), (req, res) => {
    console.log('ok');
    
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni ou fichier invalide.' });
  }
  res.status(200).json({
    message: 'Image uploadée avec succès.',
    file: req.file,
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});

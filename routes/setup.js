const multer = require('multer');

const loginRoute = require('./login');
const registerRoute = require('./register');
const userStoryTextMessagesRoutes = require('./userStoryTextMessages');
const usersRoutes = require('./users');
const storiesRoutes = require('./stories');
const uploadRoutes = require('./upload');

const setup = (app) => {
  const csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'csv-files');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  const upload = multer({ storage: csvStorage });  

  app.get("/", async (req, res) => { res.send("yo connected") });

  app.post("/login", loginRoute);
  app.post("/register", registerRoute);

  app.get('/users', usersRoutes.get)

  app.get('/userStoryTextMessages', userStoryTextMessagesRoutes.get);
  app.post('/userStoryTextMessages', userStoryTextMessagesRoutes.post);
  app.put('/userStoryTextMessages', userStoryTextMessagesRoutes.put);

  app.get('/stories', storiesRoutes.get);
  app.get('/stories/:id', storiesRoutes.getById);

  app.post('/upload', upload.single('csvFile'), uploadRoutes.post);
}

module.exports = setup;

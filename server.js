const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroMongoose = require('@admin-bro/mongoose')
require('dotenv').config();

const User = require('./models/User');
const Story = require('./models/Story');

const middleware = require('./routes/middleware');
const setupRoutes = require('./routes/setup');
const loginRoute = require('./routes/login');

const connectDatabase = async () => {
  await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('MongoDB successfully connected')
};

const initApp = async () => {
  const app = express();

  AdminBro.registerAdapter(AdminBroMongoose)
  const adminBro = new AdminBro({
    resources: [
    {
      resource: User,
      options: {
        properties: {
          password: { isVisible: false },
          token: { isVisible: false },
          _id: { isVisible: false },
          username: { isVisible: false },
          stories: {
            show: true,
            list: true,
            edit: false,
            filter: false,
          }
        },
        actions: {
          new: { isVisible: false },
          delete: { isVisible: false }
        }
      }
    },
    {
      resource: Story,
      name: 'Stories',
      options: {
        properties: {
          _id: { isVisible: false },
        },
        actions: {
          new: {
            component: AdminBro.bundle('./adminPanel/components/CreateStory')
          },
          show: {
            component: AdminBro.bundle('./adminPanel/components/ShowStory')
          },
          delete: { isVisible: false }
        }
      }
    }],
    locale: {
      translations: {
        labels: {
          Story: 'Stories',
        }
      }
    },
    branding: {
      logo: 'https://i.imgur.com/54YPLXH.png'
    },
    rootPath: '/admin',
  })
  
  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    authenticate: loginRoute.loginAdminPanel,
    cookiePassword: 'some-secret-password-used-to-secure-cookie',
  })

  app.use(adminBro.options.rootPath, router)
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(middleware.authenticateUser)

  setupRoutes(app);

  const port = process.env.PORT || 3000;
  app.listen(port, '10.0.0.74', () => console.log(`listening on port ${port}`));
  app.listen(8080, () => console.log('AdminBro is under localhost:8080/admin'));
}

module.exports = {
  initApp,
  connectDatabase,
}

// await Conversation.deleteMany({ storyId: '644343b8bc82ee6608552116' });
// await UserStoryTextMessages.deleteMany({ storyId: '644343b8bc82ee6608552116' });

// const story = new Story({
//     name: "Love at First Flight",
//     categories: ['Category1', 'Category2'],
//     author: "Peter Browne",
//     picture: "https://i.imgur.com/u4STAok.png",
//     description: "Description",
//     duration: "1 week",
//   });
//   story
//     .save()
//     .catch((err) => console.log(err));

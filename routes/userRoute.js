const userController = require('../controllers/userController');

const userRoutes = [
  {
    method: 'POST',
    path: '/create',
    handler: async (request, h) => {

          let password = request.payload.password;
          let confirmPassword = request.payload.confirmPassword;
          let email = request.payload.email;
          
         return email;
    },
    options: {
     
    }
  },
  {
    method: 'GET',
    path: '/list',
    handler: async (request, h) => {

          
         return {"key":"HELLO"};
    },
    options: {
     
    }
  }
];

module.exports = userRoutes;

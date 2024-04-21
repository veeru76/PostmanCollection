const express = require('express');
const request = require('request');
const app = express();

// Your route definitions go here...
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/users', (req, res) => {
  res.send("new user")
});

// Function to generate Postman collection
function generatePostmanCollection(appUrl, postmanApiKey) {
  const routes = [];

  // Collect route details
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const route = {
        path: middleware.route.path,
        method: Object.keys(middleware.route.methods).map((method) => method.toUpperCase()),
      };
      routes.push(route);
    }
  });

  // Create Postman collection
  const options = {
    method: 'POST',
    url: 'https://api.getpostman.com/collections',
    headers: {
      'X-Api-Key': postmanApiKey,
      'Content-Type': 'application/json',
    },
    body: {
      name: 'Routes Collection',
      description: 'A collection created from Express routes',
      requests: routes.map((route) => ({
        name: `${route.method.join(', ')} ${route.path}`,
        request: {
          url: `${appUrl}${route.path}`,
          method: route.method[0].toLowerCase(),
        },
      })),
    },
    json: true,
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode !== 200) {
        reject(new Error(`Postman API error: ${body.error}`));
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = generatePostmanCollection;

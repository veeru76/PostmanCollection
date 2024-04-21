const axios = require('axios');

// Function to generate Postman collection
async function generatePostmanCollection(appUrl, postmanApiKey) {
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
    data: {
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
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    throw new Error(`Postman API error: ${error.response.data.error}`);
  }
}

module.exports = generatePostmanCollection;

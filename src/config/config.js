const ENV = {
  development: {
    API_URL: 'http://localhost:3000/api',
  },
  staging: {
    API_URL: 'https://your-app-staging.vercel.app/api',
  },
  production: {
    API_URL: 'https://your-app.vercel.app/api',
  }
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};

export default getEnvVars();
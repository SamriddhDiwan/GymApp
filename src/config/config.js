const ENV = {
  development: {
    API_URL: 'http://10.0.2.2:3000/api',
  },
  staging: {
    API_URL: 'https://gym-app-wine-two.vercel.app/api',
  },
  production: {
    API_URL: 'https://gym-app-wine-two.vercel.app/api',
  }
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.development;
  }
  return ENV.production;
};

export default getEnvVars();
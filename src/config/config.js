const ENV = {
  development: {
    API_URL: 'https://gym-app-wine-two.vercel.app/api',
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
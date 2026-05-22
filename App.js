import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import authService from './src/services/authService.js';

// Screens
import AuthenticationStack from './src/screens/AuthenticationScreens/AuthenticationStacks.js';
import AppStack from './src/screens/AppFlow.js';
import SplashScreen from './src/screens/SplashScreen.js';
import { AuthContext } from './src/context/AuthContext.js';
const Stack = createNativeStackNavigator();
export default function App() {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoading: false,
            isSignout: false,
            loginError:"",
            registerError:""
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoading: false,
            isSignout: true,
            loginError:"",
            registerError:""
          };
        case 'LOGIN_ERROR':
          return {
            ...prevState,
            loginError: action.error,
          };
        case 'REGISTER_ERROR':
          return {
            ...prevState,
            registerError: action.error,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      isSignout: true,
      loginError: "",
      registerError: ""
    }
  );
  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const isAuthed = await authService.isAuthenticated();
      dispatch({ type: isAuthed ? 'SIGN_IN' : 'SIGN_OUT' });
    };
    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async ({ email, password }) => {
        try {
          await authService.login(email, password);
          dispatch({ type: 'SIGN_IN' });
        } catch (error) {
          dispatch({ type: 'LOGIN_ERROR', error: error.message ?? String(error) });
        }
      },
      signOut: async () => {
        await authService.logout();
        console.log("Sign out called");
        dispatch({ type: 'SIGN_OUT' })
      },
      signUp: async ({ name, email, password }) => {
        try {
          await authService.register(name, email, password);
          dispatch({ type: 'SIGN_IN' });
        } catch (error) {
          dispatch({ type: 'REGISTER_ERROR', error: error.message ?? String(error) });
        }
      },
    }),
    []
  );



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <AuthContext.Provider value={{ ...authContext, state }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#0B132B" },
            headerTintColor: '#fff',
            headerShown: false,
          }}
        >
          {
            state.isLoading ? <Stack.Screen name="Splash" component={SplashScreen} /> : (state.isSignout ? <Stack.Screen
              name="AuthenticationFlow"
              component={AuthenticationStack}
              options={{ animationTypeForReplace: state.isSignout ? 'pop' : 'push' }}
            /> : <Stack.Screen
              name="AppFlow"
              component={AppStack}
            />)
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
    </GestureHandlerRootView>
  );
}
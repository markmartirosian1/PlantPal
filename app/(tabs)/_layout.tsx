import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
            presentation: "modal"
          }} 
        />
        <Stack.Screen 
          name="dashboard" 
          options={{ 
            headerShown: false,
            // Prevent going back to login after successful login
            gestureEnabled: false,
          }} 
        />
        <Stack.Screen 
          name="plant-setup" 
          options={{ 
            title: "Create Account",
            headerShown: false,
            presentation: "modal"
          }} 
        />
        <Stack.Screen 
          name="calendar" 
          options={{ 
            title: "Calendar",
            headerShown: false,
            presentation: "card"
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="plant-setup" 
          options={{ 
            title: "Add Plant",
            headerShown: false,  // Hide header to match design
            presentation: "modal" // Makes it slide up like a modal
          }} 
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
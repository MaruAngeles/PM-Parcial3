import {Stack} from 'expo-router';

export default function RootLayout(){

    return (
        <Stack screenOptions={{ headerShown: false}}>
            <Stack.Screen
                name="detalle/[id]"
                options={{
                headerShown: true,
                title: "Detalle del usuario",
                }}
            />

            <Stack.Screen
                name="editar/[id]"
                options={{
                headerShown: true,
                title: "Actualizar usuario",
                }}
            />
        </Stack>
    
    );
}
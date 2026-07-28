import {Stack} from 'expo-router';

export default function RootLayout(){

    // Se le dice que la navegación principal es una navegacion en pila es la base y sobre esa se puede poner otra 
    return <Stack screenOptions={{ headerShown: false}}/> ;
}
//importar la navegacion que queremos que tenga
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
export default function TabsLayout(){
    
    return(

        <Tabs>

        {/* // nombre que aparece debajo de la navegacion */}

        <Tabs.Screen name="index" options={{title:"Inicio", href:null, tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />),}}/>
        <Tabs.Screen name="Alta" options={{title:"Alta", tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add" size={size} color={color} />),}}/>
        <Tabs.Screen name="Consulta" options={{title:"consulta", tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />),}}/>

        </Tabs>

    );
}
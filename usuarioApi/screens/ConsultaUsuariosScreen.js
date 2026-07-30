import React, { useEffect, useState } from 'react';

import { SafeAreaView, View, Text, FlatList, StyleSheet, Pressable,} from 'react-native';

import { useRouter } from 'expo-router';

export default function ConsultaUsuariosScreen() {
  const [usuarios, setUsuarios] = useState([]);

  const router = useRouter();

  const obtenerUsuarios = async () => {
    try {
      const respuesta = await fetch(
        'http://172.20.10.3:8000/v1/usuarios/'
      );

      const datos = await respuesta.json();

      console.log('Respuesta API', datos);

      if (!respuesta.ok) {
        console.log('Error de la API:', datos);
        return;
      }

      setUsuarios(datos.usuarios);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const renderTarjeta = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>
        {item.nombre}
      </Text>

      <View style={styles.linea} />

      <Text style={styles.info}>
        Edad: {item.edad} años
      </Text>

      <Pressable
        style={styles.botonDetalle}
        onPress={() =>
          router.push({
            pathname: '/detalle/[id]',
            params: {
              id: item.id,
            },
          })
        }
      >
        <Text style={styles.detalleTexto}>
          Ver detalles →
        </Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>
        Lista de Usuarios
      </Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTarjeta}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contenidoLista}
        ListEmptyComponent={
          <Text style={styles.listaVacia}>
            No hay usuarios registrados.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 20,
  },

  contenidoLista: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 4,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  nombre: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563EB',
  },

  linea: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },

  info: {
    fontSize: 16,
    color: '#4B5563',
  },

  botonDetalle: {
    alignSelf: 'flex-end',
    marginTop: 15,
    paddingVertical: 5,
  },

  detalleTexto: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },

  listaVacia: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 40,
  },
});
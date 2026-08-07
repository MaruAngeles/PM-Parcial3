import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {
  useFocusEffect,
  useRouter,
} from 'expo-router';

const API_URL = 'http://192.168.8.12:8000';

export default function ConsultaUsuariosScreen() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const obtenerUsuarios = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(
        `${API_URL}/v1/usuarios/`
      );

      const datos = await respuesta.json();

      console.log('Respuesta API', datos);

      if (!respuesta.ok) {
        throw new Error(
          datos.detail ||
          'No se pudieron obtener los usuarios'
        );
      }

      setUsuarios(datos.usuarios || []);
    } catch (error) {
      console.log(
        'Error al consultar usuarios:',
        error
      );

      Alert.alert(
        'Error',
        error.message ||
        'No se pudieron cargar los usuarios'
      );
    } finally {
      setCargando(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      obtenerUsuarios();
    }, [])
  );

  const renderUsuario = ({ item }) => {
    return (
      <View style={styles.tarjeta}>
        <View>
          <Text style={styles.nombre}>
            {item.nombre}
          </Text>

          <Text style={styles.edad}>
            {item.edad} años
          </Text>
        </View>

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
          <Text style={styles.textoBoton}>
            Ver detalles
          </Text>
        </Pressable>
      </View>
    );
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.textoCarga}>
          Cargando usuarios...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Consulta de usuarios
      </Text>

      <Text style={styles.total}>
        Total de usuarios: {usuarios.length}
      </Text>

      <FlatList
        data={usuarios}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderUsuario}
        contentContainerStyle={
          styles.contenidoLista
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.listaVacia}>
            No hay usuarios registrados.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 20,
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },

  total: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 18,
  },

  contenidoLista: {
    paddingBottom: 25,
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,

    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  nombre: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  edad: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },

  botonDetalle: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 14,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  textoCarga: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },

  listaVacia: {
    textAlign: 'center',
    marginTop: 50,
    color: '#6B7280',
    fontSize: 16,
  },
});
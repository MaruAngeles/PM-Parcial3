import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

const API_URL = 'http://172.20.10.10:8000';

// Deben ser las mismas credenciales que usa verificar_peticion.
const USUARIO_API = 'admin';
const CONTRASENA_API = '1234';

export default function DetalleUsuario() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(false);

  const idUsuario = Array.isArray(id) ? id[0] : id;

  const crearAutorizacion = () => {
    const credenciales = `${USUARIO_API}:${CONTRASENA_API}`;
    return `Basic ${btoa(credenciales)}`;
  };

  const obtenerUsuario = async () => {
    try {
      setCargando(true);

      const url = `${API_URL}/v1/usuarios/${idUsuario}`;

      console.log('ID recibido:', idUsuario);
      console.log('URL consultada:', url);

      const respuesta = await fetch(url);

      const datos = await respuesta.json();

      console.log('Código HTTP:', respuesta.status);
      console.log('Detalle del usuario:', datos);

      if (!respuesta.ok) {
        throw new Error(
          datos.detail || 'No se pudo consultar el usuario'
        );
      }

      setUsuario(datos.usuario || datos);
    } catch (error) {
      console.log('Error al consultar usuario:', error);

      Alert.alert(
        'Error',
        error.message || 'No se pudo consultar el usuario',
        [
          {
            text: 'Aceptar',
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (idUsuario) {
      obtenerUsuario();
    } else {
      setCargando(false);
    }
  }, [idUsuario]);

  const confirmarEliminacion = () => {
    Alert.alert(
      'Eliminar usuario',
      `¿Seguro que deseas eliminar a ${usuario.nombre}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: eliminarUsuario,
        },
      ]
    );
  };

  const eliminarUsuario = async () => {
    try {
      setEliminando(true);

      const respuesta = await fetch(
        `${API_URL}/v1/usuarios/${idUsuario}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: crearAutorizacion(),
          },
        }
      );

      const datos = await respuesta.json();

      console.log('Respuesta eliminación:', datos);

      if (!respuesta.ok) {
        throw new Error(
          datos.detail || 'No se pudo eliminar el usuario'
        );
      }

      Alert.alert(
        'Usuario eliminado',
        'El usuario se eliminó correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () =>
              router.replace('/(tabs)/consulta'),
          },
        ]
      );
    } catch (error) {
      console.log('Error al eliminar:', error);

      Alert.alert(
        'Error',
        error.message || 'No se pudo eliminar el usuario'
      );
    } finally {
      setEliminando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.textoCarga}>
          Cargando usuario...
        </Text>
      </View>
    );
  }

  if (!usuario) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoError}>
          No se encontró el usuario.
        </Text>

        <Pressable
          style={styles.botonRegresar}
          onPress={() => router.back()}
        >
          <Text style={styles.textoBoton}>
            Regresar
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Detalles del usuario
      </Text>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>
          ID
        </Text>

        <Text style={styles.valor}>
          {usuario.id}
        </Text>

        <View style={styles.linea} />

        <Text style={styles.etiqueta}>
          Nombre
        </Text>

        <Text style={styles.valor}>
          {usuario.nombre}
        </Text>

        <View style={styles.linea} />

        <Text style={styles.etiqueta}>
          Edad
        </Text>

        <Text style={styles.valor}>
          {usuario.edad} años
        </Text>

        <Pressable
          style={styles.botonActualizar}
          onPress={() =>
            router.push({
              pathname: '/editar/[id]',
              params: {
                id: usuario.id,
              },
            })
          }
          disabled={eliminando}
        >
          <Text style={styles.textoBoton}>
            Actualizar
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.botonEliminar,
            eliminando && styles.botonDesactivado,
          ]}
          onPress={confirmarEliminacion}
          disabled={eliminando}
        >
          {eliminando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBoton}>
              Eliminar
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.botonRegresarInferior}
          onPress={() => router.back()}
          disabled={eliminando}
        >
          <Text style={styles.textoRegresar}>
            Regresar
          </Text>
        </Pressable>
      </View>
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
    padding: 20,
  },

  textoCarga: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },

  textoError: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 20,
  },

  tarjeta: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,

    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  etiqueta: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },

  valor: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },

  linea: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 18,
  },

  botonActualizar: {
    backgroundColor: '#E0A800',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 28,
  },

  botonEliminar: {
    backgroundColor: '#DC2626',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },

  botonDesactivado: {
    opacity: 0.6,
  },

  botonRegresar: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },

  botonRegresarInferior: {
    padding: 14,
    alignItems: 'center',
    marginTop: 7,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  textoRegresar: {
    color: '#2563EB',
    fontSize: 15,
    fontWeight: '600',
  },
});
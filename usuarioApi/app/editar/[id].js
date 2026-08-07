import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

const API_URL = 'http://192.168.8.12:8000';


const USUARIO_API = 'admin';
const CONTRASENA_API = '1234';

export default function EditarUsuario() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const idUsuario = Array.isArray(id) ? id[0] : id;

  const crearAutorizacion = () => {
    const credenciales = `${USUARIO_API}:${CONTRASENA_API}`;
    return `Basic ${btoa(credenciales)}`;
  };

  const obtenerUsuario = async () => {
    try {
      setCargando(true);

      const respuesta = await fetch(
        `${API_URL}/v1/usuarios/${idUsuario}`
      );

      const datos = await respuesta.json();

      console.log('Usuario para editar:', datos);

      if (!respuesta.ok) {
        throw new Error(
          datos.detail || 'No se pudo obtener el usuario'
        );
      }

      const usuario = datos.usuario || datos;

      setNombre(usuario.nombre);
      setEdad(usuario.edad.toString());
    } catch (error) {
      console.log('Error al obtener usuario:', error);

      Alert.alert(
        'Error',
        error.message || 'No se pudo obtener el usuario'
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

  const actualizarUsuario = async () => {
    if (nombre.trim() === '' || edad.trim() === '') {
      Alert.alert(
        'Campos incompletos',
        'Ingresa el nombre y la edad.'
      );

      return;
    }

    const edadNumero = Number(edad);

    if (
      Number.isNaN(edadNumero) ||
      edadNumero <= 0 ||
      !Number.isInteger(edadNumero)
    ) {
      Alert.alert(
        'Edad incorrecta',
        'Ingresa una edad válida.'
      );

      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch(
        `${API_URL}/v1/usuarios/${idUsuario}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: crearAutorizacion(),
          },
          body: JSON.stringify({
            nombre: nombre.trim(),
            edad: edadNumero,
          }),
        }
      );

      const datos = await respuesta.json();

      console.log('Respuesta actualización:', datos);

      if (!respuesta.ok) {
        throw new Error(
          datos.detail || 'No se pudo actualizar el usuario'
        );
      }

      Alert.alert(
        'Usuario actualizado',
        'Los cambios se guardaron correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.log('Error al actualizar:', error);

      Alert.alert(
        'Error',
        error.message || 'No se pudo actualizar el usuario'
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />

        <Text style={styles.textoCarga}>
          Cargando información...
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios' ? 'padding' : undefined
      }
    >
      <Text style={styles.titulo}>
        Actualizar usuario
      </Text>

      <View style={styles.formulario}>
        <Text style={styles.etiqueta}>
          Nombre
        </Text>

        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre del usuario"
          autoCapitalize="words"
        />

        <Text style={styles.etiqueta}>
          Edad
        </Text>

        <TextInput
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          placeholder="Edad del usuario"
          keyboardType="number-pad"
          maxLength={3}
        />

        <Pressable
          style={[
            styles.botonGuardar,
            guardando && styles.botonDesactivado,
          ]}
          onPress={actualizarUsuario}
          disabled={guardando}
        >
          {guardando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBoton}>
              Guardar cambios
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.botonCancelar}
          onPress={() => router.back()}
          disabled={guardando}
        >
          <Text style={styles.textoCancelar}>
            Cancelar
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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

  textoCarga: {
    marginTop: 12,
    fontSize: 16,
    color: '#4B5563',
  },

  titulo: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 25,
  },

  formulario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,

    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  etiqueta: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 18,
  },

  botonGuardar: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 8,
  },

  botonDesactivado: {
    opacity: 0.6,
  },

  botonCancelar: {
    padding: 14,
    alignItems: 'center',
    marginTop: 5,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  textoCancelar: {
    color: '#4B5563',
    fontSize: 15,
    fontWeight: '600',
  },
});
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Pressable,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import nuevoGasto from './src/img/nuevo-gasto.png';
import FormularioGasto from './src/components/FormularioGasto';
import {generarId} from './src/helpers';
import ListadoGastos from './src/components/ListadoGastos';
import Filtro from './src/components/Filtro';

const App = () => {
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [presupuesto, setPresupuesto] = useState('');
  const [gastos, setGastos] = useState([]);
  const [modal, setModal] = useState(false);
  const [gasto, setGasto] = useState({});
  const [filtro, setFiltro] = useState('');
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  useEffect(() => {
    const obtenerPresupuestoStorage = async () => {
      try {
        const presupuestoStorage =
          (await AsyncStorage.getItem('planificador_presupuesto')) ?? '';

        if (!!presupuestoStorage) {
          setPresupuesto(presupuestoStorage);
          setIsValidPresupuesto(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    obtenerPresupuestoStorage();
  }, []);

  useEffect(() => {
    if (isValidPresupuesto) {
      const guardarPresupuestoStorage = async () => {
        try {
          await AsyncStorage.setItem('planificador_presupuesto', presupuesto);
        } catch (error) {
          console.log(error);
        }
      };

      guardarPresupuestoStorage();
    }
  }, [isValidPresupuesto]);

  useEffect(() => {
    const obtenerGastosStorage = async () => {
      try {
        const gastosStorage = await AsyncStorage.getItem('planificador_gastos');

        setGastos(gastosStorage ? JSON.parse(gastosStorage) : setGastos([]));
      } catch (error) {
        console.log(error);
      }
    };

    obtenerGastosStorage();
  }, []);

  useEffect(() => {
    const guardarGastosStorage = async () => {
      try {
        await AsyncStorage.setItem(
          'planificador_gastos',
          JSON.stringify(gastos),
        );
      } catch (error) {
        console.log(error);
      }
    };

    guardarGastosStorage();
  }, [gastos]);

  const handleNuevoPresupuesto = presupuesto => {
    if (Number(presupuesto) > 0) {
      setIsValidPresupuesto(true);
    } else {
      Alert.alert('Error', 'El presupuesto no puede ser 0 o menor');
    }
  };

  const handleGasto = gasto => {
    if ([gasto.nombre, gasto.categoria, gasto.cantidad].includes('')) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (gasto.id) {
      const gastosActualizados = gastos.map(gastoState =>
        gastoState.id === gasto.id ? gasto : gastoState,
      );

      setGastos(gastosActualizados);
      setGasto({});
    } else {
      gasto.id = generarId();
      gasto.fecha = Date.now();

      setGastos([...gastos, gasto]);
      setGasto({});
    }

    setModal(!modal);
  };

  const eliminarGasto = id => {
    Alert.alert(
      'Deseas eliminar este gasto',
      'Un gasto eliminado no se puede recuperar',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Si, Eliminar',
          onPress: () => {
            const gastosActualizados = gastos.filter(
              gastoState => gastoState.id !== id,
            );

            setGastos(gastosActualizados);
            setModal(!modal);
            setGasto({});
          },
        },
      ],
    );
  };

  const resetearApp = () => {
    Alert.alert(
      'Deseas Borrar Todos los Datos de la App?',
      'Esta operación eliminara el presupuesto, los gastos y no pueden ser recuperados',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Si, Eliminar',
          onPress: async () => {
            try {
              await AsyncStorage.clear();

              setIsValidPresupuesto(false);
              setPresupuesto(0);
              setGastos([]);
            } catch (error) {
              console.log(error);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView>
        <View style={styles.header}>
          <Header />
          {isValidPresupuesto ? (
            <ControlPresupuesto
              presupuesto={presupuesto}
              gastos={gastos}
              resetearApp={resetearApp}
            />
          ) : (
            <>
              <NuevoPresupuesto
                handleNuevoPresupuesto={handleNuevoPresupuesto}
                presupuesto={presupuesto}
                setPresupuesto={setPresupuesto}
              />
              <View style={styles.espacio}></View>
            </>
          )}
        </View>

        {isValidPresupuesto && (
          <>
            <Filtro
              setFiltro={setFiltro}
              filtro={filtro}
              gastos={gastos}
              setGastosFiltrados={setGastosFiltrados}
            />
            <ListadoGastos
              gastos={gastos}
              setModal={setModal}
              setGasto={setGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </>
        )}
      </ScrollView>

      {modal && (
        <Modal
          visible={modal}
          animationType="slide"
          onRequestClose={() => setModal(!modal)}>
          <FormularioGasto
            setModal={setModal}
            handleGasto={handleGasto}
            setGasto={setGasto}
            gasto={gasto}
            eliminarGasto={eliminarGasto}
          />
        </Modal>
      )}

      {isValidPresupuesto && (
        <Pressable onPress={() => setModal(!modal)} style={styles.pressable}>
          <Image source={nuevoGasto} style={styles.imagen} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {backgroundColor: '#f5f5f5', flex: 1},
  header: {
    backgroundColor: '#3b82f6',
  },
  espacio: {
    backgroundColor: '#f5f5f5',
    height: 400,
    position: 'relative',
    zIndex: -1,
  },
  pressable: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 40,
    right: 30,
  },
  imagen: {width: 60, height: 60},
});

export default App;

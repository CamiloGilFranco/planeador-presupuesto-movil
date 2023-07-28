import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Pressable,
  Image,
  Modal,
  Text,
  ScrollView,
} from 'react-native';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import nuevoGasto from './src/img/nuevo-gasto.png';
import FormularioGasto from './src/components/FormularioGasto';
import {generarId} from './src/helpers';
import ListadoGastos from './src/components/ListadoGastos';

const App = () => {
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [presupuesto, setPresupuesto] = useState('');
  const [gastos, setGastos] = useState([]);
  const [modal, setModal] = useState(false);
  const [gasto, setGasto] = useState({});

  const handleNuevoPresupuesto = presupuesto => {
    if (Number(presupuesto) > 0) {
      setIsValidPresupuesto(true);
    } else {
      Alert.alert('Error', 'El presupuesto no puede ser 0 o menor');
    }
  };

  const handleGasto = gasto => {
    if (Object.values(gasto).includes('')) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    gasto.id = generarId();
    gasto.fecha = Date.now();

    setGastos([...gastos, gasto]);
    setModal(!modal);
  };

  return (
    <View style={styles.contenedor}>
      <ScrollView>
        <View style={styles.header}>
          <Header />
          {isValidPresupuesto ? (
            <ControlPresupuesto presupuesto={presupuesto} gastos={gastos} />
          ) : (
            <NuevoPresupuesto
              handleNuevoPresupuesto={handleNuevoPresupuesto}
              presupuesto={presupuesto}
              setPresupuesto={setPresupuesto}
            />
          )}
        </View>

        {isValidPresupuesto && (
          <ListadoGastos
            gastos={gastos}
            setModal={setModal}
            setGasto={setGasto}
          />
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
          />
        </Modal>
      )}

      {isValidPresupuesto && (
        <Pressable onPress={() => setModal(!modal)}>
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
    minHeight: 400,
  },
  imagen: {width: 60, height: 60, position: 'absolute', bottom: 40, right: 30},
});

export default App;

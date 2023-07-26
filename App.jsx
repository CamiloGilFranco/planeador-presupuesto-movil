import React, {useState} from 'react';
import {View, StyleSheet, Alert, Pressable, Image, Modal} from 'react-native';
import Header from './src/components/Header';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import nuevoGasto from './src/img/nuevo-gasto.png';
import FormularioGasto from './src/components/FormularioGasto';

const App = () => {
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
  const [presupuesto, setPresupuesto] = useState('');
  const [gastos, setGastos] = useState([]);
  const [modal, setModal] = useState(false);

  const handleNuevoPresupuesto = presupuesto => {
    if (Number(presupuesto) > 0) {
      setIsValidPresupuesto(true);
    } else {
      Alert.alert('Error', 'El presupuesto no puede ser 0 o menor');
    }
  };

  return (
    <View style={styles.contenedor}>
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

      {modal && (
        <Modal visible={modal} animationType="slide">
          <FormularioGasto />
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
  },
  imagen: {width: 60, height: 60, position: 'absolute', top: 120, right: 20},
});

export default App;

import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import grafico from '../img/grafico.jpg';
import globalStyles from '../styles';
import {formatearCantidad} from '../helpers';

const ControlPresupuesto = ({presupuesto, gastos}) => {
  const [disponible, setDisponible] = useState(0);
  const [gastado, setGastado] = useState(0);

  useEffect(() => {
    const totalGastado = gastos.reduce(
      (total, gasto) => Number(gasto.cantidad) + total,
      0,
    );

    const totalDisponible = presupuesto - totalGastado;

    setDisponible(totalDisponible);
    setGastado(totalGastado);
  }, [gastos]);

  return (
    <View style={styles.contenedor}>
      <View style={styles.centrarGrafica}>
        <Image source={grafico} style={styles.imagen} />
      </View>
      <View style={styles.contenedorTexto}>
        <Text style={styles.valor}>
          <Text style={styles.label}>Presupuesto:{''}</Text>{' '}
          {formatearCantidad(presupuesto)}
        </Text>

        <Text style={styles.valor}>
          <Text style={styles.label}>Disponible:{''}</Text>{' '}
          {formatearCantidad(disponible)}
        </Text>

        <Text style={styles.valor}>
          <Text style={styles.label}>Gastado:{''}</Text>{' '}
          {formatearCantidad(gastado)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {...globalStyles.contenedor},
  centrarGrafica: {alignItems: 'center'},
  imagen: {width: 250, height: 250},
  contenedorTexto: {marginTop: 50},
  valor: {fontSize: 24, textAlign: 'center', marginBottom: 10},
  label: {fontWeight: '700', color: '#3b82f6'},
});

export default ControlPresupuesto;

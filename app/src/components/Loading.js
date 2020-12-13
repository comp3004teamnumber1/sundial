import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Container } from 'native-base';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

export default function Loading() {
  return (
    <Container style={styles.container}>
      <ActivityIndicator size='large' color='#FF8C42' />
    </Container>
  );
}

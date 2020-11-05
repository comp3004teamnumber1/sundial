
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Container, View } from 'native-base';
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
  },
  wrapper: {
    backgroundColor: '#231F29',
    marginHorizontal: 24,
    marginVertical: 24,
  },
});

export default function LoadingComponent() {
  return (
    <Container style={styles.container}>
      <Container style={styles.wrapper}>
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#FF8C42" />
        </View>
      </Container>
    </Container>
  );
}

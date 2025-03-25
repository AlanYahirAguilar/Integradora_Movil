// CodeBlock.js
import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CodeBlock = ({ code }) => {
  return (
    <Text style={styles.code}>
      {code}
    </Text>
  );
};

const styles = StyleSheet.create({
  code: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
  },
});

export default CodeBlock;
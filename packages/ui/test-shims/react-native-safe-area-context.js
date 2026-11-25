const React = require('react');
const { View } = require('react-native');

function SafeAreaView(props) {
  return React.createElement(View, props, props.children);
}

function SafeAreaProvider(props) {
  return React.createElement(View, props, props.children);
}

function useSafeAreaInsets() {
  return { top: 0, right: 0, bottom: 0, left: 0 };
}

function useSafeAreaFrame() {
  return { x: 0, y: 0, width: 0, height: 0 };
}

module.exports = {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
  useSafeAreaFrame,
  initialWindowMetrics: undefined,
};

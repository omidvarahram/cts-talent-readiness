const React = require('react');

function createHostComponent(name) {
  return React.forwardRef(function HostComponent(props, ref) {
    return React.createElement(name, { ...props, ref }, props.children);
  });
}

const View = createHostComponent('View');
const Text = createHostComponent('Text');
const Pressable = View;
const TextInput = createHostComponent('TextInput');
const Image = createHostComponent('Image');
const ScrollView = createHostComponent('ScrollView');
const Modal = createHostComponent('Modal');
const Switch = createHostComponent('Switch');
const ActivityIndicator = createHostComponent('ActivityIndicator');
const KeyboardAvoidingView = createHostComponent('KeyboardAvoidingView');

const StyleSheet = {
  create(styles) {
    return styles;
  },
  flatten(style) {
    if (!style) return undefined;
    if (Array.isArray(style)) {
      return style.reduce((acc, item) => Object.assign(acc || {}, StyleSheet.flatten(item)), {});
    }
    return style;
  },
  compose(style1, style2) {
    if (!style1) return style2;
    if (!style2) return style1;
    return [style1, style2];
  },
  hairlineWidth: 1,
  absoluteFillObject: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
};
StyleSheet.absoluteFill = StyleSheet.absoluteFillObject;

class AnimatedValue {
  constructor(value) {
    this._value = value;
  }
  setValue(value) {
    this._value = value;
  }
  __getValue() {
    return this._value;
  }
  interpolate(config) {
    return { __animated: true, value: this._value, config };
  }
}

const Animated = {
  View: createHostComponent('Animated.View'),
  Value: AnimatedValue,
  timing(value, config) {
    return {
      start(callback) {
        if (value && typeof value.setValue === 'function') {
          value.setValue(config && typeof config.toValue === 'number' ? config.toValue : value.__getValue());
        }
        if (callback) callback({ finished: true });
      },
    };
  },
  createAnimatedComponent(component) {
    return component;
  },
};

const Platform = {
  OS: 'ios',
  select(options) {
    if (!options) return undefined;
    return options.ios ?? options.default;
  },
};

module.exports = {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
};

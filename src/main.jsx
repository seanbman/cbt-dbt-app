import React from 'react';
import { AppRegistry } from 'react-native-web';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

AppRegistry.registerComponent('SteadySteps', () => App);

const rootTag = document.getElementById('root');
const RootComponent = AppRegistry.getApplication('SteadySteps').element;
createRoot(rootTag).render(RootComponent);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      // The app remains fully usable if service-worker registration fails.
    });
  });
}

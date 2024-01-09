/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging'

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    try {
        console.log('Message handled in the background!', remoteMessage);
    } catch (error) {
        console.log('error', error)
    }
})

function HeadlessCheck({ isHeadless }) {
    if (isHeadless) {
        return null
    }

    return <App />
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);

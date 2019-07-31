import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

const sender = 'mobile';
const url = `ws://greatservice.azurewebsites.net/?name=${sender}&room=great`;
export default class AccelerometerSensor extends React.Component {



  state = {
    accelerometerData: { x: 0, y: 0, z: 0 },
    urlService: url
  };
  _subscription: any;

  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  };

  _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  _fast = () => {
    Accelerometer.setUpdateInterval(
      30
    );
  };
  _websocket;
  _subscribe = () => {
    this._websocket = new WebSocket(url);
    this._subscription = Accelerometer.addListener(
      accelerometerData => {
        let data;
        try {
          data = JSON.stringify({
            x: accelerometerData.x,
            y: accelerometerData.y,
            z: accelerometerData.z
          }
          )
        } catch (err) {
          console.log('stringify error');
          console.log(err);
        }
        try {
          this._websocket.send(data);
        } catch (err) {
          console.log('send error');
          console.log(err);
        }
        this.setState({ accelerometerData });
      })
  }

  _unsubscribe = () => {
    this
      ._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    let {
      x,
      y,
      z,
    } = this.state.accelerometerData;
    return (
      <View style={styles.sensor}>
        <Text>Accelerometer:</Text>
        <Text>
          x: {round(x)} y: {round(y)} z: {round(z)}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle 5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => this.state.urlService = text}
          value={this.state.urlService}
        />
      </View>

    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
});
import React, { Component } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import {
  Container,
  Text,
  Form,
  Item,
  Input,
  Label,
  Button,
  Picker,
} from 'native-base';
import Modal from 'react-native-modal';
import moment from 'moment';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import { getStorageKey } from '../util/Storage';
import { getIcon } from '../util/Util';
import query from '../util/SundialAPI';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#231F29',
  },
  containerForm: {
    backgroundColor: '#231F29',
    width: '100%',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: '#231F29',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 24,
    marginRight: 16,
  },
  footer: {
    backgroundColor: '#231F29',
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  modal: {
    backgroundColor: '#332E3C',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    maxHeight: 280,
  },
  modalContent: {
    backgroundColor: '#332E3C',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFooter: {
    backgroundColor: '#332E3C',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    marginBottom: 12,
  },
  textLight: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 4,
  },
  textDark: {
    color: '#000000',
  },
  textInput: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 12,
  },
  textError: {
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 24,
  },
  btn: {
    marginLeft: 16,
    marginTop: 16,
    backgroundColor: '#ff8c42',
  },
  btnNormal: {
    backgroundColor: '#332E3C',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
  },
  btnAction: {
    backgroundColor: '#ff8c42',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 15,
  },
  checkBox: {
    marginRight: 20,
  },
});

export default class AddEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: 0,
      ideal_weather: 'Clear',
      location: 'Ottawa, Ontario',
      time: 1,
      errorMsg: '',
      modalOpen: false,
    };
  }

  async componentDidMount() {
    const current_location = await getStorageKey('current_location');
    if (!current_location) {
      return;
    }
    this.setState({ location: current_location });
  }

  setWeather = newWeather => {
    this.setState({ ideal_weather: newWeather });
  };

  validateInputs = () => {
    const { ideal_weather, location, time } = this.state;
    return ideal_weather && location && time;
  };

  handleSubmit = async () => {
    if (!this.validateInputs()) {
      this.setState({ errorMsg: 'Please fill in all fields.' });
      return;
    }
    const { ideal_weather, location, time } = this.state;

    if (isNaN(time) || parseInt(time, 10) <= 0) {
      this.setState({ errorMsg: 'Duration should be a positive integer.' });
      return;
    }
    const data = {
      ideal_weather,
      location,
      time,
    };
    const res = await query('consecutive', 'get', data);
    if (res === null || (res.status !== 200 && res.status !== 204)) {
      this.setState({ errorMsg: 'An error occurred. Please try again.' });
      return;
    }

    if (res.status === 204) {
      this.setState({ modalOpen: true, date: 0, errorMsg: '' });
      return;
    }

    this.setState({ modalOpen: true, date: res.days[0].date, errorMsg: '' });
  };

  render() {
    const { ideal_weather, errorMsg, modalOpen, date, time } = this.state;

    const { navigation } = this.props;

    const renderModal = () => {
      if (date) {
        const mom = moment.unix(date);
        return (
          <Container style={styles.modal}>
            <Container style={styles.modalContent}>
              <Text style={styles.title}>
                Date found! <Feather name='search' size={32} color='white' />
              </Text>
              <Text style={styles.textLight}>{mom.format('dddd, MMMM D')}</Text>
              <Text style={styles.textLight}>
                {`has ${time} consecutive day(s) of`}
              </Text>
              <Text style={styles.textLight}>
                {`"${ideal_weather}" weather `}
                {getIcon(ideal_weather, 16, '#6699cc')}
              </Text>
            </Container>
            <Container style={styles.modalFooter}>
              <Pressable
                style={styles.btnNormal}
                onPress={() => {
                  this.setState({ modalOpen: false });
                }}
              >
                <Text style={styles.textLight}>CLOSE</Text>
              </Pressable>
              <Pressable
                style={styles.btnAction}
                onPress={() => {
                  this.setState({ modalOpen: false });
                  navigation.navigate('AddEvent', {
                    date: mom.format('YYYY-MM-DD'),
                  });
                }}
              >
                <Text style={styles.textDark}>ADD AN EVENT</Text>
              </Pressable>
            </Container>
          </Container>
        );
      }

      return (
        <Container style={styles.modal}>
          <Container style={styles.modalContent}>
            <Text style={styles.title}>No dates found!</Text>
          </Container>
          <Container style={styles.modalFooter}>
            <Pressable
              onPress={() => {
                this.setState({ modalOpen: false });
              }}
            >
              <Text style={styles.textLight}>OKAY</Text>
            </Pressable>
          </Container>
        </Container>
      );
    };

    return (
      <Container style={styles.container}>
        <Header />
        <Container style={styles.content}>
          <Text style={styles.title}>Search Tool</Text>
          <Form style={styles.containerForm}>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='map-pin' size={24} color='white' />
              </Label>
              <Input
                style={styles.textLight}
                placeholder='Ottawa, ON'
                placeholderTextColor='#aaaaaa'
                onChangeText={val => {
                  this.setState({ location: val });
                }}
              />
            </Item>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='cloud' size={24} color='white' />
              </Label>
              <Picker
                mode='dropdown'
                style={{ color: '#ffffff' }}
                selectedValue={ideal_weather}
                onValueChange={this.setWeather}
              >
                <Picker.Item label='Clear' value='Clear' />
                <Picker.Item label='Clouds' value='Clouds' />
                <Picker.Item label='Rain' value='Rain' />
                <Picker.Item label='Drizzle' value='Drizzle' />
                <Picker.Item label='Snow' value='Snow' />
                <Picker.Item label='Thunderstorm' value='Thunderstorm' />
              </Picker>
            </Item>
            <Item>
              <Label style={styles.textLight}>
                <Feather name='clock' size={24} color='white' />
              </Label>
              <Input
                style={styles.textLight}
                placeholder='Number of days in a row (e.g. 2)'
                placeholderTextColor='#aaaaaa'
                onChangeText={val => {
                  this.setState({ time: val });
                }}
              />
            </Item>
            {errorMsg ? <Text style={styles.textError}>{errorMsg}</Text> : null}
          </Form>
          <Container style={styles.footer}>
            <Button block style={styles.btn} onPress={this.handleSubmit}>
              <Text style={styles.textDark}>Search</Text>
            </Button>
          </Container>
        </Container>
        <Modal
          isVisible={modalOpen}
          onBackdropPress={() => this.setState({ modalOpen: false })}
          animationIn='slideInDown'
          animationOut='slideOutUp'
        >
          {renderModal()}
        </Modal>
      </Container>
    );
  }
}

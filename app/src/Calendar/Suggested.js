import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Container, Text, Content, Card, CardItem, View } from 'native-base';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { getIcon } from '../util/Util';
import query from '../util/SundialAPI';
import Header from '../components/Header';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#231F29',
    padding: 24,
  },
  cardContainer: {
    borderColor: '#231F29',
    backgroundColor: '#231F29',
  },
  cardHeader: {
    backgroundColor: '#332E3C',
    borderColor: '#231F29',
    borderBottomWidth: 1,
  },
  cardItem: {
    backgroundColor: '#332E3C',
    borderColor: '#231F29',
  },
  colLeft: {
    flex: 5,
    flexDirection: 'column',
  },
  colRight: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    color: '#ffffff',
    fontSize: 32,
    textAlign: 'center',
    paddingBottom: 24,
  },
  subtitleDate: {
    color: '#ffffff',
    fontSize: 24,
  },
  subtitle: {
    color: '#ffffff',
    fontSize: 24,
    padding: 8,
  },
  textHeader: {
    color: '#6699CC',
    fontSize: 16,
    marginLeft: 8,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
  },
  cardTextHeader: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textBlue: {
    color: '#6699cc',
    fontSize: 16,
  },
  textLight: {
    color: '#ffffff',
    fontSize: 16,
  },
  textOrange: {
    color: '#ff8c42',
    fontSize: 16,
  },
});

export default class Suggested extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suggested: props.route.params.data || [],
    };
  }

  handlePress = id => {
    Alert.alert(
      'Change Date',
      "Are you sure you want to change this event's date?",
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.changeEvent(id);
          },
        },
      ]
    );
  };

  changeEvent = async id => {
    const { navigation } = this.props;
    const res = await query(`task/${id}`, 'post');
    if (res === null || res.status !== 200) {
      console.log('Error while updating task');
      alert('An error occurred. Please try again.');
      return;
    }
    navigation.goBack();
    alert('Success!');
  };

  render() {
    const { suggested } = this.state;

    const renderSuggestions = () => {
      let arr = [];
      for (let s of suggested) {
        const newDate = moment.unix(s.date);
        const oldDate = moment.unix(s.original.date);
        arr.push(
          <TouchableOpacity
            key={s.original.id}
            onPress={() => {
              this.handlePress(s.original.id);
            }}
          >
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardItem} bordered>
                <View style={styles.colLeft}>
                  <Text style={styles.cardTextHeader}>{s.original.task}</Text>
                  <Text style={styles.textBlue}>
                    {oldDate.format('MMMM D, YYYY')}
                  </Text>
                  <Text style={styles.textOrange}>
                    <Feather
                      name='corner-down-right'
                      size={16}
                      color='#ffffff'
                    />{' '}
                    {newDate.format('MMMM D, YYYY')}
                  </Text>
                  <Text style={styles.textLight}>{s.original.location}</Text>
                </View>
                <View style={styles.colRight}>
                  {getIcon(s.original.ideal_weather, 48, '#ffffff')}
                </View>
              </CardItem>
            </Card>
          </TouchableOpacity>
        );
      }
      return arr;
    };

    return (
      <Container>
        <Header />
        <Content contentContainerStyle={styles.container}>
          <Text style={styles.title}>Suggested Dates</Text>
          {suggested && suggested.length > 0 ? (
            renderSuggestions()
          ) : (
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardItem} bordered>
                <Text style={styles.text}>No dates found!</Text>
              </CardItem>
            </Card>
          )}
        </Content>
      </Container>
    );
  }
}

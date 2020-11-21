import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Container,
  Text,
  Content,
  Card,
  CardItem,
  Fab,
  Button,
  View,
} from 'native-base';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import { getIcon } from '../../util/Util';
import query from '../../util/SundialAPI';
import Header from '../../components/Header';

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
    flex: 1,
    flexDirection: 'column',
  },
  colRight: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
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
    fontSize: 24,
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
});

export default class NotificationBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      refreshing: false,
      fabOpen: false,
    };
  }

  componentDidMount() {
    this.updateNotifications();
  }

  handleDeleteNotification = id => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this alert?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.deleteNotification(id);
          },
        },
      ]
    );
  };

  deleteNotification = async id => {
    const res = await query(`notification/day/${id}`, 'delete');
    if (res === null || res.status !== 200) {
      console.log('Error while deleting task');
    }
    this.handleRefresh();
  };

  handleRefresh = async () => {
    this.setState({ refreshing: true });
    await this.updateNotifications();
    this.setState({ refreshing: false });
  };

  updateNotifications = async () => {
    const res = await query('notification/day', 'get');
    if (res === null) {
      Alert.alert('An error occurred', 'Please try again.');
    }
    this.setState({ notifications: res.notification_days || [] });
  };

  render() {
    const { notifications, refreshing, fabOpen } = this.state;
    const { navigation } = this.props;

    const renderNotifications = () => {
      let arr = [];
      for (let notif of notifications) {
        const momentDate = moment.unix(notif.date);
        arr.push(
          <TouchableOpacity
            key={`${notif.id}`}
            onLongPress={() => {
              this.handleDeleteNotification(notif.id);
            }}
          >
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardItem} bordered>
                <View style={styles.colLeft}>
                  <Text style={styles.cardTextHeader}>
                    {momentDate.format('dddd')}
                  </Text>
                  <Text style={styles.textLight}>
                    {momentDate.format('MMMM D, YYYY')}
                  </Text>
                  <Text style={styles.textLight}>{notif.location}</Text>
                </View>
                <View style={styles.colRight}>
                  {getIcon(notif.ideal_weather, 48, '#ffffff')}
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
        <Content
          contentContainerStyle={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.handleRefresh}
            />
          }
        >
          <Text style={styles.title}>Notifications</Text>
          {notifications && notifications.length > 0 ? (
            renderNotifications()
          ) : (
            <Card style={styles.cardContainer}>
              <CardItem style={styles.cardItem} bordered>
                <Text style={styles.text}>No tasks found!</Text>
              </CardItem>
            </Card>
          )}
        </Content>
        <Fab
          active={fabOpen}
          direction='up'
          position='bottomRight'
          style={{ backgroundColor: '#FF8C42' }}
          onPress={() => this.setState({ fabOpen: !fabOpen })}
        >
          <Feather name='edit-3' size={24} color='white' />
          <Button
            style={{ backgroundColor: '#6699CC' }}
            onPress={() => {
              navigation.navigate('AddNotification', {
                onAdd: this.updateNotifications,
              });
              this.setState({ fabOpen: false });
            }}
          >
            <Feather name='plus' size={24} color='white' />
          </Button>
        </Fab>
      </Container>
    );
  }
}

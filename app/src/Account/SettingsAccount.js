import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Container, Text, Item, Input, View, ListItem, Radio, Left, Right, List, Button, } from 'native-base';
import Modal from 'react-native-modal';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import { getSettings, getStorageKey, setStorageKey } from '../util/Storage';
import query from '../util/SundialAPI';

async function setPassword(oldPasswordText, pass) {
  if (!pass || !oldPasswordText) {
    return 'A password field is empty.';
  }

  if (!pass.replace(/ /g, '')) {
    return 'A password field is empty.';
  }

  const res = await query('password', 'post',
    {
      old_password: oldPasswordText,
      new_password: pass
    });

  if (res.status === 200) {
    return 'Password updated successfully!';
  }
  if (res.status === 401) {
    return 'Your old password is incorrect.';
  }

  return 'Something went wrong. Please try again.';
}

const ChangePassword = function () {
  let [oldPasswordText, setOldPassword] = useState('');
  let [newPasswordText, setNewPassword] = useState('');
  let [warning, setWarning] = useState('');
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
        Change Password
        </Text>
      <Item>
        <Input
          style={styles.input}
          onChangeText={e => { setOldPassword(e) }}
          value={oldPasswordText}
          autoFocus
          autoCompleteType='off'
          autoCapitalize='none'
          placeholder='Old Password'
          password
        />
      </Item>
      <Item>
        <Input
          style={styles.input}
          onChangeText={e => { setNewPassword(e) }}
          value={newPasswordText}
          autoCompleteType='off'
          autoCapitalize='none'
          autoCorrect={false}
          placeholder='New Password'
          password
          onSubmitEditing={async () => { setWarning(await setPassword(oldPasswordText, newPasswordText)) }}
        />
      </Item>

      <Text style={styles.warning}>
        {warning}
      </Text>

      <Button style={{ alignSelf: 'center', backgroundColor: '#FF8C42', marginTop: 15 }}
        onPress={async () => { setWarning(await setPassword(oldPasswordText, newPasswordText)) }}
      >
        <Text>
          Change Password
        </Text>
      </Button>
    </View>
  );
}

const ChangeUnits = function () {
  let [oldUnit, setOldUnit] = useState(null);
  const availableUnits = ['Metric', 'Imperial'];

  async function updateUnits(unit) {
    await setStorageKey('units', unit);
    console.log('settings!');
    console.log(await getSettings());
    // TODO: POST request to "/settings" with the key "settings" with your settings as a string
    return unit;
  }

  useEffect(() => {
    getStorageKey('units').then(
      (res) => {
        setOldUnit(res);
      },
      (err) => {
        console.log(err);
        setOldUnit(null);
      });
  });

  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
        Change Units
      </Text>
      <List
        style={{ width: '100%' }}
        dataArray={availableUnits}
        keyExtractor={(item, index) => `unit${index.toString()}`}
        renderRow={(unit) => {
          return (
            <ListItem
              onPress={async () => setOldUnit(await updateUnits(unit.toLowerCase()))}
            >
              <Left>
                <Text style={{ color: 'white' }}>
                  {unit}
                </Text>
              </Left>
              <Right>
                <Radio
                  color='#f0ad4e'
                  selectedColor='#6699CC'
                  selected={unit.toLowerCase() == oldUnit}
                />
              </Right>
            </ListItem>
          );
        }} />
    </View>
  );
}

const ChangeHome = function () {
  let [oldHome, setOldHome] = useState(null);
  let [settings, setSettings] = useState({});
  const options = ['Hourly Weather', 'Weekly Weather'];

  async function updateHome(newHome) {
    await setStorageKey('home_screen_displays_hourly_view', (`${newHome === 'Hourly Weather'}`));
    // TODO: POST request to "/settings" with the key "settings" with your settings as a string
    return newHome;
  }

  useEffect(() => {
    getStorageKey('home_screen_displays_hourly_view').then(
      (res) => {
        setOldHome(res == 'true' ? options[0] : options[1]);
      },
      (err) => {
        console.log(err);
        setOldHome(null);
      });
  });


  return (
    <View style={styles.modalContainer}>
      <Text style={styles.title} adjustsFontSizeToFit numberOfLines={1}>
        Change Home Screen
      </Text>
      <List
        style={{ width: '100%' }}
        dataArray={options}
        keyExtractor={(item, index) => `homeWeather${index.toString()}`}
        renderRow={(option) => {
          return (
            <ListItem
              onPress={async () => setOldHome(await updateHome(option))}
            >
              <Left>
                <Text style={{ color: 'white' }}>
                  {option}
                </Text>
              </Left>
              <Right>
                <Radio
                  color='#f0ad4e'
                  selectedColor='#6699CC'
                  selected={option == oldHome}
                />
              </Right>
            </ListItem>
          );
        }} />
    </View>
  )
}

export default SettingsAccount = function () {
  let [modalVisible, setModal] = useState(false);
  let [passwordChange, setPassWordChange] = useState(false);
  let [unitChange, setUnitChange] = useState(false);
  let [homeChange, setHomeChange] = useState(false);
  return (
    <Container>
      <Header />
      <Container style={styles.content}>
        <Text style={styles.title}>Account</Text>
        <Pressable
          style={styles.press}
          onPress={() => {
            setPassWordChange(true);
            setModal(true);
          }}
        >
          <Feather name='lock' size={24} color='white' />
          <Text style={styles.text}>
            Change Password
        </Text>
        </Pressable>

        <Pressable
          style={styles.press}
          onPress={() => {
            setUnitChange(true);
            setModal(true);
          }}
        >
          <Feather name='thermometer' size={24} color='white' />
          <Text style={styles.text}>
            Change Units
        </Text>
        </Pressable>

        <Pressable
          style={styles.press}
          onPress={() => {
            setHomeChange(true);
            setModal(true);
          }}
        >
          <Feather name='home' size={24} color='white' />
          <Text style={styles.text}>
            Home Weather View
        </Text>
        </Pressable>

        <Modal
          style={styles.modal}
          isVisible={modalVisible}
          onBackdropPress={() => {
            setModal(false);
            setPassWordChange(false);
            setUnitChange(false);
            setHomeChange(false);
          }}
          onSwipeDirection='down'
          onSwipeComplete={() => {
            setModal(false);
            setPassWordChange(false);
            setUnitChange(false);
            setHomeChange(false);
          }}
          animationIn='slideInDown'
          animationOut='slideOutUp'
        >
          {passwordChange && <ChangePassword />}
          {unitChange && <ChangeUnits />}
          {homeChange && <ChangeHome />}
        </Modal>
      </Container>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: '#231F29',
  },
  title: {
    color: '#ffffff',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    paddingLeft: 10,
  },
  listItem: {
    marginVertical: 8,
    marginHorizontal: 0,
    width: '100%',
    justifyContent: 'center'
  },
  modal: {
    justifyContent: 'flex-start',
    margin: 10,
  },
  modalView: {
    backgroundColor: '#FFFFFF',
    height: 40,
  },
  modalContainer: {
    backgroundColor: '#231F29',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  press: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingLeft: 10,
    alignItems: 'center'
  },
  input: {
    height: 40,
    width: '100%',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  unitModalContainer: {
    backgroundColor: '#231F29',
    padding: 22,
    borderRadius: 4,
  },
  warning: {
    color: '#FFFFFF',
    marginTop: 20,
  },
});

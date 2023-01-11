import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Linking,
} from 'react-native';
import { windowWidth, fonts } from '../../utils/fonts';
import { getData, storeData } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

export default function Account({ navigation, route }) {
  const [user, setUser] = useState({});
  const [com, setCom] = useState({});
  const isFocused = useIsFocused();
  const [wa, setWA] = useState('');



  useEffect(() => {
    if (isFocused) {
      getData('user').then(res => {
        setUser(res);
        console.error(res);
      });

    }
  }, [isFocused]);

  const btnKeluar = () => {
    storeData('user', null);

    navigation.replace('Login');
  };

  const kirimWa = x => {
    Linking.openURL(
      'https://api.whatsapp.com/send?phone=' +
      x +
      '&text=Halo%20NIAGA%20BUSANA',
    );
  };

  const MYListData = ({ label, value }) => {
    return <View
      style={{
        marginVertical: 3,
        padding: 10,
        backgroundColor: colors.white,
        borderRadius: 10,
      }}>
      <Text
        style={{
          fontFamily: fonts.secondary[600],
          color: colors.black,
        }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: fonts.secondary[400],
          color: colors.primary,
        }}>
        {value}
      </Text>
    </View>
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background1,
    }}>
      <View style={{ padding: 10 }}>

        <MYListData label="Name" value={user.nama_lengkap} />
        <MYListData label="Departement" value={user.departement} />
        <MYListData label="Join Date" value={user.tanggal_daftar} />
        <MYListData label="Barcode" value={user.barcode} />
        <MYListData label="Birthday" value={user.tanggal_lahir} />
        <MYListData label="Email" value={user.email} />
        <MYListData label="Phone Number" value={user.telepon} />

        {/* button */}
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <View style={{
            flex: 1,
            paddingRight: 5,
          }}>
            <MyButton
              onPress={() => navigation.navigate('EditProfile', user)}
              title="Edit Profile"
              colorText={colors.white}
              iconColor={colors.white}
              warna={colors.secondary}
              Icons="create-outline"
            />
          </View>
          <View style={{
            flex: 1,
            paddingLeft: 5,
          }}>
            <MyButton
              onPress={btnKeluar}
              title="Keluar"
              colorText={colors.white}
              iconColor={colors.white}
              warna={colors.primary}
              Icons="log-out-outline"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});

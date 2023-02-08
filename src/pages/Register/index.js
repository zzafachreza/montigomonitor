import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View,
  Image,
  ScrollView,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import { showMessage } from 'react-native-flash-message';
import LottieView from 'lottie-react-native';
import { api_token, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'

export default function Register({ navigation }) {

  const inputRef = useRef();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buka, setbuka] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const validate = text => {
    // console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      // console.log('Email is Not Correct');
      setData({ ...data, email: text });
      setValid(false);
      return false;
    } else {
      setData({ ...data, email: text });
      setValid(true);
      // console.log('Email is Correct');
    }
  };

  const [data, setData] = useState({
    api_token: api_token,
    level: 'user',
    nama_lengkap: '',
    password: '',
    departement: '',
    barcode: '',
    tanggal_lahir: new Date(),
    tanggal_lahirshow: '',
    email: '',
    tanggal_lahirset: new Date(),
    telepon: '',

  });

  const simpan = () => {

    if (data.nama_lengkap.length === 0) {
      showMessage({
        message: 'Name must not be empty',
      });
    } else if (data.password.length === 0) {
      showMessage({
        message: 'Password must not be empty',
      });
    } else if (data.telepon.length === 0) {
      showMessage({
        message: 'Phone Number must not be empty',
      });
    } else {
      setLoading(true);
      console.log(data);
      axios
        .post(urlAPI + 'register', data)
        .then(res => {
          console.warn(res.data);

          if (res.data.status == 404) {
            setLoading(false);
            showMessage({
              message: res.data.message,
              type: 'danger',
            });
          } else {
            setLoading(false);
            navigation.replace('Success', {
              messege: res.data.message,
            });
          }


        });
    }
  };




  return (
    <SafeAreaView style={{
      flex: 1,
      padding: 10,
      backgroundColor: colors.white,
    }}>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.page}>



        <View style={{
          padding: 10,
        }}>
          <MyGap jarak={10} />
          {/* <MyPicker label="Level" iconname="list" value={data.level} onValueChange={x => setData({
            ...data,
            level: x
          })} data={[
            { value: 'admin', label: 'admin' },
            { value: 'super admin', label: 'super admin' },
            { value: 'user', label: 'user' },
          ]} /> */}
          <MyGap jarak={10} />
          <MyInput
            label="Name"
            iconname="person"
            placeholder="Enter your name"
            value={data.nama_lengkap}
            onChangeText={value =>
              setData({
                ...data,
                nama_lengkap: value,
              })
            }
          />










          <MyGap jarak={10} />
          <MyInput
            label="Password"
            iconname="key"
            placeholder="Enter your password"
            secureTextEntry={buka}
            value={data.password}
            onChangeText={value =>
              setData({
                ...data,
                password: value,
              })
            }
          />

          <MyGap jarak={10} />
          {/* <MyInput
            label="Departement"
            placeholder="Enter departement"
            iconname="list"
            value={data.departement}
            onChangeText={value =>
              setData({
                ...data,
                departement: value,
              })
            }
          /> */}


          <MyGap jarak={10} />
          <MyInput
            label="Barcode"
            iconname="barcode"
            placeholder="Enter your barcode"
            value={data.barcode}
            onChangeText={value =>
              setData({
                ...data,
                barcode: value,
              })
            }
          />

          <MyGap jarak={10} />


          <MyInput

            value={data.tanggal_lahir}
            // onFocus={() => setShow(true)}
            // onBlur={() => setShow(false)}
            placeholder="Example : 1995-02-23"
            label="Enter your birthday (yyyy-mm-dd)"
            iconname="calendar"
            maxLength={10}

            onChangeText={value =>
              setData({
                ...data,
                tanggal_lahir: value,
              })
            }
          />




          <MyGap jarak={10} />
          <MyInput
            ref={inputRef}
            label="Email"
            iconname="mail"
            placeholder="Enter your email"
            value={data.email}
            onChangeText={value =>
              setData({
                ...data,
                email: value,
              })
            }
          />
          <MyGap jarak={10} />
          <MyInput
            label="Phone No"
            iconname="call"
            keyboardType="phone-pad"
            placeholder="Enter your phone number"
            value={data.telepon}
            onChangeText={value =>
              setData({
                ...data,
                telepon: value,
              })
            }
          />



          <MyGap jarak={20} />

          <MyButton
            warna={colors.primary}
            title="REGISTER"
            Icons="log-in"
            onPress={simpan}
          />

          <MyGap jarak={20} />
        </View>
      </ScrollView>
      {loading && (
        <LottieView
          source={require('../../assets/animation.json')}
          autoPlay
          loop
          style={{
            flex: 1,
            backgroundColor: colors.border_list,
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },

});

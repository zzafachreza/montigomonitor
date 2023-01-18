import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Linking,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { storeData, getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import MyCarouser from '../../components/MyCarouser';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import 'intl';
import 'intl/locale-data/jsonp/en';
import LottieView from 'lottie-react-native';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';
import { useNavigation } from '@react-navigation/native';


export default function MyHeader({ telepon }) {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [company, setCompany] = useState({});
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      axios.post(urlAPI + 'company').then(x => {
        console.log('company', x.data)
        setCompany(x.data);
      })
    }
  }, [isFocused])


  return (


    <View style={{
      padding: 0,
    }}>
      <Text style={{
        marginHorizontal: 10,
        fontFamily: fonts.secondary[600],
        fontSize: windowWidth / 35
      }}>{company.judul}</Text>
      <Text style={{
        marginHorizontal: 10,
        marginBottom: 10,
        fontFamily: fonts.secondary[400],
        fontSize: windowWidth / 40
      }}>{company.deskripsi}</Text>
    </View>

  );
}


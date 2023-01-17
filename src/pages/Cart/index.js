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
import MyHeader from '../../components/MyHeader';
import { showMessage } from 'react-native-flash-message';
import YoutubePlayer from "react-native-youtube-iframe";
export default function Cart({ navigation }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);
      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'montigomonitor', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });




    if (isFocused) {
      __getTransaction();
    }
    return unsubscribe;
  }, [isFocused]);


  const __getTransaction = async () => {

    getData('user').then(u => {

      setUser(u);
      axios.post(urlAPI + 'posting_like', {
        fid_user: u.id
      }).then(d => {
        console.log(d.data);
        setData(d.data);
      })
    });



  }



  const likePosting = (x, y) => {


    axios.post(urlAPI + 'like', {
      fid_user: y,
      fid_posting: x
    }).then(res => {
      console.log(res.data);
      showMessage({
        type: 'success',
        message: res.data.message
      });
      __getTransaction();
    })


  }

  const unlikePosting = (x, y) => {
    axios.post(urlAPI + 'unlike', {
      fid_user: y,
      fid_posting: x
    }).then(res => {
      console.log(res.data);
      showMessage({
        type: 'success',
        message: res.data.message
      });
      __getTransaction();
    })
  }



  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;





  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>




      <ScrollView style={{

        backgroundColor: colors.background1
      }}>

        {data.map(item => {
          return (
            <View style={{
              marginVertical: 5,
            }}>
              <View style={{
                flexDirection: 'row',
                padding: 10,
                alignItems: 'center'
              }}>
                <View>
                  <Image style={{
                    width: 30,
                    borderRadius: 15,
                    height: 30,
                  }} source={{
                    uri: item.foto_user
                  }} />
                </View>
                <View style={{
                  paddingLeft: 10,
                }}>

                  <View style={{
                    flexDirection: 'row'
                  }}>
                    <Text style={{
                      right: 5,
                      fontFamily: fonts.secondary[600]
                    }}>{item.nama_lengkap}</Text>
                    <Image style={{
                      width: 15,
                      height: 15,
                    }} source={require('../../assets/cek.png')} />
                  </View>
                  <Text style={{
                    right: 5,
                    color: colors.black,
                    fontFamily: fonts.secondary[300]
                  }}>{item.departement}</Text>
                </View>

              </View>

              {item.tipe == 'Photo' && <View>
                <Image style={{
                  width: windowWidth,
                  height: windowWidth / 1.2,
                }} source={{
                  uri: item.link
                }} />
              </View>}

              {item.tipe == 'Video' && <View>
                <YoutubePlayer
                  play={false}
                  height={250}
                  videoId={item.link}
                />

              </View>}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <View style={{
                  height: 50,
                  justifyContent: 'center'
                }}>
                  {item.oke == 0 && <TouchableOpacity onPress={() => likePosting(item.id_posting, user.id)} style={{
                    padding: 10,
                  }}>
                    <Icon type='ionicon' name={'heart-outline'} size={windowHeight / 32} color={colors.black} />
                  </TouchableOpacity>}

                  {item.oke > 0 && <TouchableOpacity onPress={() => unlikePosting(item.id_posting, user.id)} style={{
                    padding: 10,
                  }}>
                    <Icon type='ionicon' name={'heart'} size={windowHeight / 32} color={colors.danger} />
                  </TouchableOpacity>}
                </View>
                <View style={{
                  height: 50,
                  justifyContent: 'center'
                }}>
                  <TouchableOpacity style={{
                    padding: 10,
                  }}>
                    <Icon type='ionicon' name='chatbubble-outline' size={windowHeight / 35} colors={colors.black} />
                  </TouchableOpacity>
                </View>


              </View>
              {/*  */}
              <View style={{
                paddingHorizontal: 10,
              }}>
                <Text style={{
                  color: colors.black,
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 32,
                }}>{item.like} Suka</Text>
                <Text style={{
                  marginTop: 5,
                  color: colors.black,
                  fontFamily: fonts.secondary[600],
                  fontSize: windowWidth / 32,
                }}>{item.nama_lengkap} <Text style={{
                  color: colors.black,
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 32,
                }}>{item.desc}</Text></Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('Komentar', item)} style={{
                paddingHorizontal: 10,
              }}>

                <Text style={{
                  marginTop: 5,
                  color: colors.border,
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 32,
                }}>Tampilkan semua {item.komentar} komentar
                </Text>
              </TouchableOpacity>
              <View style={{
                paddingHorizontal: 10,
              }}>
                <Text style={{
                  marginTop: 5,
                  color: colors.border,
                  fontFamily: fonts.secondary[400],
                  fontSize: windowWidth / 32,
                }}>{item.tanggal}
                </Text>
              </View>
            </View>
          )
        })}


        <MyGap jarak={20} />
      </ScrollView>

    </SafeAreaView>
  );
}

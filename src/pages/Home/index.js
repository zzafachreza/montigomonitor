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

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [kategori, setKategori] = useState([]);

  const [produk, setProduk] = useState([]);
  const [cart, setCart] = useState(0);
  const [token, setToken] = useState('');
  const [comp, setComp] = useState({});

  const isFocused = useIsFocused();

  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      const json = JSON.stringify(remoteMessage);
      const obj = JSON.parse(json);

      // console.log(obj);

      // alert(obj.notification.title)

      PushNotification.localNotification({
        /* Android Only Properties */
        channelId: 'montigomonitor', // (required) channelId, if the channel doesn't exist, notification will not trigger.
        title: obj.notification.title, // (optional)
        message: obj.notification.body, // (required)
      });
    });


    getDataKategori();

    axios.post(urlAPI + '/company.php').then(c => {
      console.log(c.data);
      setComp(c.data);
    })

    if (isFocused) {
      __getDataUserInfo();
    }
    return unsubscribe;
  }, [isFocused]);




  const getDataKategori = () => {
    axios.post(urlAPI + '/1data_kategori.php').then(res => {
      console.log('kategori', res.data);

      setKategori(res.data);
    })
  }



  const __getDataUserInfo = () => {
    getData('user').then(users => {
      console.log(users);
      setUser(users);

      getData('token').then(res => {
        console.log('data token,', res);
        setToken(res.token);
        axios
          .post(urlAPI + '/update_token.php', {
            id: users.id,
            token: res.token,
          })
          .then(res => {
            console.error('update token', res.data);
          });
      });
    });
  }

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const ratio = 192 / 108;



  const MYPost = ({ pp, username, img, like, desc }) => {
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
              uri: pp
            }} />
          </View>
          <View style={{
            paddingLeft: 10,
            paddingRight: 2,
          }}>
            <Text style={{

              fontFamily: fonts.secondary[600]
            }}>{username}</Text>
          </View>
          <View>
            <Image style={{
              width: 15,
              height: 15,
            }} source={require('../../assets/cek.png')} />
          </View>
        </View>
        <View>
          <Image style={{
            width: windowWidth,
            height: windowWidth / 1.2,
          }} source={{
            uri: img
          }} />
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View style={{
            height: 50,
            justifyContent: 'center'
          }}>
            <TouchableOpacity style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='heart-outline' size={windowHeight / 32} colors={colors.black} />
            </TouchableOpacity>
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
          <View style={{
            height: 50,
            justifyContent: 'center'
          }}>
            <TouchableOpacity style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='paper-plane-outline' size={windowHeight / 32} colors={colors.black} />
            </TouchableOpacity>
          </View>
          <View style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-end'
          }}>
            <TouchableOpacity style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='bookmark-outline' size={windowHeight / 32} colors={colors.black} />
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
          }}>{like} Suka</Text>
          <Text style={{
            marginTop: 5,
            color: colors.black,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 32,
          }}>{username} <Text style={{
            color: colors.black,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 32,
          }}>{desc}</Text></Text>
        </View>
        {/* /komentar */}

        <View style={{
          paddingHorizontal: 10,
        }}>

          <Text style={{
            marginTop: 5,
            color: colors.border,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 32,
          }}>Lihat semua komentar
          </Text>
        </View>


        <View style={{
          paddingHorizontal: 10,
        }}>

          <Text style={{
            marginTop: 5,
            color: colors.black,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 32,
          }}>Dani_Official <Text style={{
            color: colors.black,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 32,
          }}>siap bos wkwk </Text></Text>

          <Text style={{
            marginTop: 5,
            color: colors.black,
            fontFamily: fonts.secondary[600],
            fontSize: windowWidth / 32,
          }}>Indah289 <Text style={{
            color: colors.black,
            fontFamily: fonts.secondary[400],
            fontSize: windowWidth / 32,
          }}>ayo maju indonesia!</Text></Text>
        </View>
      </View>
    )
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      {/* header */}
      <View style={{
        flexDirection: 'row',
        height: 60,
        padding: 10,
      }}>
        <View style={{
          flex: 1,
        }}>
          <Image source={require('../../assets/logo.png')} style={{
            width: 100,
            resizeMode: 'contain',
            height: 50,
          }} />
        </View>
        <View style={{
          height: 50,
          marginHorizontal: 5,
          justifyContent: 'center'
        }}>
          <TouchableOpacity style={{
            padding: 10,
          }}>
            <Icon type='ionicon' name='add-circle-outline' size={windowHeight / 30} colors={colors.black} />
          </TouchableOpacity>
        </View>
        <View style={{
          height: 50,
          marginHorizontal: 5,
          justifyContent: 'center'
        }}>
          <TouchableOpacity style={{
            padding: 10,
          }}>
            <Icon type='ionicon' name='heart-outline' size={windowHeight / 30} colors={colors.black} />
          </TouchableOpacity>
        </View>
        <View style={{
          height: 50,
          marginHorizontal: 5,
          justifyContent: 'center'
        }}>
          <TouchableOpacity style={{
            padding: 10,
          }}>
            <Icon type='ionicon' name='paper-plane-outline' size={windowHeight / 30} colors={colors.black} />
          </TouchableOpacity>
        </View>
      </View>





      <ScrollView style={{

        backgroundColor: colors.background1
      }}>



        <MYPost
          pp='https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZmFjZXxlbnwwfDJ8MHx8&auto=format&fit=crop&w=500&q=60'
          username="agungjuaedi99"
          img='https://images.unsplash.com/photo-1472213984618-c79aaec7fef0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1455&q=80'
          like="1.292"
          desc="Belajarlah dari hari hari kemarin dan hiduplah untuk hari ini, lalu berharaplah untuk hari esok."

        />
        <MYPost
          pp='https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg'
          username="fadhlan_himwawan"
          img='https://images.unsplash.com/photo-1516689807549-04b4c3b4ee35?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80'
          like="1.292"
          desc="Impian tidak dapat terwujud dengan sendirinya, akan tetapi impian akan datang ketika seseorang berusaha untuk meraihnya."

        />
        <MYPost
          pp='https://i0.wp.com/www.zwivel.com/blog/wp-content/uploads/2017/11/Johnny-Depp.jpg?resize=800%2C602&ssl=1'
          username="febriharyadi"
          img='https://images.unsplash.com/photo-1608142172765-6949c94646ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=580&q=80'
          like="1.292"
          desc="Kamu memiliki waktu terbatas, sehingga jangan sia-siakan waktu itu untuk menjalani kehidupan orang lain."

        />


      </ScrollView>

    </SafeAreaView>
  );
}

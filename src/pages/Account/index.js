import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Linking,
  FlatList,
  ScrollView,
  Alert,
} from 'react-native';
import { windowWidth, fonts, windowHeight } from '../../utils/fonts';
import { getData, MYAPP, storeData, urlAPI } from '../../utils/localStorage';
import { colors } from '../../utils/colors';
import { MyButton, MyGap } from '../../components';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import YoutubePlayer from "react-native-youtube-iframe";
import { showMessage } from 'react-native-flash-message';
import Share from 'react-native-share';
export default function Account({ navigation, route }) {
  const [user, setUser] = useState({});
  const [com, setCom] = useState({});
  const isFocused = useIsFocused();
  const [wa, setWA] = useState('');



  useEffect(() => {
    if (isFocused) {

      getPosting()


    }
  }, [isFocused]);

  const [data, setData] = useState([]);
  const getPosting = () => {

    getData('user').then(res => {
      setUser(res);
      console.error(res);
      axios.post(urlAPI + 'posting_data', {
        fid_user: res.id
      }).then(d => {
        console.log(d.data);
        setData(d.data);
      })


    });
  }

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

  const __renderItem = ({ item }) => {
    return (

      <View>
        <Text>{item.nama_lengkap}</Text>
      </View>

    )
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: colors.background1,
    }}>

      <ScrollView>



        <View style={{
          padding: 10,
        }}>
          <View style={{
            flexDirection: 'row'
          }}>

            <View style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image style={{
                width: 100,
                borderRadius: 50,
                height: 100,
              }} source={{
                uri: user.foto_user,
              }} />

            </View>
            {/* button */}
            <View style={{ padding: 10, flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <View style={{
                flex: 1,
                paddingRight: 5,
              }}>
                <MyButton
                  onPress={() => navigation.navigate('AccountEdit', user)}
                  title="Edit Profile"
                  borderSize={1}
                  borderColor={colors.zavalabs}
                  colorText={colors.black}
                  iconColor={colors.black}
                  warna={colors.white}
                  Icons="create-outline"
                />
              </View>
              <View style={{
                flex: 1,
                paddingLeft: 5,
              }}>
                <MyButton
                  onPress={btnKeluar}
                  title="Logout"
                  borderSize={1}
                  borderColor={colors.zavalabs}
                  colorText={colors.black}
                  iconColor={colors.black}
                  warna={colors.white}
                  Icons="log-out-outline"
                />
              </View>
            </View>
          </View>

          <View style={{
            flexDirection: 'row'
          }}>
            <View>
              <Text
                style={{
                  fontFamily: fonts.secondary[600],
                  color: colors.black,
                  marginRight: 5,
                }}>
                {user.nama_lengkap}
              </Text>
            </View>
            <View>
              <Image style={{
                width: 15,
                height: 15,
              }} source={require('../../assets/cek.png')} />
            </View>
          </View>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              color: colors.black,
              marginRight: 5,
            }}>
            {user.departement}
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              color: colors.black,
              marginRight: 5,
            }}>
            {user.telepon}
          </Text>
          <Text
            style={{
              fontFamily: fonts.secondary[400],
              color: colors.primary,
              marginRight: 5,
            }}>
            {user.email}
          </Text>
        </View>




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
                  flex: 1,
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
                <TouchableOpacity onPress={() => Alert.alert(MYAPP, 'Delete this post ?', [
                  {
                    style: 'cancel',
                    text: 'Cancel'
                  },
                  {
                    text: 'Delete',
                    onPress: () => {
                      console.log(item.id_posting);
                      axios.post(urlAPI + 'posting_delete', {
                        id_posting: item.id_posting
                      }).then(res => {
                        getPosting();
                        showMessage({
                          message: res.data.message,
                          type: 'success'
                        })
                      })
                    }
                  }
                ])}>
                  <Icon type='ionicon' name='trash-outline' size={20} />
                </TouchableOpacity>
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

              {/*  */}
              <View style={{
                marginTop: 10,
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

const styles = StyleSheet.create({});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { getData, urlAPI } from '../../utils/localStorage';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { useIsFocused } from '@react-navigation/native';
import { MyGap } from '../../components';
import { showMessage } from 'react-native-flash-message';
import YoutubePlayer from "react-native-youtube-iframe";
import Share from 'react-native-share';
import MyHeader from '../../components/MyHeader';

export default function Home({ navigation }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const isFocused = useIsFocused();



  useEffect(() => {


    if (isFocused) {
      __getTransaction();
    }
  }, [isFocused]);



  const __getTransaction = () => {



    getData('user').then(u => {
      setUser(u);
      axios.post(urlAPI + 'posting_all', {
        fid_user: u.id
      }).then(d => {
        setData(d.data);
      })
    });



  }



  const likePosting = (x, y) => {

    axios.post(urlAPI + 'like', {
      fid_user: y,
      fid_posting: x
    }).then(res => {

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

      showMessage({
        type: 'success',
        message: res.data.message
      });
      __getTransaction();
    })
  }



  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;


  const __renderItem = ({ item }) => {
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

        {item.tipe == 'Photo' && <TouchableOpacity onPress={() => navigation.navigate('Akses', {
          kode: item.kode
        })}>
          <Image style={{
            width: windowWidth,
            height: windowWidth / 1.2,
          }} source={{
            uri: item.link
          }} />
        </TouchableOpacity>}

        {item.tipe == 'Video' && <View>
          <YoutubePlayer
            lay={false}
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
            <TouchableOpacity onPress={() => navigation.navigate('Komentar', item)} style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='chatbubble-outline' size={windowHeight / 35} colors={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={{
            height: 50,
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={() => {
              Share.open({
                url: item.tipe == "Video" ? 'https://youtu.be/' + item.link : 'https://montigo.okeadmin.com/image/index.php?link=' + item.link + '&isi=' + encodeURI(item.desc),
                title: item.nama_lengkap,
                message: item.desc
              })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  err && console.log(err);
                });
            }} style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='share-social-outline' size={windowHeight / 35} colors={colors.black} />
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
  }





  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      {/* header */}
      <View style={{
        paddingHorizontal: 0,
      }}>
        <View style={{
          flexDirection: 'row',
          height: 60,

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

          {user.level !== 'user' && <View style={{
            height: 50,
            marginHorizontal: 5,
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={() => navigation.navigate('Add', user)} style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='add-circle-outline' size={windowHeight / 30} colors={colors.black} />
            </TouchableOpacity>
          </View>}

          <View style={{
            height: 50,
            marginHorizontal: 5,
            justifyContent: 'center'
          }}>
            <TouchableOpacity onPress={() => navigation.navigate('Cart', user)} style={{
              padding: 10,
            }}>
              <Icon type='ionicon' name='heart-outline' size={windowHeight / 30} colors={colors.black} />
            </TouchableOpacity>
          </View>

        </View>




        <MyHeader />
      </View>



      <FlatList data={data} showsVerticalScrollIndicator={false} renderItem={__renderItem} />





    </SafeAreaView>
  );
}

import React, { useState, useEffect, useRef } from 'react';
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
    StyleSheet,
    Linking,
    TextInput,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
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
import { Swipeable } from 'react-native-gesture-handler';
export default function Komentar({ navigation, route }) {

    const [kirim, setKirim] = useState({
        fid_posting: route.params.id_posting,
        komentar: '',

    });
    const [user, setUser] = useState({})

    useEffect(() => {

        getKomentar();
        getData('user').then(u => {
            setUser(u);
            setKirim({
                ...kirim,
                fid_user: u.id,
            })
        })
    }, [])

    const item = route.params;

    const inputRef = useRef();

    const sendServer = () => {
        console.log(kirim);

        inputRef.current.blur();

        axios.post(urlAPI + 'komentar_add', kirim).then(res => {
            console.log(res.data);
            // showMessage({
            //     type: 'success',
            //     message: res.data.message
            // })
            getData('user').then(u => {
                setUser(u);
                setKirim({
                    ...kirim,
                    komentar: '',
                    fid_user: u.id,
                })
            })
            getKomentar();
        })
    }

    const [data, setData] = useState([]);

    const getKomentar = () => {
        axios.post(urlAPI + 'komentar', {
            fid_posting: route.params.id_posting
        }).then(res => {
            console.log(res.data);
            setData(res.data);

        })


    }

    const hapusKomentar = (x) => {

        axios.post(urlAPI + 'komentar_delete', {
            id_komentar: x
        }).then(res => {
            console.log(res.data);
            getKomentar();
            showMessage({
                type: 'success',
                message: res.data.message
            })

        })
    }

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white
        }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{
                padding: 10,
            }}>
                <View style={{
                    marginVertical: 5,
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    marginBottom: 10,
                    borderBottomColor: colors.zavalabs,
                }}>
                    <View style={{
                        flexDirection: 'row',
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
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={{

                                    fontFamily: fonts.secondary[600]
                                }}>{item.nama_lengkap}</Text>
                                <Image style={{
                                    left: 5,
                                    width: 15,
                                    height: 15,
                                }} source={require('../../assets/cek.png')} />
                            </View>
                            <View style={{
                                paddingRight: 5,
                            }}>
                                <Text style={{
                                    color: colors.black,
                                    fontFamily: fonts.secondary[400],
                                    fontSize: windowWidth / 32,
                                }}>{item.desc}</Text>
                            </View>
                        </View>
                    </View>




                </View>

                {/* komentart */}

                {data.map(k => {
                    return (
                        <Swipeable renderRightActions={() => {
                            return (

                                user.id == k.fid_user && <TouchableOpacity onPress={() => hapusKomentar(k.id_komentar)} style={{
                                    backgroundColor: colors.danger,
                                    padding: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Icon type='ionicon' name='trash' color={colors.white} />
                                </TouchableOpacity>
                            )
                        }}>
                            <View style={{

                                marginVertical: 10,

                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <View>
                                        <Image style={{
                                            width: 30,
                                            borderRadius: 15,
                                            height: 30,
                                        }} source={{
                                            uri: k.foto_user
                                        }} />
                                    </View>
                                    <View style={{
                                        paddingLeft: 10,
                                        flex: 1,
                                    }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{

                                                fontFamily: fonts.secondary[600]
                                            }}>{k.nama_lengkap}</Text>
                                            <Image style={{
                                                left: 5,
                                                width: 15,
                                                height: 15,
                                            }} source={require('../../assets/cek.png')} />
                                        </View>
                                        <View style={{
                                            flex: 1,
                                            paddingRight: 5,
                                            flexDirection: 'row'
                                        }}>
                                            <Text style={{
                                                color: colors.black,
                                                flex: 1,
                                                fontFamily: fonts.secondary[400],
                                                fontSize: windowWidth / 32,
                                            }}>{k.komentar}</Text>
                                            <Text style={{
                                                color: colors.black,
                                                fontFamily: fonts.secondary[400],
                                                fontSize: windowWidth / 32,
                                            }}>{k.tanggal_komentar}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Swipeable>
                    )
                })}
            </ScrollView>
            <View style={{
                padding: 10,
                backgroundColor: colors.white,
                flexDirection: 'row'
            }}>
                <View>
                    <Image style={{
                        width: 40,
                        height: 40,
                        borderRadius: 25,
                    }} source={{
                        uri: user.foto_user
                    }} />
                </View>
                <View style={{
                    flex: 1,
                    paddingHorizontal: 10,
                }}>
                    <TextInput ref={inputRef} value={kirim.komentar} onChangeText={x => setKirim({
                        ...kirim,
                        komentar: x
                    })} placeholder='Add your comment..' style={{
                        height: 40,
                        fontFamily: fonts.secondary[400],
                        color: colors.black,
                        paddingLeft: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.border_list,
                        backgroundColor: colors.white
                    }} multiline />
                </View>
                <View>
                    <TouchableOpacity onPress={sendServer} style={{
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 40,
                        borderRadius: 10,
                        backgroundColor: colors.primary,
                    }}>
                        <Icon type='ionicon' name='paper-plane-outline' color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    )
}


const styles = StyleSheet.create({})
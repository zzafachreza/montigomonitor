import React, { useState, useEffect } from 'react';
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
    SafeAreaView,
} from 'react-native';
import { colors } from '../../utils/colors';
import { fonts } from '../../utils/fonts';
import { MyInput, MyGap, MyButton, MyPicker } from '../../components';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import { api_token, getData, storeData, urlAPI } from '../../utils/localStorage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { showMessage } from 'react-native-flash-message';
import DatePicker from 'react-native-date-picker';
import { Icon } from 'react-native-elements';

export default function AccountEdit({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        api_token: api_token,
    });

    useEffect(() => {
        getData('user').then(res => {
            setData({
                ...data,
                nama_lengkap: res.nama_lengkap,
                id: res.id,
                email: res.email,
                telepon: res.telepon,
                departement: res.departement,
                tanggal_lahir: res.tanggal_lahir,
                newfoto_user: null,
                foto_user: res.foto_user
            });
            console.error('data user', res);
        });
        console.log('test edit');
    }, []);


    const simpan = () => {
        setLoading(true);
        console.log('kirim edit', data);
        axios.post(urlAPI + 'profile_update', data).then(res => {
            console.log(res.data);
            storeData('user', res.data.data);
            setLoading(false);
            showMessage({
                type: 'success',
                message: 'your profile has been updated.',
            });
            navigation.replace('MainApp');
        });
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            padding: 10,
            backgroundColor: colors.white,
        }}>
            <ScrollView showsVerticalScrollIndicator={false}>

                <View style={{
                    padding: 10,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => {


                        launchImageLibrary({
                            includeBase64: true,
                            quality: 1,
                            mediaType: "photo",
                            maxWidth: 120,
                            maxHeight: 120
                        }, response => {
                            // console.log('All Response = ', response);

                            setData({
                                ...data,
                                newfoto_user: `data:${response.type};base64, ${response.base64}`,
                            });
                        });



                    }} style={{
                        width: 100,
                        height: 100,
                        borderWidth: 3,
                        borderColor: colors.primary,
                        overflow: 'hidden',
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image style={{
                            width: 100,
                            height: 100,
                        }} source={{
                            uri: data.newfoto_user !== null ? data.newfoto_user : data.foto_user,
                        }} />
                    </TouchableOpacity>
                </View>

                <MyInput
                    label="Name"
                    iconname="person-outline"
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
                    label="Phone Number"
                    iconname="call-outline"
                    keyboardType="number-pad"
                    value={data.telepon}
                    onChangeText={value =>
                        setData({
                            ...data,
                            telepon: value,
                        })
                    }
                />

                <MyGap jarak={10} />

                <MyInput
                    label="Departement"
                    iconname="list-outline"
                    multiline={true}
                    value={data.departement}
                    onChangeText={value =>
                        setData({
                            ...data,
                            departement: value,
                        })
                    }
                />

                <MyGap jarak={10} />

                <MyInput
                    label="Birthday ( year-month-day )"
                    iconname="calendar-outline"
                    multiline={true}
                    value={data.tanggal_lahir}
                    onChangeText={value =>
                        setData({
                            ...data,
                            tanggal_lahir: value,
                        })
                    }
                />






                <MyGap jarak={10} />
                <MyInput
                    label="Password"
                    placeholder="Kosongkan jika tidak diubah"
                    iconname="key-outline"
                    secureTextEntry
                    value={data.newpassword}
                    onChangeText={value =>
                        setData({
                            ...data,
                            newpassword: value,
                        })
                    }
                />

                <MyGap jarak={20} />
                <MyButton
                    warna={colors.primary}
                    title="Simpan Perubahan"
                    Icons="log-in"
                    onPress={simpan}
                />
            </ScrollView>


            {loading && (
                <LottieView
                    source={require('../../assets/animation.json')}
                    autoPlay
                    loop
                    style={{
                        flex: 1,
                        backgroundColor: colors.border,
                    }}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({})
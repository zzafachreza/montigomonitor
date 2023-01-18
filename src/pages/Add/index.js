import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Modal, PermissionsAndroid, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MyPicker, MyGap, MyInput, MyButton } from '../../components';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../utils/colors';
import { fonts, windowHeight, windowWidth } from '../../utils/fonts';
import { Image } from 'react-native';
import { getData, MYAPP, urlAPI } from '../../utils/localStorage';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { Icon } from 'react-native-elements';
import { showMessage } from 'react-native-flash-message';
import MyHeader from '../../components/MyHeader';

export default function ({ navigation, route }) {

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: "Cool Photo App Camera Permission",
                    message:
                        "Cool Photo App needs access to your camera " +
                        "so you can take awesome pictures.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera");
            } else {
                console.log("Camera permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    };


    const user = route.params;
    const [data, setData] = useState([]);
    const [kirim, setKirim] = useState({
        fid_user: route.params.id,
        desc: '',
        link: 'https://zavalabs.com/nogambar.jpg',
        tipe: 'Photo'
    });

    const [loading, setLoading] = useState(false);
    const __sendServer = () => {
        setLoading(true);
        console.log(kirim);

        axios.post(urlAPI + 'posting', kirim).then(res => {
            setLoading(false);
            console.log(res.data);
            showMessage({
                type: 'success',
                message: res.data.message

            });
            navigation.replace('MainApp');
        })


    }





    const options = {
        includeBase64: true,
        quality: 1,
        maxWidth: 750,
        maxHeight: 750
    };

    const getCamera = xyz => {
        launchCamera(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('Image Picker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                switch (xyz) {
                    case 1:
                        setKirim({
                            ...kirim,
                            link: `data:${response.type};base64, ${response.base64}`,
                        });

                        break;
                }
            }
        });

    };

    const getGallery = xyz => {
        launchImageLibrary(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('Image Picker Error: ', response.error);
            } else {
                let source = { uri: response.uri };
                switch (xyz) {
                    case 1:
                        setKirim({
                            ...kirim,
                            link: `data:${response.type};base64, ${response.base64}`,
                        });

                        break;
                }
            }
        });
    };

    const UploadFoto = ({ onPress1, onPress2, label, foto }) => {
        return (
            <View
                style={{
                    borderWidth: 1,
                    borderColor: colors.zavalabs,
                    // borderRadius: 10,
                    justifyContent: 'center',
                    overflow: 'hidden',
                    alignItems: 'center'
                }}>

                <TouchableOpacity onPress={() => {

                    Alert.alert(MYAPP, 'Chose Upload your image from..', [
                        {
                            text: 'CANCEL',

                        },
                        {
                            text: 'CAMERA',
                            onPress: onPress1
                        },
                        {
                            text: 'GALLERY',
                            onPress: onPress2
                        }
                    ])

                }}>
                    <Image
                        source={{
                            uri: foto,
                        }}
                        style={{
                            width: windowWidth,
                            height: windowWidth / 1.2,
                        }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>


            </View>
        );
    };

    useEffect(() => {
        requestCameraPermission();
    }, [])

    return (
        <>
            <ScrollView>
                <SafeAreaView style={{
                    flex: 1,
                    padding: 10,
                    justifyContent: 'center',
                    backgroundColor: colors.background1
                }}>

                    <MyPicker label="Tipe Posting" iconname="list" onValueChange={x => setKirim({
                        ...kirim,
                        tipe: x
                    })} value={kirim.tipe} data={[
                        { value: 'Photo', label: 'Photo' },
                        { value: 'Video', label: 'Video' }
                    ]} />
                    <MyGap jarak={10} />
                    <MyInput value={kirim.desc} onChangeText={x => {
                        setKirim({
                            ...kirim,
                            desc: x
                        })
                    }} label="Enter Description your post" placeholder="input your description here..." multiline iconname="create" />

                    <MyGap jarak={10} />

                    {kirim.tipe === 'Video' && <MyInput onChangeText={x => {
                        setKirim({
                            ...kirim,
                            link: x
                        })
                    }} label="Enter your video link" placeholder="HTzMx24boDY" iconname="logo-youtube" />
                    }

                    {kirim.tipe === 'Photo' && <UploadFoto
                        onPress1={() => getCamera(1)}
                        onPress2={() => getGallery(1)}
                        foto={kirim.link}
                    />}




                    <MyGap jarak={10} />
                    {!loading && <MyButton onPress={__sendServer} title="Upload your post" Icons="cloud-upload-outline" warna={colors.primary} />}
                    {loading && <ActivityIndicator color={colors.primary} size="large" />}

                </SafeAreaView >
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({})
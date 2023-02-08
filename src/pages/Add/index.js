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
    const [foto, setFoto] = useState([]);
    const [data, setData] = useState([]);
    const [kirim, setKirim] = useState({
        fid_user: route.params.id,
        desc: '',
        link: 'https://zavalabs.com/nogambar.jpg',
        tipe: 'Photo'
    });

    const [loading, setLoading] = useState(false);
    const __sendServer = () => {
        console.log();

        if (kirim.tipe == 'Photo' && foto.length == 0) {
            showMessage({
                type: 'danger',
                message: 'Please upload at least 1 photo'
            })

        } else {
            // setLoading(true);
            console.log(kirim);

            axios.post(urlAPI + 'posting', {
                fid_user: route.params.id,
                desc: kirim.desc,
                link: kirim.link,
                tipe: kirim.tipe,
                foto: foto

            }).then(res => {
                setLoading(false);
                console.log(res.data);
                showMessage({
                    type: 'success',
                    message: res.data.message
                });
                navigation.replace('MainApp');
            })
        }




    }





    const options = {
        includeBase64: true,
        quality: 1,
        maxWidth: 1200,
        maxHeight: 1200
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
                        // setKirim({
                        //     ...kirim,
                        //     link: `data:${response.type};base64, ${response.base64}`,
                        // });
                        // setLink(`data:${response.type};base64, ${response.base64}`);
                        setFoto([...foto, `data:${response.type};base64, ${response.base64}`]);

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
                        // setKirim({
                        //     ...kirim,
                        //     link: `data:${response.type};base64, ${response.base64}`,
                        // });

                        // setLink(`data:${response.type};base64, ${response.base64}`);

                        setFoto([...foto, `data:${response.type};base64, ${response.base64}`]);
                        break;
                }
            }
        });
    };

    const UploadFoto = ({ onPress1, onPress2, label, foto }) => {
        return (
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
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: colors.zavalabs,
                        // borderRadius: 10,
                        justifyContent: 'center',
                        overflow: 'hidden',
                        alignItems: 'center'
                    }}>


                    <Image
                        key={0}
                        source={{
                            uri: 'https://zavalabs.com/nogambar.jpg',
                        }}
                        style={{
                            width: 100,
                            height: 100,
                        }}
                        resizeMode="contain"
                    />



                </View>
            </TouchableOpacity>
        );
    };

    const [desc, setDesc] = useState('');

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
                    <MyInput onChangeText={x => {
                        setKirim({
                            ...kirim,
                            desc: x
                        })
                        // setDesc(x)

                    }} label="Enter Description your post" placeholder="input your description here..." multiline iconname="create" />

                    <MyGap jarak={10} />

                    {kirim.tipe === 'Video' && <MyInput onChangeText={x => {
                        setKirim({
                            ...kirim,
                            link: x
                        })
                    }} label="Enter your video link" placeholder="HTzMx24boDY" iconname="logo-youtube" />
                    }

                    {kirim.tipe === 'Photo' &&

                        <ScrollView horizontal>
                            {foto.map(i => {
                                return (
                                    <View style={{
                                        margin: 2,
                                    }}>
                                        <Image source={{
                                            uri: i
                                        }} style={{
                                            width: 80,
                                            height: 80,
                                        }} />
                                        <TouchableOpacity onPress={() => {
                                            console.log(i);
                                            let deleted = foto.filter(x => x !== i);
                                            setFoto(deleted);
                                        }} style={{
                                            backgroundColor: colors.danger,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Icon color={colors.white} type='ionicon' name='trash' size={12} />
                                            <Text style={{
                                                fontFamily: fonts.secondary[400],
                                                color: colors.white
                                            }}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })}
                            <TouchableOpacity onPress={() => {

                                Alert.alert(MYAPP, 'Chose Upload your image from..', [
                                    {
                                        text: 'CANCEL',

                                    },
                                    {
                                        text: 'CAMERA',
                                        onPress: () => getCamera(1)
                                    },
                                    {
                                        text: 'GALLERY',
                                        onPress: () => getGallery(1)
                                    }
                                ])

                            }} style={{
                                margin: 2,
                            }}>
                                <Image source={{
                                    uri: 'https://zavalabs.com/nogambar.jpg'
                                }} style={{
                                    width: 80,
                                    height: 80,
                                }} />
                                <View onPress={() => { }} style={{
                                    backgroundColor: colors.border,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Icon color={colors.white} type='ionicon' name='add' size={12} />
                                    <Text style={{
                                        fontFamily: fonts.secondary[400],
                                        color: colors.white
                                    }}>Add Photo</Text>
                                </View>
                            </TouchableOpacity>

                        </ScrollView>

                    }





                    <MyGap jarak={10} />
                    {!loading && <MyButton onPress={__sendServer} title="Upload your post" Icons="cloud-upload-outline" warna={colors.primary} />}
                    {loading && <ActivityIndicator color={colors.primary} size="large" />}




                </SafeAreaView >
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({})
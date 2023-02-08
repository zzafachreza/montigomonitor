import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { urlAPI } from '../../utils/localStorage';
import Carousel from 'react-native-reanimated-carousel';
import { windowWidth } from '../../utils/fonts';
import { colors } from '../../utils/colors';
export default function Akses({ navigation, route }) {


  const [data, setData] = useState([]);

  useEffect(() => {

    axios.post(urlAPI + 'posting_foto', {
      kode: route.params.kode
    }).then(zvl => {
      console.log(zvl.data);
      setData(zvl.data);
    })

  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView>
        {data.map(i => {
          return (
            <Image style={{
              width: windowWidth,
              height: windowWidth,
              resizeMode: 'contain',
              marginVertical: 5,
            }} source={{
              uri: i.image
            }} />
          )
        })}
      </ScrollView>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({})
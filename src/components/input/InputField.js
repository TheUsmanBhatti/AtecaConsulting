import React, {useState} from "react";
import {View, Text, TouchableOpacity, TextInput} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from "../../configs/constants/colors";
import { FONTS } from "../../configs/constants/fonts"


const InputField = (props) => {

    const [showPassword, setShowPassword] = useState(true);

    return (
        <>
            <Text style={{ fontSize: 17, color: '#2b2b2b', marginBottom: 5, marginTop: 15, fontFamily: FONTS.mssb }}>{props.title}</Text>

            <View style={{ justifyContent: 'center' }}>
                <TextInput
                    secureTextEntry={showPassword ? props.secureTextEntry : false}
                    onChangeText={props.onChangeText}
                    placeholderTextColor={'#c5c5c5'}
                    placeholder={props.placeholder}
                    style={{
                        backgroundColor: '#fff',
                        padding: 10,
                        borderRadius: 10,
                        fontSize: 15,
                        borderWidth: 2,
                        borderColor: COLORS.secondary,
                        height: 48,
                        fontFamily: FONTS.msr,
                        color: '#000'
                    }} />

                {props.secureTextEntry && <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 0, padding: 10 }}>
                    <Icon name={!showPassword ? 'eye' : 'eye-off'} color={'#b5b5b5'} size={22} />
                </TouchableOpacity>}
            </View>

        </>
    )
}

export default InputField;
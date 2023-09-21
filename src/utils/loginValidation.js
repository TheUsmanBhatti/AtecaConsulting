import { validate } from 'react-email-validator';
import { showMessage, hideMessage } from "react-native-flash-message";

const loginValidation = (email, password) => {

    console.log(email.split('@')[0])

    if (email == '' && password == '') {
        showMessage({
            message: "Please enter Email and Password",
            backgroundColor: 'red'
        })
        return false
    }

    if (email == '') {
        showMessage({
            message: "Please enter your Email",
            backgroundColor: 'red'
        })
        return false
    }

    if (!validate(email)) {
        showMessage({
            message: "Please enter valid Email",
            backgroundColor: 'red'
        })
        return false
    }

    if (password == '') {
        showMessage({
            message: "Please enter your Password",
            backgroundColor: 'red'
        })
        return false
    }
    // if (email.split('@')[0] !== 'worker' && email.split('@')[0] !== 'supervisor') {
    //     showMessage({
    //         message: "User not found",
    //         backgroundColor: 'red'
    //     })
    //     return false
    // }

    return true;
}

module.exports = {loginValidation}
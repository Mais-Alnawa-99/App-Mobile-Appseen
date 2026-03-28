import React from 'react';
import {View, Button, Alert} from 'react-native';
import {
  AppleButton,
  appleAuth,
} from '@invertase/react-native-apple-authentication';
import {t} from 'i18next';

import reactotron from '../../../redux/reactotron';
import {useAppDispatch} from '../../../redux/store';
import {BW} from '../../../style/theme';
import {appleLogin} from '../../../redux/reducers/User/thunk/appleLogin';
import {setAuthValues} from '../../../redux/reducers/User/startup';
import NavigationService from '../../../naigation/NavigationService';
import {setModalData} from '../../../redux/reducers/modal';

const AppleSignIn = ({colors}) => {
  const dispatch = useAppDispatch();

  const _setModalData = (msg: string) => {
    dispatch(
      setModalData({
        modalVisible: true,
        title: t('sorry'),
        message: msg,
      }),
    );
  };

  const _appleLogin = (value: object) => {
    dispatch(appleLogin({data: value})).then(res => {
      if (
        res.meta.requestStatus == 'fulfilled' &&
        res?.payload?.result?.status == 'success'
      ) {
        dispatch(
          setAuthValues({
            token: res?.payload?.result?.data?.token,
            authenticatedUser: res?.payload?.result?.data?.user_id,
            userName: res?.payload?.result?.data?.user_name,
          }),
        );
        NavigationService.navigate('Profile', {});
      } else if (
        res.meta.requestStatus == 'fulfilled' &&
        res?.payload?.result?.status == 'user_not_found'
      ) {
        NavigationService.navigate('CustomerSignup', {
          withData: true,
          ...value,
        });
      } else {
        _setModalData(res?.payload?.result?.msg);
      }
    });
  };
  const onAppleButtonPress = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {identityToken} = appleAuthRequestResponse;
      // Retrieve the identity token
      if (identityToken) {
        // Send the identity token to your server for validation and to create a session
        // Alert.alert(
        //   'Sign In Successful',
        //   `Welcome ${fullName?.givenName || ''}`,
        // );
        _appleLogin(appleAuthRequestResponse);
      } else {
        // handle missing token scenario
        Alert.alert('Sign In Failed', 'No identity token returned');
      }
    } catch (error) {
      //   Alert.alert('Sign In Error', error.message);
    }
  };

  return (
    <View
      style={{
        width: '100%',
      }}>
      <AppleButton
        buttonStyle={AppleButton.Style.BLACK}
        buttonType={AppleButton.Type.SIGN_IN}
        style={{
          width: '100%',
          height: 45 * BW(),
        }}
        onPress={onAppleButtonPress}
      />
    </View>
  );
};

export default AppleSignIn;

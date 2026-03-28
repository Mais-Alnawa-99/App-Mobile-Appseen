import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import Button from '../../../component/Button';
import Text from '../../../component/Text';
import {BH, BW} from '../../../style/theme';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native-elements';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import CustomImage from '../../../component/CustomImage';
import {getBaseURL} from '../../../redux/network/api';
import Header from '../../../component/Header';
import {reduxStorage, store} from '../../../redux/store';
import {useFocusEffect} from '@react-navigation/native';
import NavigationService from '../../../naigation/NavigationService';
import {getuserInvoices} from '../../../redux/reducers/User/thunk/invoices';
import {getuserInvoicesPdf} from '../../../redux/reducers/User/thunk/invoicePdf';
import {handleOpenFile64} from '../../../component/handleOpenFile64';

function Invoices(): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyle(colors);
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const [isEmpty, setIsEmpty] = useState(false);
  const {
    userInvoices,
    dataLoader: userInvoicesLoader,
    error: invoicesError,
  } = useAppSelector(state => state.invoices);
  const {authenticatedUser} = useAppSelector(state => state.auth);
  useEffect(() => {
    dispatch(getuserInvoices({userId: authenticatedUser})).then(res => {
      if (
        res?.payload?.result &&
        Array.isArray(res?.payload?.result?.data) &&
        res?.payload?.result?.data?.length == 0
      ) {
        setIsEmpty(true);
      }
    });
  }, [dispatch, authenticatedUser]);
  if (userInvoicesLoader) {
    return <ActivityIndicator size="large" color={colors.primary} />;
  }

  if (invoicesError) {
    return (
      <View>
        <Text>{t('Error loading profile data')}</Text>
      </View>
    );
  }

  if (isEmpty) {
    return (
      <>
        <Header hideDrawer hideNotification title={t('myInvoices')} />
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            paddingHorizontal: 20,
          }}>
          <Text h2 style={{textAlign: 'center', color: colors.gray}}>
            {t('noInvoices')}
          </Text>
        </View>
      </>
    );
  }

  const handleDownloadPress = async (invoiceId: number) => {
    const resultAction = await dispatch(getuserInvoicesPdf({invoiceId}));

    if (getuserInvoicesPdf?.fulfilled.match(resultAction)) {
      const pdfBase64 = resultAction?.payload?.result?.data?.pdf;

      await handleOpenFile64(`invoice_${invoiceId}`, 'pdf', pdfBase64);
    } else {
    }
  };

  const getStatusStyles = status => {
    switch (status) {
      case 'paid':
        return {backgroundColor: colors.green + '33', color: colors.green};
      case 'reversed':
        return {backgroundColor: colors.red + '33', color: colors.red};
      case 'waitingForPayment':
        return {backgroundColor: colors.yellow + '33', color: colors.yellow};
      case 'cancelled':
        return {backgroundColor: colors.red + '33', color: colors.red};
      default:
        return {
          backgroundColor: colors.green + '33',
          color: colors.green,
        };
    }
  };
  return (
    <>
      <Header hideDrawer hideNotification title={t('myInvoices')} />

      <ScrollView style={styles.appContainer}>
        <View>
          {}
          {Array.isArray(userInvoices) &&
            userInvoices.length > 0 &&
            userInvoices?.map((invoice: any, index: number) => (
              <View key={index} style={styles.container}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#33333333',
                    paddingVertical: 16 * BW(),
                  }}>
                  <View style={[styles.common, styles.type]}>
                    <View style={styles.name}>
                      <Text h3 bold>
                        # {invoice?.name}
                      </Text>
                    </View>
                    {invoice?.status && (
                      <View
                        style={[
                          styles.status,
                          {
                            backgroundColor: getStatusStyles(invoice?.status)
                              .backgroundColor,
                          },
                        ]}>
                        <Text
                          h3
                          style={{
                            color: getStatusStyles(invoice?.status).color,
                          }}>
                          {t(invoice?.status)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{paddingHorizontal: 12 * BW()}}>
                    <View style={[styles.common, styles.name]}>
                      <Text h3 bold>
                        {t('invoiceDate')} :
                      </Text>
                      <Text h4>{invoice?.invoice_date}</Text>
                    </View>
                    <View style={[styles.common, styles.name]}>
                      <Text h3 bold>
                        {t('dueDate')} :
                      </Text>
                      <Text h4>{invoice?.due_date}</Text>
                    </View>
                    <View style={[styles.common, styles.name]}>
                      <Text h3 bold>
                        {t('total')} :
                      </Text>
                      <Text h4>
                        {invoice?.amount} {invoice?.currency}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.common,
                        {
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: colors.primaryColor + 'ff',
                          alignSelf: 'flex-end',
                          width: 80 * BW(),
                          height: 30 * BH(),
                          borderRadius: 4 * BW(),
                        },
                      ]}
                      onPress={() => handleDownloadPress(invoice?.id)}>
                      <Text h4 bold style={{color: '#fff'}}>
                        {t('download')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  );
}

export default Invoices;

const getStyle = (colors: any) =>
  StyleSheet.create({
    appContainer: {
      flex: 1,
    },
    container: {
      paddingHorizontal: 16 * BW(),
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4 * BW(),
    },
    label: {
      backgroundColor: '#FAFAFF',
      borderRadius: 10 * BW(),
      padding: 12 * BW(),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60 * BH(),
      marginVertical: 2 * BW(),
    },
    common: {
      marginVertical: 2 * BW(),
      flexDirection: 'row',
      alignItems: 'center',
    },
    type: {
      backgroundColor: '#FAFAFF',
      borderRadius: 10 * BW(),
      padding: 12 * BW(),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 60 * BH(),
    },
    name: {
      flexDirection: 'row',
      gap: 12 * BW(),
    },
    status: {
      borderRadius: 50 * BW(),
      minWidth: 40 * BW(),
      paddingHorizontal: 12 * BW(),
      height: 35 * BH(),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import theme, {BH, BW} from '../style/theme';
import Text from './Text';
import {replaceArabicNumerals} from './Generalfunction';
import PhoneInput from 'react-native-phone-number-input';
import CountryPicker, {
  CountryCode,
  Country,
} from 'react-native-country-picker-modal';
import {Dropdown} from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {CheckBox} from 'react-native-elements';
import {isArabic} from '../locales';

export default function VarientInput(props: any): JSX.Element {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [countryCode, setCountryCode] = useState<CountryCode>('AE');
  const [country, setCountry] = useState<Country>(null);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const {t} = useTranslation();
  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCountry(country);
    props?.onSelectContry && props?.onSelectContry(country);
  };

  return (
    <>
      <View style={[styles.viewStyle, props.viewStyle]}>
        {props.label && (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              h4
              style={{
                color: colors.text,
                zIndex: 500,
                ...props.styleText,
              }}>
              {props.label}
            </Text>
            {props.requiredStar && (
              <Icon
                name="star-of-life"
                size={4 * BW()}
                color="#db2c43"
                style={{marginHorizontal: 3 * BW(), marginBottom: 8 * BW()}}
              />
            )}
          </View>
        )}
        {(props.textInput || props.type == 'textInput') && (
          <TextInput
            style={[
              props.disabled ? styles.inputDisable : styles.input,
              {
                fontFamily: theme.themeObject.currentFontFamily.normal,
                fontSize: theme.themeObject.currentFontSize.h4,
                textAlign: isArabic() ? 'right' : 'left',
                borderColor:
                  props.required || props.error ? 'red' : '#cccccc88',
                borderWidth:
                  props.required || props.error ? 0.5 * BW() : 0.6 * BW(),
                borderRadius: 8 * BW(),
                marginTop: 2 * BW(),
                padding: 8 * BW(),
                minHeight: 40 * BW(),
                ...props.styleInput,
              },
            ]}
            type
            autoCapitalize="none"
            textContentType="name"
            editable={props.disabled ? false : true}
            keyboardType={props.keyboardType ? props.keyboardType : 'default'}
            value={props.value?.toString() || ''}
            onBlur={text => {
              props.onBlur && props.onBlur(replaceArabicNumerals(text));
            }}
            {...props}
            onChangeText={text => {
              props.onChangeText &&
                props.onChangeText(replaceArabicNumerals(text));
            }}
            name={props.name}
            placeholder={props.placeholder}
            placeholderTextColor={colors.text + '66'}
          />
        )}
        {(props.phoneInputType || props.type == 'phoneInputType') && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <PhoneInput
              ref={props.phoneInput}
              defaultCode={props?.defaultCode ? props?.defaultCode : 'AE'}
              placeholder={props.placeholder ? props.placeholder : '5xxxxxxxx'}
              disableArrowIcon={true}
              disabled={props.disabled}
              value={props.value}
              onChangeText={text => {
                props.onChangeText &&
                  props.onChangeText(
                    props.phoneInput?.current?.getCallingCode() +
                      replaceArabicNumerals(text),
                  );
                props?.setFieldValue &&
                  props?.name &&
                  props.setFieldValue(
                    props?.name,
                    props.phoneInput?.current?.getCallingCode() +
                      replaceArabicNumerals(text),
                  );
              }}
              // countryPickerProps={{disableNativeModal: true}}

              textContainerStyle={{
                paddingVertical: 0,
                paddingHorizontal: 0,
                backgroundColor: 'transparent',
                flexDirection: 'row-reverse',
              }}
              textInputStyle={[
                props.disabled ? styles.inputDisable : styles.input,
                {
                  paddingVertical: 0,
                  height: '100%',
                  fontFamily: theme.themeObject.currentFontFamily.normal,
                  fontSize: theme.themeObject.currentFontSize.h4,
                  backgroundColor: 'transparent',
                  textAlign: 'right',
                },
              ]}
              containerStyle={[
                props.disabled ? styles.inputDisable : styles.input,
                {
                  width: 'auto',
                  flexDirection: 'row-reverse',
                  paddingHorizontal: 5 * BW(),
                  paddingTop: 4 * BW(),
                  paddingBottom: 4 * BW(),
                  borderColor:
                    props.required || props.error ? 'red' : '#cccccc88',
                  borderWidth:
                    props.required || props.error ? 0.5 * BW() : 0.6 * BW(),
                  borderRadius: 8 * BW(),
                  marginTop: 2 * BW(),
                  padding: 8 * BW(),
                  minHeight: 40 * BW(),
                  ...props.styleInput,
                },
              ]}
              flagButtonStyle={{width: 'auto'}}
              codeTextStyle={[
                props.disabled && styles.inputDisable,
                {
                  fontFamily: theme.themeObject.currentFontFamily.normal,
                  fontSize: theme.themeObject.currentFontSize.h4,
                },
              ]}
              onChangeCountry={
                // !!props.onChangeCountry
                // ?
                coun => {
                  props?.setFieldValue &&
                    props?.name &&
                    coun.callingCode &&
                    coun.callingCode[0] &&
                    props.setFieldValue(
                      props?.name,
                      coun.callingCode[0] + replaceArabicNumerals(props.value),
                    );
                  // props.onChangeCountry(coun);
                }
                // : () => {}
              }
              {...props}
            />
          </View>
        )}
        {(props.dropdown || props.type == 'dropdown') && (
          <Dropdown
            disable={props.disabled}
            search={props.search}
            value={props.value}
            data={props.items}
            placeholder={props.placeholder}
            labelField="label"
            valueField="value"
            onChange={
              props.onChangeValue
                ? item => {
                    props.onChangeValue(item);
                  }
                : () => {}
            }
            searchPlaceholder={t('search')}
            inputSearchStyle={{
              fontFamily: theme.themeObject.currentFontFamily.normal,
              fontSize: theme.themeObject.currentFontSize.h4,
              backgroundColor: colors.backgroundColorInput,
              color: colors.text,
            }}
            placeholderStyle={{
              fontFamily: theme.themeObject.currentFontFamily.normal,
              fontSize: theme.themeObject.currentFontSize.h4,
              textAlign: 'left',
            }}
            itemTextStyle={{
              fontFamily: theme.themeObject.currentFontFamily.normal,
              fontSize: theme.themeObject.currentFontSize.h4,
            }}
            selectedTextStyle={{
              fontFamily: theme.themeObject.currentFontFamily.normal,
              fontSize: theme.themeObject.currentFontSize.h4,
              color: props.disabled ? colors.text + '80' : colors.text,
            }}
            style={[
              props.disabled ? styles.inputDisable : styles.input,

              {
                zIndex: 2000,
                borderColor:
                  props.required || props.error ? 'red' : colors.gray + 'cc',
                borderWidth:
                  props.required || props.error ? 0.5 * BW() : 0.6 * BW(),
                paddingVertical: 5 * BW(),
                borderRadius: 8 * BW(),
                marginTop: 2 * BW(),
                padding: 8 * BW(),
                minHeight: 40 * BW(),
                minWidth: '100%',

                ...props.styleInput,
              },
            ]}
            dropdownPosition={'auto'}
            renderItem={
              props?.renderItemProps
                ? props?.renderItemProps
                : item => {
                    return (
                      <View style={styles.renderItem}>
                        <Text h4 bold>
                          {item.name}
                        </Text>
                      </View>
                    );
                  }
            }
            {...props}
          />
        )}

        {props?.radioGroup && props.type == 'radio' && (
          <View style={props.row ? styles.rowView : styles.columnView}>
            {props?.radioGroup &&
              props?.radioGroup.length > 0 &&
              props?.radioGroup.map((child, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (props.onPress) {
                        props.onPress(child);
                      }
                    }}
                    key={index}
                    style={[
                      styles.radioDev,
                      props.stylesRadio,
                      {
                        borderColor:
                          props.stylesRadio &&
                          props?.value &&
                          props?.value.value == child?.value
                            ? colors.darkgreen
                            : colors.gray,
                      },
                    ]}>
                    <View style={styles.wrapper}>
                      <Text h4>
                        {child.label
                          ? child.label
                          : child.text && isArabic()
                            ? child.text.ar
                            : child.text && !isArabic()
                              ? child.text.default
                              : ''}
                      </Text>
                      <View style={styles.radio}>
                        {/* <View style={styles.radioSelected} /> */}
                        {props?.value &&
                          ((props?.value.id && props?.value.id == child?.id) ||
                            (props?.value.value &&
                              props?.value.value == child?.value)) && (
                            <View style={styles.radioSelected}></View>
                          )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
          </View>
        )}
        {props?.checkbox && props.type == 'checkbox' && (
          <CheckBox
            title={props.title}
            checked={props.checked}
            onPress={props.onPress}
            checkedColor={props.checkedColor}
            containerStyle={{
              backgroundColor: props.fullWidth
                ? colors.backgroundColorInput
                : 'transparent',
              marginTop: 0,
              paddingTop: 0,
              width: props.fullWidth ? '100%' : '90%',
              borderColor: props.fullWidth ? '#cccccc88' : 'transparent',
              marginLeft: 0,
              marginRight: 0,
              paddingHorizontal: 0,
              borderRadius: props.fullWidth ? 8 * BW() : 0,
              paddingVertical: props.fullWidth ? 10 * BW() : 4 * BW(),
            }}
            textStyle={{
              fontFamily: theme.themeObject.currentFontFamily.normal,
              fontSize: theme.themeObject.currentFontSize.h4,
              textAlign: isArabic() ? 'left' : 'right',
            }}
            {...props}
          />
        )}
        {(props.countryPicker || props.type == 'countryPicker') && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setCountryPickerVisible(true)}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 5 * BW(),
                paddingTop: 5 * BW(),
                paddingBottom: 5 * BW(),
                borderColor:
                  props.required || props.error ? 'red' : '#cccccc88',
                borderWidth:
                  props.required || props.error ? 0.5 * BW() : 0.3 * BW(),
                backgroundColor: colors.backgroundColorInput,
                borderRadius: 8 * BW(),
                marginTop: 2 * BW(),
                padding: 8 * BW(),
                minHeight: 40 * BW(),
                ...props.styleInput,
              }}>
              <TextInput
                style={[
                  props.disabled ? styles.inputDisable : styles.input,
                  {
                    fontFamily: theme.themeObject.currentFontFamily.normal,
                  },
                ]}
                autoCapitalize="none"
                textContentType="name"
                editable={props.disabled ? false : true}
                keyboardType={
                  props.keyboardType ? props.keyboardType : 'default'
                }
                value={country?.name}
                onBlur={text => {
                  props.onBlur && props.onBlur(replaceArabicNumerals(text));
                }}
                {...props}
                onChangeText={text => {
                  props.onChangeText &&
                    props.onChangeText(replaceArabicNumerals(text));
                }}
              />
              <CountryPicker
                withAlphaFilter
                {...{
                  countryCode,
                  onSelect,
                }}
                onClose={() => setCountryPickerVisible(false)}
                visible={countryPickerVisible}
              />
            </View>
          </TouchableOpacity>
        )}
        {(props.datePicker || props.type == 'datePicker') && (
          <>
            <TouchableOpacity
              onPress={() => props.showDatepicker()}
              disabled={props.disabled}
              style={[
                props.disabled ? styles.inputDisable : styles.input,
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  minHeight: 40 * BW(),
                  borderColor:
                    props.required || props.error ? 'red' : '#cccccc88',
                  borderWidth:
                    props.required || props.error ? 0.5 * BW() : 0.6 * BW(),
                  borderRadius: 8 * BW(),
                  marginTop: 2 * BW(),
                  padding: 8 * BW(),
                  ...props.styleInput,
                },
              ]}>
              <Text
                style={props.disabled ? styles.inputDisable : styles.input}
                h4>
                {props.value}
              </Text>
              {!props.disabled && (
                <TouchableOpacity onPress={() => props.showDatepicker()}>
                  <Image
                    style={styles.image}
                    source={require('../assets/icons/calendar.png')}
                  />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
            {props.show && (
              <DateTimePicker
                value={props.dateValue ? new Date(props.dateValue) : new Date()}
                display="default"
                onChange={props.onChangeDateFrom}
                {...props.datePickerProps}
              />
            )}
          </>
        )}
        {props.error && (
          <Text style={styles.requiredText} h5>
            {props.error}
          </Text>
        )}
      </View>
    </>
  );
}
const getStyles = (colors: any) =>
  StyleSheet.create({
    inputDisable: {
      color: colors.textColor + '80',
      backgroundColor: '#ffffff80',
    },
    input: {
      color: colors.textColor,
      backgroundColor: colors.backgroundColorInput,
    },
    rowView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      marginTop: 8 * BW(),
    },
    radioSelected: {
      width: 10 * BW(),
      display: 'flex',
      height: 10 * BW(),
      borderRadius: 5 * BW(),
      backgroundColor: colors.darkgreen,
    },
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    columnView: {
      display: 'flex',
      flexDirection: 'column',

      width: '100%',
      justifyContent: 'center',
    },
    radio: {
      width: 20 * BW(),
      height: 20 * BW(),
      borderRadius: 10 * BW(),
      display: 'flex',

      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1 * BW(),
      margin: 8 * BW(),
      borderColor: colors.darkgreen,
    },
    image: {
      width: 15 * BW(),
      height: 15 * BW(),
      tintColor: '#CDCDCD',
      marginLeft: 8 * BW(),
    },
    renderItem: {
      paddingHorizontal: 10 * BW(),
      paddingVertical: 8 * BW(),
      // backgroundColor: 'red',
      // borderRadius: 35 * BW(),
      backgroundColor: colors.backgroundColorInput,
      color: colors.text,
      width: 500,
    },
    requiredText: {
      color: '#db2c43',
      fontSize: 8 * BW(),
      lineHeight: 15 * BW(),
    },
    radioDev: {
      display: 'flex',
      flexDirection: 'row',
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: '48%',

      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 14,
      marginRight: 4,
      backgroundColor: colors.background,
    },
    viewStyle: {marginTop: 11 * BW()},
  });

import {createSlice} from '@reduxjs/toolkit';
import {replaceArabicNumerals} from '../../component/Generalfunction';

interface modalSliceType {
  modalVisible: false;
  title: '';
  message: '';
  fun: any;
  showOtp: boolean;
  otp: string;
  error: string;
  hideCancel: boolean;
  hideConfirm: boolean;
  webView: boolean;
  fileView: boolean;
  webUrl: string;
  shareMedia: boolean;
  shareMediaArray: any;
  CustomView: any;
  directFormMessage: boolean;
  requstDetails: boolean;
  showClose: boolean;
  titleConfirm: '';
  customStyle: any;
}
const initialState: modalSliceType = {
  modalVisible: false,
  title: '',
  message: '',
  fun: '',
  showOtp: false,
  otp: '',
  error: '',
  hideCancel: false,
  webView: false,
  fileView: false,
  webUrl: '',
  shareMedia: false,
  shareMediaArray: [],
  CustomView: false,
  hideConfirm: false,
  showClose: false,
  requstDetails: false,
  directFormMessage: false,
  titleConfirm: '',
  customStyle: {},
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    setModalData: (state, action) => {
      state.modalVisible = action.payload?.modalVisible;
      state.title = action.payload?.title;
      state.message = action.payload?.message;
      state.fun = action.payload?.fun;
      state.showOtp = action.payload?.showOtp;
      state.error = action.payload?.error;
      state.hideCancel = action.payload?.hideCancel;
      state.webView = action.payload?.webView;
      state.fileView = action.payload?.fileView;
      state.webUrl = action.payload?.webUrl;
      state.shareMedia = action.payload?.shareMedia;
      state.shareMediaArray = action.payload?.shareMediaArray;
      state.CustomView = action.payload?.CustomView;
      state.requstDetails = action.payload?.requstDetails;
      state.directFormMessage = action.payload?.directFormMessage;
      state.hideConfirm = action.payload?.hideConfirm;
      state.showClose = action.payload?.showClose;
      state.titleConfirm = action.payload?.titleConfirm;
      state.customStyle = action.payload?.customStyle;
    },
    hideModal: state => {
      state.modalVisible = false;
      state.title = '';
      state.message = '';
      state.showOtp = false;
      state.fun = '';
      state.hideCancel = false;
      state.webView = false;
      state.fileView = false;
      state.webUrl = '';
      state.shareMedia = false;
      state.shareMediaArray = '';
      state.CustomView = false;
      state.requstDetails = false;
      state.hideConfirm = false;
      state.showClose = false;
      state.titleConfirm = '';
      state.customStyle = {};
    },
    setOtp: (state, action) => {
      state.otp = replaceArabicNumerals(action.payload);
    },
  },
});

export const {setModalData, hideModal, setOtp} = modalSlice.actions;
export default modalSlice.reducer;

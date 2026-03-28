import {Platform} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';

export const handleOpenFile64 = async (name, extension, base64Content) => {
  try {
    const downloadPath = `${RNFS.DocumentDirectoryPath}/${name}.${extension}`;
    await RNFS.writeFile(downloadPath, base64Content, 'base64');
    FileViewer.open(downloadPath);
  } catch (error) {
    console.error('Error opening file:', error);
  }
};

import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import Loader from './Loader';
import FastImage from '@d11/react-native-fast-image';
const CustomImage = ({
  style,
  url,
  animated,
  sharedTransitionTag,
  fastImage,
  ...props
}: {
  style?: object;
  url?: string;
  animated?: boolean;
  fastImage?: boolean;
  sharedTransitionTag?: any;
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const onLoadEnd = () => {
    setIsLoading(false);
  };
  return (
    <>
      {isLoading && (
        <View
          style={[
            style,
            {
              position: 'absolute',
            },
          ]}
        >
          <Loader isLoading={isLoading} />
        </View>
      )}
      {fastImage ? (
        <FastImage
          source={{
            uri: url,
            // headers: {
            //   Authorization: 'Basic c2VlbmRlbW86ZGVNTyEhU2VlbjBpbmZv',
            // },
          }}
          style={style}
          onLoadEnd={onLoadEnd}
          {...props}
        />
      ) : (
        <Image
          source={{
            uri: url,
            // headers: {
            //   Authorization: 'Basic c2VlbmRlbW86ZGVNTyEhU2VlbjBpbmZv',
            // },
          }}
          onLoadEnd={onLoadEnd}
          style={style}
          {...props}
        />
      )}
    </>
  );
};
export default CustomImage;

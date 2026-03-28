import React from 'react';
import {ActivityIndicator, FlatList, RefreshControl} from 'react-native';
import theme, {BW} from '../style/theme';
import {useTheme} from '@react-navigation/native';

type Props = {
  data?: any;
  CARD_WIDTH_SPACING?: any;
  renderItem?: any;
  horizontal?: boolean;
  onEndReached?: () => void;
  onRefresh?: any;
  onEndReachedThreshold?: number;
  moreLoading?: boolean;
  listkey?: string;
  numColumns?: number;
  props?: any;
  style?: any;
  flatListRef?: any;
  contentContainerStyle: {};
};
export default function FlatListComp({
  data,
  CARD_WIDTH_SPACING,
  renderItem,
  horizontal,
  onEndReached,
  onRefresh,
  onEndReachedThreshold,
  moreLoading,
  listkey = '#',
  numColumns,
  flatListRef,
  contentContainerStyle,
  ...props
}: Props): JSX.Element {
  const renderFooterComponent = () => {
    if (moreLoading) {
      return (
        <ActivityIndicator
          color={theme.themeObject.colors.primaryColor}
          size={10 * BW()}
          style={{
            marginVertical: 10 * BW(),
          }}
        />
      );
    }
    return null;
  };
  const {colors} = useTheme();
  return (
    <FlatList
      data={data}
      horizontal={horizontal}
      snapToInterval={CARD_WIDTH_SPACING}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      key={listkey}
      ref={flatListRef}
      numColumns={numColumns ? numColumns : 1}
      keyExtractor={(i, index) => index.toString()}
      renderItem={renderItem}
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooterComponent}
      refreshControl={
        onRefresh && (
          <RefreshControl
            refreshing={false}
            tintColor={colors.primary}
            onRefresh={onRefresh}
          />
        )
      }
      contentContainerStyle={contentContainerStyle}
      {...props}
    />
  );
}

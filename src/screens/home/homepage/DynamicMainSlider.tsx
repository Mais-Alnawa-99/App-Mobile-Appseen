import {View} from 'react-native';
import Text from '../../../component/Text';

function DynamicMainSlider(props: any): JSX.Element {
  const {data} = props;
  return (
    <View>
      <Text h2 bold>
        {data.slider_name}
      </Text>
      {data?.slides_data &&
        data?.slides_data.map((item, index) => {
          return (
            <Text h1 bold key={index}>
              {item.title}
            </Text>
          );
        })}
    </View>
  );
}

export default DynamicMainSlider;

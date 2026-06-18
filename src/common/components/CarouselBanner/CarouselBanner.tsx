import * as React from 'react';
import {
  Dimensions,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useCarouselStyle } from 'src/common/components/CarouselBanner/CarouselBannerStyle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ISellerImages } from 'src/common/model/restaurantListing/restaurantListing';
import { CAROUSEL_AUTOPLAY_INTERVAL } from 'src/components/Restaurant/utils/RestaurantListingUtil';

interface ICarouselBannerProps {
  images: ISellerImages[] | null;
}

const width = Dimensions.get('window').width;
const defaultimages = [
  require('src/common/assets/images/carousel-banner.png'),
  require('src/common/assets/images/carousel-banner1.jpg'),
  require('src/common/assets/images/carousel-banner.png'),
];

const CarouselBanner: React.FC<ICarouselBannerProps> = ({ images }) => {
  const styles = useCarouselStyle();
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const imageList = images && images.length > 0 ? images : defaultimages;

  const onProgressChange = (offsetProgress: number, absoluteProgress: number) => {
    progress.value = absoluteProgress;
    setCurrentIndex(Math.floor(absoluteProgress));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Carousel
        ref={ref}
        width={width}
        height={200}
        data={imageList}
        onProgressChange={onProgressChange}
        renderItem={({ index }) => (
          <View style={styles.imageContainer}>
            {typeof imageList[index] === 'string' || imageList[index].fileUrl ? (
              <Image
                source={{ uri: imageList[index].fileUrl || imageList[index] }}
                style={styles.image}
                resizeMode='cover'
              />
            ) : (
              <Image
                source={imageList[index]}
                style={styles.image}
                resizeMode='cover'
              />
            )}
          </View>
        )}
        autoPlay={true}
        autoPlayInterval={CAROUSEL_AUTOPLAY_INTERVAL}
        loop={true}
      />

      <View style={styles.paginationContainer}>
        {imageList.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (ref.current) {
                ref.current.scrollTo({ count: index, animated: true });
                setCurrentIndex(index);
              }
            }}
          >
            <View
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : null,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
    </GestureHandlerRootView>
  );
};

export default CarouselBanner;

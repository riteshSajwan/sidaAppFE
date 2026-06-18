import React from 'react';
import { View } from 'react-native';
import { Rating } from 'react-native-ratings';
import Style from 'src/common/components/CustomRating/CustomRatingstyle';

interface CustomRatingProps {
  rating: number;
  ratingCount?: number;
  imageSize?: number;
  readonly?: boolean;
}

const CustomRating: React.FC<CustomRatingProps> = ({
  rating,
  ratingCount = 5,
  imageSize = 20,
  readonly = true,
}) => {
  return (
    <View style={Style.container}>
      <Rating
        type='custom'
        ratingCount={ratingCount}
        imageSize={imageSize}
        startingValue={rating}
        ratingColor='#FB9804'
        readonly={readonly}
      />
    </View>
  );
};



export default CustomRating;

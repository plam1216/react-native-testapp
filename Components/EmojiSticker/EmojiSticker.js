import { View, Image } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withSpring } from 'react-native-reanimated'
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler'


export default function EmojiSticker({ imageSize, stickerSource }) {
  const AnimatedView = Animated.createAnimatedComponent(View)
  const AnimatedImage = Animated.createAnimatedComponent(Image)
  const scaleImage = useSharedValue(imageSize)

  // useSharedValue initial value is 0 so position sticker is placed initially is starting point
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const onDoubleTap = useAnimatedGestureHandler({
    onActive: () => {
      if (scaleImage.value) {
        scaleImage.value = scaleImage.value * 2
      }
    }
  })

  const onDrag = useAnimatedGestureHandler({
    // when the gesture starts or is at its initial position
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    // when the gesture is active and moving
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    return {
      // spring based animation
      width: withSpring(scaleImage.value),
      height: withSpring(scaleImage.value),
    }
  })

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={onDrag}>
      <AnimatedView
        style={[containerStyle, { top: -350 }]}
      >
        <TapGestureHandler
          onGestureEvent={onDoubleTap}
          numberOfTaps={2}
        >
          <AnimatedImage
            source={stickerSource}
            resizeMode="contain"
            style={[imageStyle, { width: imageSize, height: imageSize }]}
          />
        </TapGestureHandler>
      </AnimatedView>
    </PanGestureHandler>
  );
}

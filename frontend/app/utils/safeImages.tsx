import { useState } from "react";
import {
  ImageBackground,
  Image,
  ImageErrorEventData,
  NativeSyntheticEvent,
  ImageBackgroundProps,
  ImageProps,
} from "react-native";

import { FALLBACK_IMG } from "../constants/colors";

type SafeImageBackgroundProps = ImageBackgroundProps & {
  uri: string;
};

type SafeImageProps = ImageProps & {
  uri: string;
};

export const SafeImageBackground = ({ uri, ...rest }: SafeImageBackgroundProps) => {
  const [src, setSrc] = useState<{ uri: string }>({ uri });

  const handleError = (_e: NativeSyntheticEvent<ImageErrorEventData>) => {
    setSrc({ uri: FALLBACK_IMG });
  };

  return <ImageBackground {...rest} source={src} onError={handleError} />;
};

export const SafeImage = ({ uri, ...rest }: SafeImageProps) => {
  const [src, setSrc] = useState<{ uri: string }>({ uri });

  const handleError = (_e: NativeSyntheticEvent<ImageErrorEventData>) => {
    setSrc({ uri: FALLBACK_IMG });
  };

  return <Image {...rest} source={src} onError={handleError} />;
};

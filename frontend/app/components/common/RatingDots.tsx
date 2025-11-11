import { useMemo } from "react";
import { View } from "react-native";

import { ACCENT } from "../../constants/colors";
import { toDots } from "../../utils/rating";

type RatingDotsProps = {
  value: number;
};

export const RatingDots = ({ value }: RatingDotsProps) => {
  const dots = useMemo(() => toDots(value), [value]);

  return (
    <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
      {dots.map((filled, index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: filled ? ACCENT : "#2E3238",
          }}
        />
      ))}
    </View>
  );
};

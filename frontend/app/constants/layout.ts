import { Dimensions } from "react-native";

const Screen = Dimensions.get("window");

export const CARD_WIDTH = Math.min(Screen.width * 0.62, 320);
export const FEATURE_WIDTH = Math.min(Screen.width * 0.56, 260);
export const FEATURE_HEIGHT = Math.round(FEATURE_WIDTH * 1.5);
export const UPCOMING_WIDTH = Math.min(Screen.width * 0.78, 320);
export const UPCOMING_HEIGHT = 90;
export const COMMUNITY_WIDTH = Math.min(Screen.width * 0.84, 360);
export const COMMUNITY_HEIGHT = 260;
export const SCREEN_WIDTH = Screen.width;

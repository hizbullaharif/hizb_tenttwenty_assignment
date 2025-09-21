import * as React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const MediaIcon = ({ color }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none">
    <Rect width={18} height={14.526} y={3.474} fill={color} rx={0.947} />
    <Path
      fill={color}
      d="M16.105 1.579c.505 0 .632.526.632.79H.947c0-.632.421-.79.632-.79h14.526ZM15.246 0c.435 0 .543.421.543.632H2.21c0-.506.363-.632.544-.632h12.492Z"
    />
  </Svg>
);
export default MediaIcon;

import * as React from "react";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
const More = ({ color }) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none">
    <G clipPath="url(#a)">
      <Path
        fill={color}
        d="M3.466 12.133a1 1 0 0 0 1 1h1.062a1 1 0 0 0 1-1v-.17a1 1 0 0 0-1-1H4.466a1 1 0 0 0-1 1v.17Zm0 4.997a1 1 0 0 0 1 1h1.062a1 1 0 0 0 1-1v-.28a1 1 0 0 0-1-1H4.466a1 1 0 0 0-1 1v.28Zm0-10.06a1 1 0 0 0 1 1h1.062a1 1 0 0 0 1-1v-.082a1 1 0 0 0-1-1H4.466a1 1 0 0 0-1 1v.082Zm4.593 5.063a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-.17a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v.17Zm0 4.997a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-.28a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1v.28Zm1-11.142a1 1 0 0 0-1 1v.082a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-.082a1 1 0 0 0-1-1h-11Z"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={color} d="M.059 0h24v24h-24z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default More;

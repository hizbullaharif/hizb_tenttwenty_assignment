import * as React from "react";
import Svg, { Circle } from "react-native-svg";

const DashboardIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" fill="none" {...props}>
    <Circle cx={13} cy={3} r={3} fill={props?.color} />
    <Circle cx={13} cy={13} r={3} fill={props?.color} />
    <Circle cx={3} cy={13} r={3} fill={props?.color} />
    <Circle cx={3} cy={3} r={3} fill={props?.color} />
  </Svg>
);
export default DashboardIcon;

import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import DashboardIcon from "@/assets/svg/dashboardIcon";
import MoreIcon from "@/assets/svg/More";
import { useMovieTheme } from "@/hooks/useMovieTheme";

const TAB_ICONS = {
  dashboard: DashboardIcon,
  more: MoreIcon,
} as const;

const TAB_SCREENS = [
  { name: "index", title: "Dashboard", icon: "dashboard" },
  { name: "More", title: "More", icon: "more" },
] as const;

interface TabIconProps {
  name: keyof typeof TAB_ICONS;
  color: string;
  size?: number;
}

const TabIcon: React.FC<TabIconProps> = ({ name, color, size = 24 }) => {
  const IconComponent = TAB_ICONS[name];
  return <IconComponent color={color} />;
};

export default function TabLayout() {
  const theme = useMovieTheme();

  const screenOptions = {
    tabBarActiveTintColor: theme.colors.White,
    tabBarInactiveTintColor: theme.colors.gray,
    tabBarStyle: [
      styles.tabBarStyle,
      { backgroundColor: theme.colors.darkPurple },
    ],
    tabBarLabelStyle: styles.tabBarLabelStyle,
    tabBarItemStyle: styles.tabBarItemStyle,
    headerShown: false,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      {TAB_SCREENS.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              <TabIcon name={icon} color={color} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0,
    borderRadius: 30,
    height: 75,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontFamily: "Poppins",
    marginTop: 4,
  },
  tabBarItemStyle: {
    paddingVertical: 5,
  },
});

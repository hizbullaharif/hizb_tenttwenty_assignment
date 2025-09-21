import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  debounceMs?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search movies...",
  value = "",
  onChangeText,
  onSearch,
  onClear,
  debounceMs = 300,
  style,
  inputStyle,
  autoFocus = false,
}) => {
  const [searchText, setSearchText] = useState(value);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onSearch && searchText !== value) {
        onSearch(searchText);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchText, debounceMs, onSearch, value]);

  // Update local state when value prop changes
  useEffect(() => {
    setSearchText(value);
  }, [value]);

  const handleTextChange = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    setSearchText("");
    onChangeText?.("");
    onClear?.();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Search Icon */}
      <View style={styles.searchIcon}>
        <Text style={styles.searchIconText}>🔍</Text>
      </View>

      {/* Text Input */}
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={searchText}
        onChangeText={handleTextChange}
        autoFocus={autoFocus}
        returnKeyType="search"
        onSubmitEditing={() => onSearch?.(searchText)}
        textAlign="left"
      />

      {/* Clear Button */}
      {searchText.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.6}
        >
          <View style={styles.clearIcon}>
            <Text style={styles.clearIconText}>✕</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchIconText: {
    fontSize: 18,
    color: "#6B7280",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "400",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  clearButton: {
    marginLeft: 12,
    padding: 4,
  },
  clearIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  clearIconText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});

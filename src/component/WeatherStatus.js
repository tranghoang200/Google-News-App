import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { getWeatherIcon } from "../utils/index";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const WeatherStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState({
    name: "",
    main: { temp: "" },
    wind: { speed: "" },
    weather: [{ main: "", description: "" }],
  });

  useEffect(() => {
    getLocationAsync();
  }, []);

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    // getWeather(location.coords.latitude, location.coords.longitude);
    getWeather(21.022736, 105.8019441);
  };

  getWeather = async (
    latitude,
    longitude,
    imgUrl = "https://cdn.star2.com/wp-content/uploads/2016/11/doc6s4zr9h0mdsz1srcegp.jpg"
  ) => {
    setLoading(true);
    const API_KEY = "3de6162d3745365b168ade2bbe4e1d66";
    const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    try {
      const response = await fetch(api);
      const jsonData = await response.json();
      setLocation({ ...jsonData, imgUrl });
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  if (loading) return <View></View>;
  return (
    <View style={styles.weather}>
      <TouchableOpacity>
        <View style={{ justifyContent: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "600", marginBottom: 5 }}>
            {location.name}
          </Text>
          <Text>{location.weather[0].description}</Text>
        </View>
      </TouchableOpacity>
      <View>
        <MaterialCommunityIcons
          size={40}
          color="lightgrey"
          style={{ alignSelf: "center" }}
          name={getWeatherIcon(location.weather[0].main)}
        />
        <Text>{Math.floor(((location.main.temp - 32) * 5) / 9)} °F</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  weather: {
    width: "80%",
    marginVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
});

export default WeatherStatus;

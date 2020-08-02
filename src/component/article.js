import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { Card, Button, Icon } from "react-native-elements";
import { FontAwesome } from "@expo/vector-icons";
import styles from '../style/homeStyle';

const onPress = (url) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URL: ${url}`);
    }
  });
};

const renderArticleItem = ({ item }) => {
  return (
    <Card title={item.title} image={{ uri: item.urlToImage }}>
      <View style={styles.row}>
        <Text style={styles.label}>Source </Text>
        <Text style={styles.info}>{item.source.name}</Text>
      </View>
      <Text style={{ marginBottom: 10 }}>{item.content}</Text>
      <View style={styles.row}>
        <View style={styles.timeContainer}>
          <View style={styles.row}>
        <Text style={styles.label}>Published </Text>
        <Text style={styles.info}>
          {moment(item.publishedAt).format("LLL")}
        </Text>
        </View>
        <TouchableOpacity>
          <FontAwesome size={30} name="bookmark" color="#f6ff00"></FontAwesome>
        </TouchableOpacity>
        </View>
      </View>
      <Button
        icon={<Icon />}
        title="Read more"
        backgroundColor="#03A9F4"
        onPress={() => onPress(item.url)}
      />
    </Card>
  );
};

export default renderArticleItem;

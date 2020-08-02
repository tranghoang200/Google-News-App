import React from "react";
import { View, ActivityIndicator, Text, FlatList, Linking, Platform, Image, TouchableOpacity, TextInput } from 'react-native'
import { createExample } from "../actions/Example";
import { connect } from "react-redux";
import styles from '../style/homeStyle';
import { Icon } from 'react-native-elements';
import renderArticle from "../component/article";
import filterForUniqueArticles from "../component/filter";

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      listArc: [],
      pageNumber: 1,
      hasError: false,
      lastPageReached: false,
      loadLocation: true,
      errorLocation: false,
      searchLine: '',
      onSearch: false,
    }
  }
  componentDidMount() {
    this.getNews()
  }
  getNews = async () => {
    if (this.state.lastPageReached) return
    try {
      const response = await (this.state.searchLine.trim() == '' ? fetch(
        'https://newsapi.org/v2/top-headlines?country=us&apiKey=85d1b02e12bf4de696ac2d24a5ef348e&page=' + this.state.pageNumber
      ) : fetch(
        'https://newsapi.org/v2/everything?q=' + this.state.searchLine + '&apiKey=85d1b02e12bf4de696ac2d24a5ef348e&page=' + this.state.pageNumber
      ))
      const data = await response.json()
      const hasMoreArticles = data.articles.length > 0;
      if (!hasMoreArticles) {
        await this.setState({
          lastPageReached: true,
        },
        )
        return
      }
      await this.setState(prev => ({
        isLoading: false,
        pageNumber: prev.pageNumber + 1,
        listArc: filterForUniqueArticles(prev.listArc.concat(data.articles)),
      }))
    }
    catch (err) {
      this.setState({
        hasError: true,
      })
      console.warn(err)
    }
  };

  onSearching = async () => {
    if (!this.state.onSearch) {
      this.setState({
        onSearch: true,
      })
      this.refs.myInput.focus()
    }
    else {
      this.setState({
        onSearch: false,
      })
    }
  }
  endSearch = async () => {
    await this.setState({
      onSearch: false,
    })
  }
  searchNews = async () => {
    await this.setState({
      pageNumber: 1,
      listArc: [],
      onSearch: false,
    })
    this.getNews()
  }
  render() {
    if (this.state.hasError) {
      return (
        <Text style={styles.error}>Some errors has occurred</Text>
      )
    }
    if (this.state.isLoading) {
      return (
        <ActivityIndicator style={styles.loader} size="large" loading={this.state.isLoading} />
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.head}>
          <TouchableOpacity onPress={() => this.onSearching()}>
            <Icon name={Platform.OS === 'ios' ? 'ios-search' : 'md-search'} type='ionicon'></Icon>
          </TouchableOpacity>
          <Image style={styles.headLabel} source={require('../../assets/images/headLabel.png')} resizeMode='contain' />
          <TouchableOpacity>
            <Icon name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'} type='ionicon'></Icon>
          </TouchableOpacity>
        </View>
        <TextInput style={this.state.onSearch ? styles.searchText : styles.invisible}
          ref="myInput"
          blurOnSubmit={true}
          onChangeText={text => this.setState({ searchLine: text })}
          onSubmitEditing={() => this.searchNews()}
          onBlur={() => this.endSearch()}
          placeholder="search news" />
        <View style={styles.row}>
          <Text style={styles.label}>{this.state.searchLine.trim() == '' ? 'Healines' : this.state.searchLine} </Text>
          {!this.state.onSearch && <Text style={styles.info}>({this.state.listArc.length})</Text>}
        </View>
        <FlatList
          style={{ width: '100%' }}
          data={this.state.listArc}
          renderItem={renderArticle}
          keyExtractor={(item,index) => (item.title+index)}
          onEndReached={this.getNews}
          onEndReachedThreshold={1}
          extraData={this.state.listArc}
          ListFooterComponent={this.state.lastPageReached ?
            <Text style={styles.end}>{this.state.listArc.length == 0 ? 'No results for ' + this.state.searchLine : 'No more articles'}</Text> :
            <ActivityIndicator size="large" loading={this.setState.isLoading} />} />
      </View> 
    );
  }
}

const mapStateToProps = (state) => {
  return { ...state.example };
};

export default connect(mapStateToProps, { createExample })(Home);

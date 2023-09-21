import React, {Component, useEffect, useState, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
} from 'react-native';

import AntIcon from 'react-native-vector-icons/AntDesign';
import IIcon from 'react-native-vector-icons/Ionicons';

const SearchDropdown = props => {
  const [show, setShow] = useState(false);

  const [searchValue, setSearchValue] = useState(props?.value?.name || '');
  const [dataFiltered, setDataFiltered] = useState(props.data);
  const dataToBeFiltered = props.data;

  const searchText = text => {
    setDataFiltered(
      dataToBeFiltered?.filter(i => {
        let line =
          props.placeholder == 'Select Task'
            ? `${i?.task_code} - ${i?.name}`
            : i?.name;
        return String(line)?.toLowerCase()?.includes(text?.toLowerCase());
      }),
    );
  };

  return (
    <View>
      <View style={props.searchContainerStyle}>
        <TextInput
          value={searchValue}
          style={props.inputBoxStyle}
          placeholder={props.placeholder}
          placeholderTextColor="#a5a5a5"
          onFocus={() => setShow(true)}
          onChangeText={text => {
            searchText(text);
            setSearchValue(text);
            setShow(true);
          }}
        />

        {show ? (
          <TouchableOpacity
            style={{paddingHorizontal: 10}}
            onPress={() => {
              setShow(false);
              setSearchValue('');
              setDataFiltered(props.data);
            }}>
            <IIcon name="close" size={20} color="#444444" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShow(true)} style={{padding: 10}}>
            <AntIcon name="caretdown" size={15} color="gray" />
          </TouchableOpacity>
        )}
      </View>

      {show && (
        <View style={{flex: 1}}>
          {dataFiltered?.length > 0 ? (
            <FlatList
              nestedScrollEnabled
              keyboardShouldPersistTaps="always"
              style={props.searchListContainerStyle}
              data={dataFiltered}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    props.onPressList(item);
                    setSearchValue(
                      props.placeholder == 'Select Task'
                        ? `${item?.task_code} - ${item?.name}`
                        : item?.name,
                    );
                    setShow(false);
                  }}
                  style={props.searchListStyle}>
                  <Text style={props.searchListTextStyle}>
                    {props.placeholder == 'Select Task'
                      ? `${item?.task_code} - ${item?.name}`
                      : item?.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text>Not Found</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default memo(SearchDropdown);

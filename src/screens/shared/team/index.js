import React, {Component} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {FlatList, TextInput} from 'react-native';
import {View, Text, StyleSheet} from 'react-native';
import SimpleLoader from '../../../components/loader/SimpleLoader';
import {apiRequest} from '../../../utils/api';
import {useSelector} from 'react-redux';
import { COLORS } from '../../../configs/constants/colors';

const Team = () => {
  const {authUser} = useSelector(state => state?.auth);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [team, setTeam] = useState(null);
  const [searchValue, setSearchValue] = useState('')

  const filteredTeam = team?.filter(t =>
    t?.name?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const fetchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const resTeam = await apiRequest('post', 'get/team', {
        uid: authUser?.uid,
      });

      if (resTeam.data?.result?.response) {
        setTeam(resTeam.data?.result?.response);
      } else {
        if (!resTeam?.data?.result?.response) {
          throw Error(resTeam?.data?.result);
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <View style={styles.container}>
      {team && (
        <>
        <TextInput value={searchValue} onChangeText={setSearchValue} style={{borderWidth: 1, margin: 10, padding: 5, borderRadius: 10, borderColor: 'gray', paddingHorizontal: 10, color: '#444'}} placeholderTextColor={'gray'} placeholder='Search'/>
        <FlatList
          data={filteredTeam}
          contentContainerStyle={{padding: 10}}
          renderItem={({item, index}) => (
            <View style={{padding: 10}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 15, color: '#444'}}>
                  {index + 1}. {item?.name}
                </Text>
                <Text style={{fontSize: 12, backgroundColor: COLORS.tertiary, color: '#fff', paddingVertical: 2, paddingHorizontal: 10, borderRadius: 20}}>Worker and Supervisor</Text>
              </View>
              {item?.job && (
                <Text style={{fontSize: 12, marginLeft: 15, color: 'gray'}}>{item?.job}</Text>
              )}
            </View>
          )}
          ItemSeparatorComponent={
            <View style={{height: 1, backgroundColor: '#d5d5d5'}} />
          }
        />
        </>
      )}
      {loading && <SimpleLoader />}
      {error && <Error error={error} onPress={fetchTeam} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Team;

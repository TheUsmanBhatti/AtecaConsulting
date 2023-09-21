//import liraries
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {saveProjectList} from '../../../redux/slices/projectListSlice';
import LoaderButton from '../../../components/buttons/LoaderButton';
import SimpleLoader from '../../../components/loader/SimpleLoader';
import Error from '../../../components/error/Error';
import SearchDropdown from '../../../components/dropdown/SearchDropdown';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import IIcon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {COLORS} from '../../../configs/constants/colors';
import {apiRequest} from '../../../utils/api';
import {getApi} from '../../../services/getApi';
import {saveExpenseList} from '../../../redux/slices/expenseListSlice';
import {saveAllExpenseList} from '../../../redux/slices/allExpenseListSlice';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import axios from 'axios';

// create a component
const AddEditExpense = ({navigation, route}) => {
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);

  const {expense} = route?.params;
  const {projectList} = useSelector(state => state?.projects);
  const [expenseProduct, setExpenseProduct] = useState([]);
  const [team, setTeam] = useState([]);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProject = async () => {
    setLoading(true);
    setError(null);
    try {
      const resProj = await apiRequest('post', 'specific_project_record', {
        uid: authUser?.uid,
      });

      if (resProj.data?.result?.response) {
        dispatch(saveProjectList(resProj?.data?.result?.response));
      } else {
        if (!resProj?.data?.result?.response) {
          throw Error(resProj?.data?.result);
        }
      }
    } catch (error) {
      setError(error);
    }
  };

  const fetchExpProd = async () => {
    setLoading(true);
    setError(null);
    try {
      const resEPro = await apiRequest('post', 'get/expense/product', {});

      if (resEPro.data?.result?.response) {
        setExpenseProduct(resEPro.data?.result?.response);
      } else {
        if (!resEPro?.data?.result?.response) {
          throw Error(resEPro?.data?.result);
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

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
    if (projectList?.length == 0) {
      fetchProject();
    }
    fetchExpProd();
    user?.user_type !== 'worker' && fetchTeam();

    return () => {
      setError(null);
      setLoading(true);
    };
  }, []);

  const [selectedFiles, setSelectedFiles] = React.useState([]);

  const pickDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const files = results.map(result => ({
        uri: result.uri,
        name: result.name,
        type: result.type,
      }));

      setSelectedFiles(files);
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('Error 1 ', error);
      } else {
        throw error;
      }
    }
  };

  const [expenseProductId, setExpenseProductId] = useState(
    expense?.product_id || null,
  );
  const [workerId, setWorkerId] = useState(expense?.employee_id || user?.id);
  const [projectId, setProjectId] = useState(expense?.project_id || null);
  const [description, setDescription] = useState(expense?.name || null);
  const [total, setTotal] = useState(expense?.total_amount || null);
  const [paidBy, setPaidBy] = useState(expense?.payment_mode || 'own_account');
  const [loadingReq, setLoadingReq] = useState(false);

  const [expenseDate, setExpenseDate] = useState(
    new Date(expense?.date || new Date()),
  );
  const [showD, setShowD] = useState(false);

  const onDateChange = (event, selectedValue) => {
    const currentDate = selectedValue || new Date();
    setExpenseDate(currentDate);
  };

  const createExpense = async status => {
    if (
      projectId == null ||
      expenseProductId == null ||
      description == null ||
      total == null
    ) {
      return showMessage('Please fill complete form');
    }
    if (user?.user_type !== 'worker' && workerId == null) {
      return showMessage('Please select an employee');
    }

    setLoadingReq(true);
    try {
      let formdata = new FormData();

      selectedFiles?.length > 0 &&
        formdata.append('attach_file', selectedFiles[0]);
      formdata.append('date', moment(expenseDate).format('YYYY-MM-DD'));
      formdata.append('name', description);
      formdata.append('employee_id', workerId);
      formdata.append('product_id', expenseProductId);
      formdata.append('project_id', projectId);
      formdata.append('unit_amount', total);
      formdata.append('payment_mode', paidBy);
      formdata.append('state', status);
      expense && formdata.append('id', expense?.id);

      let url = expense?.date ? 'update/expense' : 'expense/create';

      const resp = await axios.post(
        `http://erp.atecaconsulting.com:8069/${url}`,
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        },
      );
      console.log('resppppppppp ', resp);
      if (
        resp?.data == 'Record created successfully' ||
        resp?.data?.response == 'Record Updated'
      ) {
        let url =
          workerId == user?.id
            ? 'expense_data'
            : 'get/worker/expense';
        const response = await getApi(url, {
          uid: authUser?.uid,
        });

        if (response) {
          dispatch(
            workerId == user?.id
              ? saveExpenseList(response)
              : saveAllExpenseList(response),
          );
        }
        navigation.goBack();
        return showMessage(
          `Expense ${expense ? 'updated' : 'created'} successfully`,
        );
      }
    } catch (error) {
      return showMessage(error?.message ?? 'Something went wrong!');
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <>
      {projectList?.length > 0 && expenseProduct?.length > 0 && (
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{
            padding: 10,
          }}>
          <View>
            {user?.user_type == 'worker' ? (
              <Text style={styles.hardData}>{user?.name}</Text>
            ) : (
              <>
                {team.length > 0 && (
                  <SearchDropdown
                    data={team}
                    placeholder="Select Employee"
                    inputBoxStyle={styles.inputBoxStyle}
                    searchContainerStyle={styles.searchContainerStyle}
                    searchListContainerStyle={styles.searchListContainerStyle}
                    searchListStyle={styles.searchListStyle}
                    searchListTextStyle={{color: '#444'}}
                    value={team?.find(i => i?.id == workerId)}
                    onPressList={item => {
                      setWorkerId(item?.id);
                    }}
                  />
                )}
              </>
            )}

            <TouchableOpacity
              onPress={() => setShowD(true)}
              style={styles.searchContainerStyle}>
              <Text style={styles.inputBoxStyle}>
                {moment(expenseDate).format('MMM DD, YYYY')}
              </Text>
              <IIcon
                name="calendar"
                size={20}
                color="#0098d9"
                style={{position: 'absolute', right: 10}}
              />
            </TouchableOpacity>
            {showD && (
              <RNDateTimePicker
                value={expenseDate}
                display="default"
                mode={'date'}
                onChange={(e, s) => {
                  setShowD(false);
                  onDateChange(e, s);
                }}
              />
            )}

            <TextInput
              style={styles.inputField}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              placeholder="Enter Description e.g. Lunch with Customer"
              value={description}
              onChangeText={setDescription}
            />

            <SearchDropdown
              data={expenseProduct}
              placeholder="Select Expense Name"
              inputBoxStyle={styles.inputBoxStyle}
              searchContainerStyle={styles.searchContainerStyle}
              searchListContainerStyle={styles.searchListContainerStyle}
              searchListStyle={styles.searchListStyle}
              searchListTextStyle={{color: '#444'}}
              value={expenseProduct?.find(i => i?.id == expenseProductId)}
              onPressList={item => {
                setExpenseProductId(item?.id);
              }}
            />

            <SearchDropdown
              data={projectList}
              placeholder="Select Project"
              inputBoxStyle={styles.inputBoxStyle}
              searchContainerStyle={styles.searchContainerStyle}
              searchListContainerStyle={styles.searchListContainerStyle}
              searchListStyle={styles.searchListStyle}
              searchListTextStyle={{color: '#444'}}
              value={projectList?.find(i => i?.id == projectId)}
              onPressList={item => {
                setProjectId(item?.id);
              }}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#444', width: '45%', marginTop: 10}}>
                Total
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                style={[styles.inputField, {height: 40, flex: 1}]}
                placeholder="0.00"
                value={total?.toString()}
                onChangeText={setTotal}
              />
              <Text>{user?.currency_name}</Text>
            </View>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <Text style={{color: '#444', width: '45%'}}>Paid by</Text>

              <View style={{flex: 1}}>
                <TouchableOpacity
                  onPress={() => setPaidBy('own_account')}
                  style={[
                    styles.radioBtn,
                    {
                      borderColor:
                        paidBy == 'own_account'
                          ? '#444'
                          : 'rgba(255,255,255, 0)',
                    },
                  ]}>
                  <Text style={{color: '#444'}}>• Employee (to reimburse)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setPaidBy('company_account')}
                  style={[
                    styles.radioBtn,
                    {
                      marginTop: 5,
                      borderColor:
                        paidBy == 'company_account'
                          ? '#444'
                          : 'rgba(255,255,255, 0)',
                    },
                  ]}>
                  <Text style={{color: '#444'}}>• Company</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button onPress={pickDocument} title="Choose Document" />

            {selectedFiles.map((file, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: '#d5d5d5',
                  marginVertical: 2,
                  padding: 5,
                  borderRadius: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={{color: '#444'}}>{file.name}</Text>

                <TouchableOpacity
                  onPress={() =>
                    setSelectedFiles(files =>
                      files.filter(i => i?.name !== file?.name),
                    )
                  }>
                  <Icon name="close" size={20} color={'#444'} />
                </TouchableOpacity>
              </View>
            ))}

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <LoaderButton
                label={expense ? 'Update' : 'Save'}
                loading={loadingReq}
                onPress={() => createExpense('draft')}
                style={{flex: 1}}
              />

              {/* <LoaderButton
                    label={'Save and Submit'}
                    loading={loadingReq}
                    onPress={() => createExpense('3_unauthorized')}
                    style={{
                      backgroundColor: COLORS.secondary_lg[1],
                      marginLeft: 10,
                      flex: 1.4,
                    }}
                  /> */}
            </View>
          </View>
        </ScrollView>
      )}
      {loading && <SimpleLoader />}
      {error && (
        <Error
          error={error}
          onPress={() => {
            fetchProject();
            fetchExpProd();
            user?.user_type !== 'worker' && fetchTeam();
          }}
        />
      )}
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
    padding: 10,
  },
  modalInnerContainer: {
    width: '100%',
    minHeight: '50%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444444',
  },
  modalCloseBtn: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary_lg[0],
    borderRadius: 50,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
  },
  hardData: {
    padding: 10,
    backgroundColor: '#e5e5e5',
    color: '#444',
    borderRadius: 10,
  },
  searchContainerStyle: {
    marginTop: 10,
    borderWidth: 1.5,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: COLORS.secondary_lg[0],
  },
  inputBoxStyle: {
    padding: 5,
    marginTop: -2,
    paddingHorizontal: 10,
    fontSize: 14,
    flex: 1,
    color: '#444444',
  },
  searchListStyle: {
    backgroundColor: '#f1f1f1',
    padding: 5,
  },
  searchListContainerStyle: {
    borderRadius: 10,
    maxHeight: 150,
  },
  btn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // marginRight: 10,
  },
  inputField: {
    borderWidth: 1.5,
    padding: 10,
    borderColor: COLORS.secondary_lg[0],
    borderRadius: 10,
    marginTop: 10,
  },
  radioBtn: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#e5e5e5',
    borderWidth: 1,
  },
});

//make this component available to the app
export default AddEditExpense;

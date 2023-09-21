//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Fontisto';
import {COLORS} from '../../../configs/constants/colors';
import LoaderButton from '../../../components/buttons/LoaderButton';
import {apiRequest} from '../../../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
import {saveAllExpenseList} from '../../../redux/slices/allExpenseListSlice';
import {saveExpenseList} from '../../../redux/slices/expenseListSlice';
import {getApi} from '../../../services/getApi';

// create a component
const ExpenseView = ({route, navigation}) => {
  const expenseData = route.params?.expense;
  const {expenseList} = useSelector(state => state?.expenseList);
  const {allExpenseList} = useSelector(state => state?.allExpenseList);
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);

  const expense =
    expenseData?.employee_id == user?.id
      ? expenseList.find(i => i?.id == expenseData?.id)
      : allExpenseList.find(i => i?.id == expenseData?.id);

  const dispatch = useDispatch();
  const [loadingReq, setLoadingReq] = useState(false);

  const updateStatus = async state => {
    try {
      setLoadingReq(true);
      const res = await apiRequest('post', 'update/expense/status', {
        id: expense?.id,
        state: state,
      });

      if (res?.data?.result) {
        let url =
          expenseData?.employee_id == user?.id
            ? 'expense_data'
            : 'get/worker/expense';

        const response = await getApi(url, {
          uid: authUser?.uid,
        });
        // response && setExpenseList(response);
        if (response) {
          dispatch(
            expenseData?.employee_id == user?.id
              ? saveExpenseList(response)
              : saveAllExpenseList(response),
          );
          if (state == 'approved') {
            return showMessage('Expense approved');
          }
          if (state == 'refused') {
            return showMessage('Expense rejected');
          } else {
            showMessage('Expense submitted');
          }
        }
      }
    } catch (error) {
      showMessage(error?.message || 'Something went wrong');
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#444'}}>
          {moment(expense?.date).format('MMM DD, YYYY')}
        </Text>

        {expense?.state && (
          <Text style={styles.expenseStatus}>{expense?.state}</Text>
        )}
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginVertical: 10,
          color: COLORS.secondary,
        }}>
        {expense?.employee}
      </Text>

      <View>
        <Text style={{color: 'gray', fontWeight: 'bold'}}>Project Name</Text>
        <Text
          style={{
            color: COLORS.secondary_lg[0],
            fontSize: 17,
            fontWeight: 'bold',
          }}>
          {expense?.project}
        </Text>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{color: 'gray', fontWeight: 'bold'}}>Expense Name</Text>
        <Text
          style={{
            color: '#444',
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          {expense?.product}
        </Text>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{color: 'gray', fontWeight: 'bold'}}>Description</Text>
        <Text
          style={{
            color: '#444',
            fontSize: 15,
          }}>
          {expense?.name}
        </Text>
      </View>

      <View style={styles.detailCont}>
        <HorizontalText
          text1={'Total'}
          text2={`${expense?.currency_symbol} ${expense?.total_amount}`}
        />
        <Divider />

        <HorizontalText
          text1={'Paid by'}
          text2={
            expense?.payment_mode == 'own_account'
              ? 'Employee (to reimburse)'
              : 'Company'
          }
        />
        <Divider />

        <HorizontalText
          text1={'Invoice State'}
          text2={expense?.invoice_state}
        />
        <Divider />

        <HorizontalText text1={'Bill No'} text2={expense?.bill_no} />
        <Divider />

        <HorizontalText text1={'Attachment'} text2={expense?.attachment} />
      </View>

      {expense?.state == 'draft' && expense?.employee_id == user?.id && (
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <LoaderButton
            label={'Edit'}
            onPress={() =>
              navigation.navigate('AddEditExpense', {
                expense,
                name: 'Update Expense',
              })
            }
            loading={false}
            style={{backgroundColor: COLORS.secondary_lg[1], flex: 1}}
          />
          {expense?.state == 'draft' && (
            <LoaderButton
              label={'Submit'}
              loading={loadingReq}
              style={{marginLeft: 10, flex: 1}}
              onPress={() => updateStatus('reported')}
            />
          )}
        </View>
      )}

      {expense?.state == 'reported' &&
        user?.user_type !== 'worker' &&
        expense?.employee_id !== user?.id && (
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <LoaderButton
              label={'Reject'}
              onPress={() => updateStatus('refused')}
              loading={loadingReq}
              style={{backgroundColor: 'red', flex: 1}}
            />
            <LoaderButton
              label={'Approve'}
              loading={loadingReq}
              style={{marginLeft: 10, flex: 1}}
              onPress={() => updateStatus('approved')}
            />
          </View>
        )}

      {expense?.state == 'refused' && expense?.employee_id == user?.id && (
        <LoaderButton
          label={'Convert to draft'}
          onPress={() => updateStatus('draft')}
          loading={loadingReq}
        />
      )}
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  detailCont: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
  },
  expenseStatus: {
    fontSize: 13,
    backgroundColor: '#b9edbb',
    color: 'green',
    padding: 5,
    borderRadius: 30,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});

//make this component available to the app
export default ExpenseView;

const Divider = () => {
  return (
    <View
      style={{
        width: '90%',
        height: 1,
        alignSelf: 'center',
        backgroundColor: 'gray',
      }}
    />
  );
};

const HorizontalText = ({text1, text2}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
      }}>
      <Text style={{color: '#444', fontSize: 15}}>{text1}</Text>
      <Text
        style={{color: '#444', fontSize: 15, width: '60%', textAlign: 'right'}}>
        {text2}
      </Text>
    </View>
  );
};

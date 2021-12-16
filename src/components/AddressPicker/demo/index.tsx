/**
 * title: 基础 选址
 * desc: 表单使用 demo
 */
import React, { FC, useState } from 'react';
import { Button, WhiteSpace, Toast } from 'antd-mobile-v2';
import DynamicForm, {
  useForm,
  Store,
  ValidateErrorEntity,
  AddressPicker,
} from '@alitajs/dform';

import CountryList from '@bang88/china-city-data';

const Page: FC = () => {
  const [form] = useForm();
  const [formsValues] = useState({
    homeAddr: {
      label: ['福建省', '福州市', '鼓楼区'],
      value: ['35', '3501', '350102'],
    },
  });
  const onFinish = (values: Store) => {
    // eslint-disable-next-line no-console
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    // eslint-disable-next-line no-console
    console.log('Failed:', errorInfo);
  };

  const [homeAddrData, setHomeAddrData] = useState<any>([]);
  const [homeAddrLastLevel, sethomeAddrLastLevel] = useState(false);
  const [workAddrData, setWorkAddrData] = useState<any>([]);
  const [workAddrLastLevel, setworkAddrLastLevel] = useState(false);

  const queryList = (list: any, val: string | number) => {
    let newList: any[] = [];
    list.map((item: { value: string; children: any[] }) => {
      if (item.value === val) {
        newList = item.children;
      }
      if (item.children && Array.isArray(item.children)) {
        const vals = queryList(item.children, val);
        if (vals && vals.length > 0) {
          newList = vals;
        }
      }
    });
    return newList;
  };

  const getResetHomeAddrList = (values: (number | string)[]) => {
    let data: { label: string; value: string }[] = [];
    switch (values.length) {
      case 0:
        data = CountryList;
        break;
      case 1:
      case 2:
        data = queryList(CountryList, values[values.length - 1]);
        break;
      case 3:
        break;
      default:
        break;
    }
    return data;
  };

  const getResetWorkAddrList = (values: (number | string)[]) => {
    let data: { label: string; value: string }[] = [];
    switch (values.length) {
      case 0:
        data = CountryList;
        break;
      case 1:
      case 2:
        data = queryList(CountryList, values[values.length - 1]);
        break;
      case 3:
        data = [
          { label: '街道1', value: 'street1' },
          { label: '街道2', value: 'street2' },
          { label: '街道3', value: 'street3' },
          { label: '街道4', value: 'street4' },
        ];
        break;
      default:
        break;
    }
    return data;
  };

  const resetHomeAddrList = (values: (number | string)[]) => {
    let mValues = JSON.parse(JSON.stringify(values));
    let data: { label: string; value: string }[] =
      getResetHomeAddrList(mValues);
    if (!!data.length) {
      if (homeAddrLastLevel) sethomeAddrLastLevel(false);
    } else {
      if (!!resetHomeAddrList.length) {
        mValues.splice(mValues.length - 1, 1);
        data = getResetHomeAddrList(mValues);
      }
      sethomeAddrLastLevel(true);
    }
    if (!!data.length) setHomeAddrData(data);
    Toast.hide();
  };

  const resetWorkAddrList = (values: (number | string)[]) => {
    let mValues = JSON.parse(JSON.stringify(values));
    let data: { label: string; value: string }[] =
      getResetWorkAddrList(mValues);

    if (!!data.length) {
      if (workAddrLastLevel) setworkAddrLastLevel(false);
    } else {
      if (!!resetWorkAddrList.length) {
        mValues.splice(mValues.length - 1, 1);
        data = getResetWorkAddrList(mValues);
      }
      setworkAddrLastLevel(true);
    }
    if (!!data.length) {
      setWorkAddrData(data);
    }
    Toast.hide();
  };

  const formProps = {
    onFinish,
    onFinishFailed,
    formsValues,
    form,
    autoLineFeed: false,
    isDev: false,
  };
  return (
    <>
      <DynamicForm {...formProps}>
        <AddressPicker
          fieldProps="homeAddr"
          title="工作地址"
          placeholder="选择当前居住城市"
          required
          data={homeAddrData}
          lastLevel={homeAddrLastLevel}
          placeholderList={['请选择省', '请选择市', '请选择区']}
          onChangeLevel={(values: (string | number)[]) => {
            // eslint-disable-next-line no-console
            resetHomeAddrList(values);
          }}
          onChange={(value: any) => {
            console.log('onChangevalue', value);
          }}
        />
        <AddressPicker
          fieldProps="workAddr"
          title="居住地址"
          placeholder="请选择"
          positionType="vertical"
          data={workAddrData}
          lastLevel={workAddrLastLevel}
          placeholderList={['请选择省', '请选择市', '请选择区', '请选择街道']}
          onChangeLevel={(values: (string | number)[]) => {
            Toast.show('加载中');
            setTimeout(() => {
              resetWorkAddrList(values);
              Toast.hide();
            }, 100);
          }}
          onChange={(value: any) => {
            console.log('onChangevalue', value);
          }}
          noData={<div>暂无街道数据</div>}
        />
      </DynamicForm>
      <WhiteSpace size="sm" />
      <Button type="primary" onClick={() => form.submit()}>
        Submit
      </Button>
    </>
  );
};

export default Page;

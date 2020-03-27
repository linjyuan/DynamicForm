import React, { FC, useState, useEffect } from 'react';
import { Modal, Flex, List } from 'antd-mobile';
import classnames from 'classnames';
import difference from 'lodash/difference';
import { IModalData, IAddressPickerProps } from './interface';
import { resetLabel } from '../../utils';
import { InputItem } from '..';
import '../../styles/index.less';

const { Item } = List;

const AddressPickerGroup: FC<IAddressPickerProps> = props => {
  const {
    data = [],
    placeholder = '请选择',
    positionType = 'horizontal',
    title,
    disabled = false,
    onChangeLevel,
    onChange,
    level = 3,
    placeholderList = [],
    initValue = {},
  } = props;

  // input 框的值
  const [inputLabel, setInputLabel] = useState<string>('');
  const [modalFlag, setModalFlag] = useState<boolean>(false);

  const [preInitValue, setPreInitValue] = useState<any>({});

  // 弹框选中的头部文字列表
  const [labelList, setLabelList] = useState<string[]>(
    placeholderList && placeholderList.length ? [placeholderList[0]] : ['请选择'],
  );

  // value 值列表
  const [valueList, setValueList] = useState<(string | number)[]>([]);

  // 当前列表数据
  const [dataList, setDataList] = useState<IModalData[] | []>([]);

  // 当前所在层级数字
  const [nowLevel, setNowLevel] = useState<number>(0);

  const isVertical = positionType === 'vertical';

  useEffect(() => {
    if (data.length === 0) return;
    setDataList(
      data.map(item => {
        const newItem = item;
        newItem.flag = false;
        return newItem;
      }),
    );
    setPreInitValue(initValue);
  }, [data]);

  const openMoal = () => {
    if (disabled) return;
    setModalFlag(true);
  };

  const onCancel = () => {
    setModalFlag(false);
  };

  const onConfirm = () => {
    const newLabelList = JSON.parse(JSON.stringify(labelList));
    if (nowLevel !== level) newLabelList.pop();
    setInputLabel(newLabelList.join(','));
    setModalFlag(false);
  };

  const listClick = (val: any) => {
    // 选中数据的时候刷新列表
    setDataList(
      [...dataList].map((item: any) => {
        const newItem = item;
        if (item.value === val.value) newItem.flag = true;
        else newItem.flag = false;
        return newItem;
      }),
    );

    const newList = JSON.parse(JSON.stringify(labelList));
    const newValueList = JSON.parse(JSON.stringify(valueList));

    // 设置当前层级
    newList.splice(newList.length - 1, 1, val.label);
    newValueList.push(val.value);
    let insLevel = nowLevel;
    if (nowLevel !== level) insLevel += 1;
    setNowLevel(insLevel);

    // 调用改变层级的事件给用户
    if (onChangeLevel) onChangeLevel(insLevel);

    // 如果层级符合，将数据放入input 中，并且关闭弹框
    const newLabelList = JSON.parse(JSON.stringify(newList));
    if (insLevel === level) {
      if (insLevel !== level) newLabelList.pop();
      setInputLabel(newLabelList.join(','));
      setModalFlag(false);
    }

    // 设置头部展示列表和值列表
    setLabelList(resetLabel(newList, placeholderList));
    setValueList(newValueList);

    if (onChange) onChange({ label: newLabelList, value: newValueList });
  };

  const labelClick = (index: number) => {
    // 设置当前的层级
    setNowLevel(index);

    const newLabelList = labelList.splice(0, index);
    const newValueList = valueList.splice(0, index);

    // 调用改变层级的事件给用户
    if (onChangeLevel) onChangeLevel(newLabelList.length);
    if (onChange) onChange({ label: newLabelList, value: newValueList });

    // 设置头部展示列表
    setLabelList(resetLabel(JSON.parse(JSON.stringify(newLabelList)), placeholderList));
    setValueList(newValueList);
  };

  const listReverse = [];
  // eslint-disable-next-line no-plusplus
  for (let i = labelList.length; i < 4; i++) {
    listReverse.push(
      Math.random()
        .toString(36)
        .substring(7),
    );
  }

  return (
    <>
      <InputItem
        isVertical={isVertical}
        value={inputLabel}
        placeholder={placeholder}
        readOnly
        onClick={() => {
          openMoal();
        }}
        onChange={e => {
          setInputLabel(e.target.value);
        }}
      >
        {title}
      </InputItem>
      <Modal
        popup
        visible={modalFlag}
        onClose={() => {
          onCancel();
        }}
        className="alitajs-dform-address"
        animationType="slide-up"
        title={
          <div className="am-picker-popup-header">
            <div
              className="am-picker-popup-item am-picker-popup-header-left"
              onClick={() => {
                onCancel();
              }}
            >
              取消
            </div>
            <div className="am-picker-popup-item am-picker-popup-title">{title}</div>
            <div
              className="am-picker-popup-item am-picker-popup-header-right"
              onClick={() => {
                onConfirm();
              }}
            >
              确定
            </div>
          </div>
        }
      >
        <div className="alitajs-dform-address-content">
          <div className="alitajs-dform-address-value">
            <Flex align="start">
              {[...labelList].map((label: any, index: number) => (
                <Flex.Item
                  key={label}
                  className={classnames({
                    'alitajs-dform-address-value-item': true,
                    'alitajs-dform-address-value-select': index + 1 === labelList.length,
                  })}
                  onClick={() => {
                    labelClick(index);
                  }}
                >
                  {label}
                </Flex.Item>
              ))}
              {listReverse.map((val: any) => (
                <Flex.Item key={val}></Flex.Item>
              ))}
            </Flex>
          </div>
          <div className="alitajs-dform-address-list">
            <List>
              {[...dataList].map(item => (
                <Item key={item.value}>
                  <div
                    className="alitajs-dform-address-list-content"
                    onClick={() => {
                      listClick(item);
                    }}
                  >
                    <div>{item.label}</div>
                    {item.flag && <div className="alitajs-dform-tick"></div>}
                  </div>
                </Item>
              ))}
            </List>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddressPickerGroup;

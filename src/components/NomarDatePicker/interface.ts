import React, { CSSProperties } from 'react';
import { PropsType } from 'antd-mobile-v2/es/date-picker/index';
import { ErrorValueProps, BaseComponentProps } from '../../PropsType';

export interface DateProps extends Omit<PropsType, 'extra'> {
  defaultValue?: Date;
  arrow?: boolean;
  extra?: string | React.ReactNode;
}

export type DatePickerType = PropsType & BaseComponentProps;

export interface INomarDatePickerProps extends Omit<DatePickerType, 'extra'> {
  modeType?: PropsType['mode'];
  fieldProps2?: string;
  secondProps?: DateProps;
  placeholder?: string;
  labelNumber?: number;
  coverStyle?: CSSProperties;
  errorValue?: ErrorValueProps;
  defaultValue?: Date | undefined | string;
  arrow?: boolean;
  extra?: string | React.ReactNode;
}

export interface INomarDatePickerGroupProps extends INomarDatePickerProps {
  onChange: (e: any) => void;
  value?: Date | undefined;
  arrow?: boolean;
}

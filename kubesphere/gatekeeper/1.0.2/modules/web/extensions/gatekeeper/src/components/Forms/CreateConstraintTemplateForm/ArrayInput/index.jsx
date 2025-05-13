import React from 'react';

import Item from './Item';
import { get, isUndefined } from 'lodash';

const ArrayInput = props => {
  const { onChange, value, prefix } = props;

  const getDefaultValue = () => {
    const { itemType } = props;

    if (itemType === 'object') {
      return {};
    }

    return '';
  };

  const handleChange = (index, childValue) => {
    const itemValue = get(childValue, 'currentTarget.value', childValue);

    let newValues = [];

    if (isUndefined(value?.[index])) {
      value[index] = itemValue;
      newValues = [...(value || [])];
    } else {
      newValues = (value || []).map((item, _index) => (_index === index ? itemValue : item));
    }

    onChange?.(newValues);
  };

  const renderItems = () => {
    const { value, children, id } = props;

    return value?.map((item, index) => (
      <Item
        key={index}
        name={`${id}[${index}]`}
        index={index}
        value={item || getDefaultValue()}
        arrayValue={value}
        component={children}
        onChange={childValue => handleChange(index, childValue)}
      />
    ));
  };

  return <div>{renderItems()}</div>;
};

export default ArrayInput;

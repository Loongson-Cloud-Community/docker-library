import React, { useState } from 'react';

import { StyledItem, ErrorTip } from './styles';

const Item = ({ component, index, value, arrayValue, onChange, onDelete }) => {
  const [keyErrorTip, setKeyError] = useState('');

  const handleKeyError = info => {
    const message = info?.message ?? '';
    setKeyError(message);
  };

  const childNode = React.cloneElement(component, {
    ...component.props,
    index,
    value,
    arrayValue,
    onChange,
    handleKeyError,
  });

  return (
    <>
      <StyledItem>{childNode}</StyledItem>
      {keyErrorTip !== '' && <ErrorTip>{keyErrorTip}</ErrorTip>}
    </>
  );
};

export default Item;

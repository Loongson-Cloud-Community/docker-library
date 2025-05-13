import React, { useEffect } from 'react';
import { Form, FormItem, Input } from '@kubed/components';
import { get, merge, set } from 'lodash';
import ArrayInput from './ArrayInput';

import TargetItem from './TargetItem';
import { FormWrapper } from './styles';

const PATTERN_CRD_NAME = /^[a-z]([-A-Z-a-z0-9]*[A-Za-z0-9])?$/;

const CreateConstraintTemplateForm = ({
  form,
  data,
  className,
  initialValues,
  isCodeMode,
  onChange = () => {},
}) => {
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(initialValues);
  }, []);

  const handleChange = () => {
    const formData = form.getFieldsValue();
    const name = get(formData, `spec.crd.spec.names.kind`)?.toLowerCase();
    set(formData, 'metadata.name', name);

    onChange(merge({},initialValues, formData));
  };

  const checkItemValid = item => {
    let flag = item.target && item.rego;

    return flag;
  };
  const itemValidator = (rule, value, callback) => {
    if (!value) {
      return callback();
    }
    if (value.some(item => !checkItemValid(item))) {
      return callback({ message: t('INVALID_EXPRESSION') });
    }
    callback();
  };

  return (
    <FormWrapper form={form} className={className} onFieldsChange={handleChange} data={data}>
      <FormItem
        name={['spec', 'crd', 'spec', 'names', 'kind']}
        label={t('CONSTRAINT_TEMPLATE_CRD_NAME')}
        help={t('CONSTRAINT_TEMPLATE_CRD_NAME_DESC')}
        rules={[
          { required: true, message: t('CONSTRAINT_TEMPLATE_CRD_NAME_EMPTY') },
          {
            pattern: PATTERN_CRD_NAME,
            message: t('INVALID_CONSTRAINT_TEMPLATE_NAME_DESC'),
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        name={['spec', 'targets']}
        label={t('CONSTRAINT_TEMPLATE_TARGETS')}
        rules={[
          { required: true, message: t('CONSTRAINT_TEMPLATE_TARGETS_EMPTY') },
          { validator: itemValidator, checkOnSubmit: true },
        ]} //checkOnSubmit: true
      >
        <ArrayInput itemType="object">
          <TargetItem />
        </ArrayInput>
      </FormItem>
    </FormWrapper>
  );
};

export default CreateConstraintTemplateForm;

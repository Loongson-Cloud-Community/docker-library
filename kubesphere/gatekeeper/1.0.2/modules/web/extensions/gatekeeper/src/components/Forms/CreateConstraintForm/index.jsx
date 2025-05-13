import React, { useEffect, useState } from 'react';
import { FormItem, Input, Select } from '@kubed/components';
import { get, isEmpty } from 'lodash';
import { Pattern, PropertiesInput, ArrayInput, yaml } from '@ks-console/shared';
import KindItem from './KindItem';

import ParameterItem from './ParameterItem';
import { FormWrapper, FormItemError, NamespaceSelectorWrapper } from './styles';

const CreateConstraintForm = ({
  form,
  data,
  className,
  store,
  initialValues,
  cluster,
  onChange = () => {},
}) => {
  const [kindOptions, setKindOptions] = useState([]);
  const [error, setError] = useState('');
  const [parameterYamlData, setParameterYamlData] = useState({});

  const enforcementActionOptions = [
    { label: 'deny', value: 'deny' },
    { label: 'dryrun', value: 'dryrun' },
    { label: 'warn', value: 'warn' },
  ];

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(initialValues);
    handleGetKind();
    return () => {
      form.resetFields();
    };
  }, []);

  const handleGetKind = async () => {
    const result = await store.fetchConstraintKind({ cluster });

    const options =
      result?.data.map(item => {
        return {
          label: get(item, `spec.crd.spec.names.kind`),
          value: get(item, `spec.crd.spec.names.kind`),
          openAPIV3Schema: get(item, `spec.crd.spec.validation.openAPIV3Schema`, {}),
        };
      }) || [];

    setKindOptions(options);
  };

  const handleChange = v => {
    const formData = form.getFieldsValue();

    if (v.length > 0 && v[0].name.includes('kind')) {
      const value = v[0].value;

      const { openAPIV3Schema } = kindOptions.find(item => item.value === value);
      const yamlExample = store.generateExampleWithComments(openAPIV3Schema).trim();
      setParameterYamlData(yamlExample);

      onChange({
        ...formData,
        spec: { ...formData.spec, parameters: yaml.load(yamlExample) },
        apiVersion: 'constraints.gatekeeper.sh/v1beta1',
      });
    } else {
      if (v.length > 0 && !v[0].name.includes('parameters') && parameterYamlData) {
        onChange({
          ...formData,
          spec: { ...formData.spec, parameters: yaml.load(parameterYamlData) },
          apiVersion: 'constraints.gatekeeper.sh/v1beta1',
        });
      } else {
        onChange({
          ...formData,
          apiVersion: 'constraints.gatekeeper.sh/v1beta1',
        });
      }
    }
  };

  const checkItemValid = item => {
    return !isEmpty(item.kinds);
  };

  const itemValidator = (rule, value, callback) => {
    if (!value) {
      return callback();
    }

    if (value.some(item => !checkItemValid(item))) {
      return callback({ message: t('INVALID_CONSTRAINT_KINDS') });
    }
    callback();
  };

  const handleChangeParameters = value => {
    setParameterYamlData(value);
  };

  const nameValidator = async (rule, value) => {
    if (!value) {
      Promise.resolve();
    }
    const { kind } = form.getFieldsValue();
    if (value) {
      const res = await store.checkNameFn({ name: value, kind, cluster });
      if (res.exist) {
        return Promise.reject({ message: t('NAME_EXIST_DESC') });
      }
    }
    Promise.resolve();
  };

  return (
    <FormWrapper form={form} className={className} onFieldsChange={handleChange} data={data}>
      <FormItem
        name={['metadata', 'name']}
        label={t('CONSTRAINT_NAME')}
        help={t('CONSTRAINT_NAME_DESC')}
        rules={[
          { required: true, message: t('CONSTRAINT_NAME_EMPTY') },
          {
            pattern: Pattern.PATTERN_NAME,
            message: t('INVALID_CONSTRAINT_NAME_DESC'),
          },
          { validator: nameValidator, checkOnSubmit: true },
        ]}
      >
        <Input placeholder={t('CONSTRAINT_NAME_EMPTY')} />
      </FormItem>

      <FormItem
        name={['kind']}
        label={t('CONSTRAINT_KIND')}
        rules={[{ required: true, message: t('CONSTRAINT_KIND_PLACEHOLDER') }]}
      >
        <Select options={kindOptions} placeholder={t('CONSTRAINT_KIND_PLACEHOLDER')} />
      </FormItem>

      <FormItem
        name={['spec', 'enforcementAction']}
        label={t('ENFORCEMENT_ACTIONS_PLACEHOLDER')}
        rules={[{ required: true, message: t('ENFORCEMENT_ACTIONS_PLACEHOLDER') }]}
      >
        <Select
          options={enforcementActionOptions}
          placeholder={t('ENFORCEMENT_ACTIONS_PLACEHOLDER')}
          defaultValue={'deny'}
        />
      </FormItem>

      <NamespaceSelectorWrapper>
        <FormItem
          name={['spec', 'match', 'kinds']}
          label={'Match Kinds'}
          rules={[
            { required: true, message: t('CONSTRAINT_KINDS_PLACEHOLDER') },
            { validator: itemValidator, checkOnSubmit: true },
          ]}
        >
          <ArrayInput itemType="object" addText={t('ADD')} checkItemValid={checkItemValid}>
            <KindItem />
          </ArrayInput>
        </FormItem>
      </NamespaceSelectorWrapper>

      <NamespaceSelectorWrapper>
        <FormItem
          name={['spec', 'match', 'namespaceSelector', 'matchLabels']}
          label={t('NAMESPACE_LABELS')}
          validateStatus={error ? 'error' : undefined}
          help={error ? <FormItemError>{error}</FormItemError> : undefined}
        >
          <PropertiesInput
            addText={t('ADD')}
            onError={e => setError(e && e.message ? e.message : '')}
          />
        </FormItem>
      </NamespaceSelectorWrapper>

      <FormItem
        name={['spec', 'parameters']}
        label={t('CONSTRAINT_PARAMETERS')}
        validateStatus={error ? 'error' : undefined}
      >
        <ParameterItem yamlData={parameterYamlData} onChange={handleChangeParameters} />
      </FormItem>
    </FormWrapper>
  );
};

export default CreateConstraintForm;

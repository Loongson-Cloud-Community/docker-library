import React, { useState } from 'react';
import { Modal, Switch } from '@kubed/components';
import { Group } from '@kubed/icons';
import CreateConstraintTemplateForm from '../../Forms/CreateConstraintTemplateForm';
import { SwitchStyle } from './styles';
import { CodeEditor } from '@kubed/code-editor';
import { yaml } from '@ks-console/shared';

const CreateConstraintTemplateModal = ({
  form,
  onCancel,
  visible,
  initialValues,
  onOk,
  store,
  // onChange = () => {},
}) => {
  const [isCodeMode, setIsCodeMode] = useState(false);
  const [formData, setFormData] = useState(initialValues);
  const [yamlData,setYamlData] = useState({})


  const handleSubmit = () => {
    form.validateFields().then(() => {
      onOk?.(isCodeMode?yaml.load(yamlData):formData);
    }).catch(()=>{})
  };

  const handleChangeEditType=value =>{
    setIsCodeMode(value)
    if(value){
      setYamlData(yaml.getValue(formData))
    }else{
      setFormData(yaml.load(yamlData))
    }
    
  }

  const renderSwitch = () => {
    return (
      <SwitchStyle>
        <Switch onChange={handleChangeEditType} label={t('EDIT_YAML')} variant="button" />
      </SwitchStyle>
    );
  };

  const handleChange = value => {
    setFormData(value);
  };

  const handleYamlChange = value => {
    setYamlData(value);
  };

  return (
    <Modal
      title={t('CREATE_CONSTRAINT_TEMPLATE')}
      width={960}
      titleIcon={<Group size={40} />}
      visible={visible}
      onCancel={onCancel}
      headerExtra={renderSwitch()}
      onOk={handleSubmit}
      bodyStyle={{ padding: '20px' }}
    >
      {isCodeMode ? (
        <CodeEditor mode="yaml" value={yamlData} onChange={handleYamlChange} />
      ) : (
        <CreateConstraintTemplateForm
          form={form}
          initialValues={formData}
          onChange={handleChange}
        />
      )}
    </Modal>
  );
};

export default CreateConstraintTemplateModal;

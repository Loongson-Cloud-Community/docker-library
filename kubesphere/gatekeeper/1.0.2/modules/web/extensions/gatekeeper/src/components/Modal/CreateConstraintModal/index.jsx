import React, { useEffect, useState } from 'react'
import { Modal, Switch } from '@kubed/components'
import { Group } from '@kubed/icons'
import { CodeEditor } from '@kubed/code-editor'
import CreateConstraintForm from '../../Forms/CreateConstraintForm'
import { SwitchStyle } from './styles'
import { yaml } from '@ks-console/shared'
import { cloneDeep } from 'lodash'

const CreateConstraintModal = ({
  form,
  onCancel,
  visible,
  initialValues,
  onOk,
  store,
  cluster,
}) => {
  const [isCodeMode, setIsCodeMode] = useState(false)
  const [formData, setFormData] = useState(cloneDeep(initialValues))
  const [yamlData, setYamlData] = useState('')

  const handleSubmit = () => {
    form
      .validateFields()
      .then(() => {
        onOk?.(isCodeMode ? yaml.load(yamlData) : formData)
      })
      .catch(() => {})
  }

  const handleChangeEditType=value=>{
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
        <Switch
          onChange={handleChangeEditType}
          label={t('EDIT_YAML')}
          variant="button"
        />
      </SwitchStyle>
    )
  }

  const handleChange = value => {
    setFormData(value)
  }

  const handleYamlChange = value => {
    setYamlData(value)
  }

  return (
    <Modal
      title={t('CREATE_CONSTRAINT')}
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
        <CreateConstraintForm
          form={form}
          initialValues={formData}
          onChange={handleChange}
          store={store}
          cluster={cluster}
        />
      )}
    </Modal>
  )
}

export default CreateConstraintModal

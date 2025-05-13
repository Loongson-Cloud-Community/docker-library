import React from 'react'

import {  Input } from '@kubed/components';

import {TargetItemWrapper} from './styles'
import { CodeEditor } from '@kubed/code-editor';

const TargetItem =(props)=>{
  const {onChange,value} = props

  const handleChangeTarget = (e)=>{
   
    const value = e.target.value
    onChange?.({...props.value,target:value})
  }

  const handleChangeRego = (value)=>{
    onChange?.({...props.value,rego:value})
  }

  return (
  
    <TargetItemWrapper>
      <Input 
        name='target'
        placeholder={t('CONSTRAINT_TEMPLATE_TARGET_PLACEHOLDER')} 
        className="targetInput" 
        onChange={handleChangeTarget}
        disabled
        defaultValue={value.target}
      />
      <CodeEditor
        // mode='rego' 
        className="regoTextarea"
        name='rego' 
        hasUpload={false}
        hasDownload={false}
        value={value.rego}
        onChange={handleChangeRego}
      />

    </TargetItemWrapper>   
  )
}

export default TargetItem
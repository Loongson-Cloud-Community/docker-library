import React, { useEffect, useState } from 'react'

import { Input } from '@kubed/components'
import { ItemWrapper } from './styles'
import { isEmpty } from 'lodash'

const KindItem = props => {
  const { onChange, value } = props
  const [apiGroups, setApiGroups] = useState(value.apiGroups || [''])
  const [kinds, setKinds] = useState(value.kinds || [])

  useEffect(() => {
    handleChange()
  }, [kinds, apiGroups])

  const handleApiGroupsChange = e => {
    const _value = e.target.value
    setApiGroups(_value?_value.split(','):[''])
  }

  const handleKindsChange = e => {
    const _value = e.target.value
    setKinds(_value?_value.split(','):[])
  }

  const handleChange = () => {
    onChange({
      kinds,
      apiGroups,
    })
  }

  return (
    <ItemWrapper>
      <Input
        name="apiGroups"
        value={apiGroups}
        placeholder={'APIGroup'}
        onChange={handleApiGroupsChange}
      />
      <Input
        name="kinds"
        placeholder={'Kind'}
        value={kinds}
        onChange={handleKindsChange}
      />
    </ItemWrapper>
  )
}

export default KindItem

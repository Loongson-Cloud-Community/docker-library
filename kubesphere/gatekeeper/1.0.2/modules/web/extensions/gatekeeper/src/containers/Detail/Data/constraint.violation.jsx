import React from 'react';
import { Card } from '@kubed/components';

import { useDetailPage } from '@ks-console/shared';

import { BaseTable } from '@ks-console/shared';
import { get } from 'lodash';

function ConstraintViolation() {
  const { detail } = useDetailPage();

  const violations = get(detail, `status.violations`)

  const columns = [
    {
      title: 'Action',
      field: 'enforcementAction',
    },
    {
      title: 'Kind',
      field: 'kind',
    },
    {
      title: 'Namespace',
      field: 'namespace',
    },
    {
      title: 'Name',
      field: 'name',
      width: '19%',
    },
    {
      title: 'Message',
      field: 'message',
    },
  ];

  return (
    <Card hoverable padding={20}>
      {violations && <BaseTable columns={columns} dataSource={violations} />}
    </Card>
  );
}

export default ConstraintViolation;

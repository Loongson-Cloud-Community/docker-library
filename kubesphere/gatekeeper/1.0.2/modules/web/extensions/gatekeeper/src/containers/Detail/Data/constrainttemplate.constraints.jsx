import React, { useRef } from 'react';
import {
  useDetailPage,
  DataTable,
  formatTime,
} from '@ks-console/shared';

import { Human } from '@kubed/icons';
import { Card, Empty } from '@kubed/components';
import { constraintStore } from '../../../store';

import { StyledEmpty } from './styles';

function ConstraintTemplateConstraints() {
  const { params } = useDetailPage();
  const { mapper } = constraintStore;
  const tableRef = useRef();

  const { name } = params;

  function formatServerData(serverData) {
    return {
      ...serverData,
      items: serverData.items,
      totalItems: serverData.items.length,
    };
  }

  const url = constraintStore.getDetailUrl(params);
  const columns = [
    {
      title: t('name'),
      field: 'name',
      width: '33%',
    },
    {
      title: t('CREATION_TIME'),
      field: 'metadata.creationTimestamp',
      width: '33%',
      render: time => <p>{time ? formatTime(time) : t('NOT_LOGIN_YET')}</p>,
    },
  ];

  return (
    <Card sectionTitle={t('CONSTRAINT')} padding={0}>
      <DataTable
        ref={tableRef}
        url={url}
        columns={columns}
        tableName="template.constraint-list"
        rowKey="name"
        format={data => mapper(data)}
        serverDataFormat={formatServerData}
        showToolbar={false}
        emptyOptions={{
          element: (
            <StyledEmpty
              title={t('CONSTRAINT')}
              description={<span>{t('NO_CONSTRAINTS_DESC')}</span>}
              image={
                <img
                  src="https://open-policy-agent.github.io/gatekeeper/website/img/logo.svg"
                  alt=""
                  height={48}
                />
              }
            />
          ),
          withoutTable: true,
        }}
      />
    </Card>
  );
}

export default ConstraintTemplateConstraints;

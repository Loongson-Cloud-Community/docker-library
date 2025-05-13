import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { constraintTemplateStore } from '../../store';

import { Icon, formatTime, DetailPage } from '@ks-console/shared';

const PATH = '/clusters/:cluster/gatekeeper.constrainttemplates/:name';

const ConstraintTemplateDetails = () => {
  const { cluster, name } = useParams();
  const constraintTemplate = useRef();
  const tabs = [
    { path: `${PATH}/targets`, title: t('CONSTRAINT_TEMPLATE_TARGETS') },
    { path: `${PATH}/status`, title: t('CONSTRAINT_TEMPLATE_STATUS') },
    { path: `${PATH}/constraints`, title: t('CONSTRAINT_TEMPLATE_DETAIL_CONSTRAINTS') },
  ];

  const attrs = data => [
    { label: t('CLUSTER_PL'), value: cluster || '' },
    {
      label: t('CREATION_TIME_TCAP'),
      value: formatTime(data.metadata.creationTimestamp),
    },
    {
      label: 'CRD',
      value: data.spec.crd.spec.names.kind || '',
    },
  ];

  return (
    <>
      <DetailPage
        ref={constraintTemplate}
        tabs={tabs}
        authKey={constraintTemplateStore.module}
        store={constraintTemplateStore}
        params={{ cluster, name }}
        sideProps={{
          attrs,
          icon: <Icon name="key" size={28} style={{ verticalAlign: 'middle' }} />,
          breadcrumbs: {
            label: t('CONSTRAINT_TEMPLATE'),
            url: `/clusters/${cluster}/gatekeeper.constrainttemplates`,
          },
        }}
      />
    </>
  );
};

export default ConstraintTemplateDetails;

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Field, useForm } from '@kubed/components';
import { PageLayout } from '../../components/Layouts/PageLayout';

import { Pen, Trash } from '@kubed/icons';
import { DataTable, useCommonActions, useActionMenu, getOriginData } from '@ks-console/shared';
import { constraintTemplateStore } from '../../store';
import FORM_TEMPLATES from '../../utils/form.templates';
import CreateConstraintTemplateModal from '../../components/Modal/CreateConstraintTemplateModal';

const ConstraintTemplateList = () => {
  const { cluster } = useParams();
  const params = useParams();
  const templateRef = useRef();
  const [form] = useForm();
  const [createVisible, setCreateVisible] = useState(false);
  const { module, getResourceUrl } = constraintTemplateStore;
  const formTemplate = FORM_TEMPLATES[module]();
  const formatFn = data => {
    return {
      name: data.metadata.name,
      _originData: getOriginData(data),
      ...data,
    };
  };
  function formatServerData(serverData) {
    const totalItems = Number(serverData.metadata.continue) || serverData.items.length || 0;
    return {
      ...serverData,
      items: serverData.items,
      totalItems: totalItems,
    };
  }

  const callback = () => {
    templateRef?.current?.refetch();
  };

  const { editYaml, del } = useCommonActions({
    store: constraintTemplateStore,
    params: { cluster },
    callback,
  });

  const renderItemActions = useActionMenu({
    authKey: 'constrainttemplates',
    params: { cluster: cluster },
    actions: [
      {
        key: 'editYaml',
        icon: <Pen />,
        text: t('EDIT_YAML'),
        action: 'edit',
        onClick: editYaml,
      },
      {
        key: 'delete',
        icon: <Trash />,
        text: t('DELETE'),
        action: 'delete',
        onClick: del,
      },
    ],
  });

  const columns = [
    {
      title: t('Name'),
      field: 'name',
      sortable: false,
      searchable: true,
      render: (value, row) => (
        <Field
          value={value}
          label={row.target}
          as={Link}
          to={`/clusters/${cluster}/gatekeeper.constrainttemplates/${row.metadata.name}`}
        />
      ),
    },
    {
      title: t('Title'),
      canHide: true,
      render: (value, row) => (
        <Field value={row.metadata.annotations['metadata.gatekeeper.sh/title'] || '-'} />
      ),
    },
    {
      title: t('Description'),
      width: '50%',
      field: 'metadata.annotations.description',
      canHide: true,
      render: (value, row) => <Field value={value || '-'} />,
    },
    {
      id: 'more',
      title: '',
      width: 20,
      render: (value, record) => renderItemActions({ ...record }),
    },
  ];

  const renderTableActions = useActionMenu({
    authKey: module,
    params,
    autoSingleButton: true,
    actions: [
      {
        key: 'create',
        text: t('CREATE'),
        action: 'create',
        props: {
          color: 'secondary',
          shadow: true,
        },
        onClick: () => {
          setCreateVisible(true);
        },
      },
    ],
  });

  const handleCreate = data => {
    constraintTemplateStore
      .post({ cluster }, data)
      .then(res => {
        if (res) {
          callback();
          setCreateVisible(false);
        }
      })
      .catch(() => {});
  };

  return (
    <PageLayout title={t('Constraint Templates')}>
      <DataTable
        ref={templateRef}
        columns={columns}
        tableName="template-list"
        rowKey="name"
        format={formatFn}
        serverDataFormat={formatServerData}
        placeholder={t('SEARCH_BY_NAME')}
        url={getResourceUrl(params, true)}
        useStorageState={false}
        disableRowSelect={false}
        selectType={false}
        toolbarRight={renderTableActions({})}
      />
      {createVisible && (
        <CreateConstraintTemplateModal
          visible={createVisible}
          onOk={handleCreate}
          form={form}
          initialValues={formTemplate}
          onCancel={() => {
            setCreateVisible(false);
          }}
          store={constraintTemplateStore}
        />
      )}
    </PageLayout>
  );
};

export default ConstraintTemplateList;

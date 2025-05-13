import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Banner, Field, useForm, notify } from '@kubed/components';
import { Group, Pen, Trash } from '@kubed/icons';
import { PageLayout } from '../../components/Layouts/PageLayout';
import { DataTable, useCommonActions, getOriginData, useActionMenu } from '@ks-console/shared';
import { constraintStore } from '../../store';
import FORM_TEMPLATES from '../../utils/form.templates';
import CreateConstraintModal from '../../components/Modal/CreateConstraintModal';

const ConstraintList = () => {
  const { cluster } = useParams();
  const params = useParams();
  const constraintRef = useRef();
  const [form] = useForm();
  const [createVisible, setCreateVisible] = useState(false);
  const { module, getResourceUrl } = constraintStore;
  const formTemplate = FORM_TEMPLATES[module]();

  const url = getResourceUrl(params, true);

  const callback = () => {
    constraintRef?.current?.refetch();
  };

  const { editYaml, del } = useCommonActions({
    store: constraintStore,
    params: { cluster },
    callback,
  });

  const renderItemActions = useActionMenu({
    authKey: 'constraints',
    params: { cluster },
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
        onClick: item => {
          del({
            onOk: () => {
              constraintStore
                .delete({ ...item, cluster })
                .then(res => {
                  notify.success(t('DELETED_SUCCESSFULLY'));
                  callback('delete');
                })
                .catch(() => {});
            },
            resource: [item],
          });
        },
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
          as={Link}
          to={`/clusters/${params.cluster}/gatekeeper.constraints/${row.kind.toLowerCase()}/${
            row.name
          }`}
        />
      ),
    },
    {
      title: t('Kind'),
      field: 'kind',
      sortable: false,
      searchable: false,
    },
    {
      id: 'more',
      title: '',
      width: 20,
      render: (value, record) => renderItemActions({ ...record }),
    },
  ];

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
    constraintStore
      .post({ kind: data.kind.toLowerCase(), cluster }, data)
      .then(res => {
        if (res) {
          callback();
          setCreateVisible(false);
        }
      })
      .catch(() => {});
  };

  return (
    <PageLayout title={t('Constraints')}>
      <DataTable
        ref={constraintRef}
        columns={columns}
        tableName="constraint-list"
        rowKey="uid"
        format={data => {
          return formatFn(data);
        }}
        serverDataFormat={formatServerData}
        placeholder={t('SEARCH_BY_NAME')}
        url={url}
        useStorageState={false}
        disableRowSelect={false}
        selectType={false}
        toolbarRight={renderTableActions({})}
      />
      {createVisible && (
        <CreateConstraintModal
          visible={createVisible}
          onOk={handleCreate}
          form={form}
          initialValues={formTemplate}
          onCancel={() => {
            setCreateVisible(false);
          }}
          store={constraintStore}
          cluster={cluster}
        />
      )}
    </PageLayout>
  );
};

export default ConstraintList;

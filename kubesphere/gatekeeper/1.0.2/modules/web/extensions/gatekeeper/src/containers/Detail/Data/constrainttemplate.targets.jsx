import React from 'react';
import { Card, notify } from '@kubed/components';
import { CodeEditor } from '@kubed/code-editor';
import { useDetailPage, Icon, copyToClipboard } from '@ks-console/shared';
import { Wrapper, CardTitle, TextDesc, CodeEditorWrapper, CodeEditorOperations } from './styles';

function ConstraintTemplateTargets() {
  const { detail } = useDetailPage();
  return (
    <Card hoverable padding={20}>
      <CardTitle>{t('Targets')}</CardTitle>
      <Wrapper>
        <ul>
          {detail?.spec?.targets.map(item => {
            const handleCopy = () => {
              copyToClipboard(item.rego);
              notify.success(t('COPY_SUCCESSFUL'));
            };
            return (
              <li key={item.target}>
                <TextDesc className="mb12">{item.target}</TextDesc>
                <CodeEditorWrapper>
                  <CodeEditorOperations>
                    <Icon name="copy" size={20} onClick={handleCopy} />
                  </CodeEditorOperations>
                  <CodeEditor
                    value={item.rego}
                    mode="javascript"
                    hasDownload={false}
                    hasUpload={false}
                    readOnly={true}
                  />
                </CodeEditorWrapper>
              </li>
            );
          })}
        </ul>
      </Wrapper>
    </Card>
  );
}

export default ConstraintTemplateTargets;

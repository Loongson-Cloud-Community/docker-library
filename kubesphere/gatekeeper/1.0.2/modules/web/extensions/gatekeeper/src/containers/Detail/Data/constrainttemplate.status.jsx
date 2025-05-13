import React from 'react';
import { useDetailPage, Panel, Label } from '@ks-console/shared';

function ConstraintTemplateStatus() {
    const { detail } = useDetailPage();
    return (
        <Panel title={t('Status')}>
            <div>
                {
                    detail?.status.byPod.map(item => {
                        return <Label key={item.id} name={item.id} value={"GENERATION " + item.observedGeneration} />
                    })
                }
            </div>
        </Panel>
    );
}

export default ConstraintTemplateStatus;
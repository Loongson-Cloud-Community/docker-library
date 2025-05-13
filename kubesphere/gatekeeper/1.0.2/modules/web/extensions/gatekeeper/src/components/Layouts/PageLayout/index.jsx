import React from 'react';
import { Wrapper, Header, HeaderTitle, PageContent } from './styles';

const PageHeader = props => {
  const { title: titleProp, wrapperT = false } = props;
  const title = wrapperT ? wrapperTFn(titleProp) : titleProp;

  return (
    <Header>
      <HeaderTitle>{title}</HeaderTitle>
    </Header>
  );
};

export const PageLayout = props => {
  const { children, padding, ...rest } = props;

  const ksVersion = Number(globals?.ksConfig?.ksVersion?.slice(1).split('.').slice(0, 2).join('.'));
  const defalutPadding = ksVersion <= 4.1 ? '20px 0' : '20px';

  return (
    <Wrapper>
      <PageHeader {...rest} />
      <PageContent padding={padding || defalutPadding}>
        <div>{children}</div>
      </PageContent>
    </Wrapper>
  );
};

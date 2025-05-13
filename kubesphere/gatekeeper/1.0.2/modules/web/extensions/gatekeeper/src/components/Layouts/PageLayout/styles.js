/*
 * Please refer to the LICENSE file in the root directory of the project.
 * https://github.com/kubesphere/console/blob/master/LICENSE
 */

import { isNil, isNumber } from 'lodash';
import styled, { css } from 'styled-components';

const PageWrapper = styled.div``;

const Wrapper = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 1px;
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  align-items: stretch;
  background-color: #fff;
`;

const HeaderTitle = styled.div`
  color: ${props => props.theme.palette.accents_8};
  padding: 14px 20px;
  display: flex;
  font-size: 18px;
  line-height: 28px;
  display: flex;
  font-weight: bold;
  justify-content: center;
  align-items: center;
`;

const PageContent = styled.div`
  min-height: 0;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  > div {
    padding: ${({ padding }) =>
      isNil(padding) ? '20px' : isNumber(padding) ? `${padding}px` : padding};
  }
`;

export { Wrapper, PageContent, PageWrapper, Header, HeaderTitle };

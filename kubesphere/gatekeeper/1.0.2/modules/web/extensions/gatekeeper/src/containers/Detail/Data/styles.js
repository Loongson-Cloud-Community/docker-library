import styled from 'styled-components';
import { Empty } from '@kubed/components';

export const Wrapper = styled.div`
  padding: 20px;
  border-radius: 4px;
  background-color: #f9fbfd;

  & > ul > li {
    h6 {
      font-size: 14px;
      line-height: 1.43;
    }

    pre {
      margin-top: 8px;
      padding: 12px;
      border-radius: 4px;
      background-color: #ffffff;
      border: solid 1px #e3e9ef;
    }

    & + li {
      margin-top: 12px;
    }
  }
`;

export const CardTitle = styled.div`
  position: relative;
  height: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.43;
  @include clearfix;

  & > button {
    position: absolute;
    @include vertical-center;
    right: 0;
    z-index: 10;
  }
`;

export const TextDesc = styled.div`
  margin-top: 0;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.accents_5};

  a {
    color: ${({ theme }) => theme.palette.colors.blue[2]};
  }
`;

export const CodeEditorWrapper = styled.div`
  position: relative;
`;

export const CodeEditorOperations = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 2;
  height: 32px;
  padding: 6px 10px;
  border-radius: 16px;
  color: #ffffff;
  background-color: ${({ theme }) => theme.palette.accents_7};

  svg {
    opacity: 0.6;
    margin-top: -1px;
    color: #ffffff;

    &:hover {
      opacity: 1;
      background-color: transparent;
    }
  }
`;

export const StyledEmpty = styled(Empty)`
padding: 32px;
`;
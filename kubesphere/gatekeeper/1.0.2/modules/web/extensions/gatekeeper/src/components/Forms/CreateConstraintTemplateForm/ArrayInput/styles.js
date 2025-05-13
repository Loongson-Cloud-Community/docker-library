import styled, { css } from 'styled-components';
export const  TargetItemWrapper = styled.div`
    background:#f9fbfd;
    boder-radius:4px;
    padding:12px;
    .targetInput{
        max-width: 200px !important;
    }
    .regoTextarea{
        margin-top:12px;
        min-height:200px;
        height: 200px;
    }
`;

export const StyledItem = styled.div`
  position: relative;
  padding: 12px;
  border-radius:4px;
  background-color: #f9fbfd;

  &:not(:first-of-type) {
    margin-top: 4px;
  }

  & > input {
    max-width: none !important;
  }
`;

export const ErrorTip = styled.div`
  padding: 3px 68px 3px 17px;
  margin-top: 4px;
  font-family: ${props => props.theme.font.sans};
  font-size: 12px;
  line-height: 1.67;
  letter-spacing: normal;

`;

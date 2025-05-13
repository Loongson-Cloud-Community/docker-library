import { Form } from '@kubed/components';
import styled from 'styled-components';

export const FormWrapper = styled(Form)`

.sss{
  background:red;
}
:global{
  .xxx{
    background:red;
  }
}

`;

export const FormItemError = styled.div`
  margin-top: 4px;
  font-family: ${({ theme }) => theme.font.sans};
  font-size: 12px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.67;
  letter-spacing: normal;
  color: #404e68;
  color: #ca2621;
`;

export const NamespaceSelectorWrapper = styled.div`
  .form-item{
    padding:12px;
    border-radius: 4px;
    background-color: #f9fbfd;
    &>div{
      &>div:not(:last-child){
        background:#eff4f9;
      }
    }
  }
`


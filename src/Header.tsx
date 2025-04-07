import { forwardRef, ReactNode } from "react";
import styled from "styled-components";

type HeaderProps = {
  children?: ReactNode;
};

const Header = forwardRef<HTMLDivElement, HeaderProps>((props, ref) => (
  <StyledHeader ref={ref} {...props} />
));

export default Header;

const StyledHeader = styled.div`
  // flex: 0 0 auto;
  flex: 1;
  display: flex;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 10px;
  border-radius: 8px;
  width: 50%;
  margin-bottom: 10px;

  @media (max-width: 600px) {
    // margin-top: 150px;
    width: 100%;
    flex-direction: row;
    gap: 10px;
  }
`;

import styled from "styled-components";

export const LargeText = styled.div`
  font-size: larger;
  word-wrap: nowrap;
  white-space: nowrap;
`;

export const StatsValue = styled(LargeText)`
  color: ${(props) =>
    !props.value ? "#000" : props.value > 0 ? "#03cea4" : "#eb5e28"};
`;

export const SmallLabel = styled.div`
  font-size: 0.75rem;
  font-weight: bolder;
  color: #aaa;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const FunnyLogo = styled.img`
  transition: all 0.6s;
  ${(props) => props.upsidedown && "transform: rotate(-720deg); top:7px;"}
`;

export const Footer = styled.div`
  position: absolute;
  height: 3rem;
  bottom: 0;
  width: 100%;
`;

export const NiceButton = styled.button`
  border: 1px solid #0b61ff;
  border-radius: 5px;
  padding: 5px 15px;
  background: #fff;
  color: #0b61ff;
  font-size: 0.875rem;
  transition: all 0.5s ease 0s;

  @media (hover: hover) {
    &:hover {
      color: #fff;
      background: #0b61ff;
    }
  }
`;

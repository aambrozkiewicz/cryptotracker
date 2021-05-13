import styled from "styled-components";

export const LargeText = styled.div`
  font-size: x-large;
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

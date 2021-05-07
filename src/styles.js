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

export const Arrow = styled.div`
  display: inline-block;
  cursor: pointer;
  border-bottom: 2px solid #ccc;
  border-right: 2px solid #ccc;
  width: 20px;
  height: 20px;
  transition: all 0.6s;
  transform: rotate(45deg);
  margin: 6px;
  ${(props) => props.upsidedown && "transform: rotate(-135deg)"};
`;

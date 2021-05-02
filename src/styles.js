import styled from "styled-components";

export const LargeText = styled.div`
  font-size: x-large;
  word-wrap: nowrap;
  white-space: nowrap;
`;

export const StatsValue = styled(LargeText)`
  color: ${(props) => (props.value > 0 ? "#03cea4" : "#eb5e28")};
`;

export const Arrow = styled.div`
  display: inline-block;
  cursor: pointer;
  border-bottom: 7px solid #ccc;
  border-right: 7px solid #ccc;
  width: 20px;
  height: 20px;
  transition: all 0.6s;
  transform: rotate(45deg);
  ${(props) => props.upsidedown && "transform: rotate(-135deg);"};
`;

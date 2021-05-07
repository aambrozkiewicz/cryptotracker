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
  position: relative;
  width: 20px;
  height: 20px;
  margin: 6px;
  &::before {
    position: absolute;
    content: "";
    width: 20px;
    height: 20px;
    top: -5px;
    cursor: pointer;
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;
    transition: all 0.6s;
    transform: rotate(45deg);
    /* margin: 6px; */
    ${(props) =>
      props.upsidedown &&
      "transform: rotate(-135deg); top:7px; border-bottom: 4px solid #000; border-right: 4px solid #000"}
  }
`;

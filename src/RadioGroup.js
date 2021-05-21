import { Button, ButtonGroup } from "react-bootstrap";

function RadioGroup({ onChange, options, value, ...props }) {
  return (
    <ButtonGroup variant="primary" {...props}>
      {options.map((option, i) => (
        <Button
          key={i}
          variant={option === value ? "primary" : "light"}
          onClick={() => onChange(option)}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default RadioGroup;

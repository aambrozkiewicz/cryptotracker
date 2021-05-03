import { Button, ButtonGroup } from "react-bootstrap";

function RadioGroup({ onChange, options, value, ...props }) {
  return (
    <ButtonGroup
      variant="primary"
      onChange={(e) => alert(e.target.value)}
      {...props}
    >
      {options.map((option, i) => (
        <Button
          key={i}
          variant={option === value ? "primary" : "light"}
          onClick={(e) => onChange(option)}
        >
          {option}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default RadioGroup;
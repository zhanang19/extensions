import { Form } from "@raycast/api";
import { useState } from "react";

export default function Command() {
  const [showTextField, setShowTextField] = useState<boolean>(false);

  return (
    <Form>
      <Form.Checkbox id="checkbox" label="Show text field" value={showTextField} onChange={setShowTextField} />
      {showTextField && <Form.TextField id="textfield" title="Text field" placeholder="Enter text" />}
    </Form>
  );
}

import { Form, ActionPanel, SubmitFormAction, showToast, ToastStyle, getPreferenceValues } from "@raycast/api";
import fetch from "node-fetch";

interface FormValues {
  name: string;
}

interface Preferences {
  apiKey: string;
}

// TODO: Get lists dynamically
const DEFAULT_LIST_ID = "38e22153-3005-4d7d-a32f-26b0b91662ad";

export default function Command() {
  async function handleSubmit({ name }: FormValues) {
    const { apiKey } = await getPreferenceValues<Preferences>();

    const toast = await showToast(ToastStyle.Animated, "Creating Task");

    try {
      await fetch("https://api.height.app/tasks", {
        method: "POST",
        headers: {
          Authorization: `api-key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, listIds: [DEFAULT_LIST_ID] }),
      });

      toast.style = ToastStyle.Success;
      toast.title = "Created Task";
    } catch (e) {
      toast.style = ToastStyle.Failure;
      toast.title = "Failed Creating Task";
      toast.message = e instanceof Error ? e.message : undefined;
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <SubmitFormAction onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Name" placeholder="Enter a name" />
    </Form>
  );
}

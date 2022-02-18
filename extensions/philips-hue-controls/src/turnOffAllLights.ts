import { closeMainWindow, showHUD } from "@raycast/api";
import { turnOffAllLights } from "./lib/hue";
import { showFailureToast } from "./lib/utils";

// const BRIDGE_IP_ADDRESS = "192.168.1.115";
// const USERNAME = "kdr4cuDxIRUfmFR2yDvgO-7bwrFF-jV86W8UOZxB";
// const APP_NAME = "Raycast";

// {
//   username: 'kdr4cuDxIRUfmFR2yDvgO-7bwrFF-jV86W8UOZxB',
//   clientkey: '6AE4D799152D2F62B187CEDFF8D31A1B'
// }

// const bridge = await v3.discovery.nupnpSearch();
// console.log(bridge);

// const unauthenticatedApi = await v3.api.createLocal(BRIDGE_IP_ADDRESS).connect();
// const createdUser = await unauthenticatedApi.users.createUser(APP_NAME, hostname());
// console.log(createdUser);

export default async () => {
  try {
    await closeMainWindow();
    await turnOffAllLights();
    showHUD("Turned off all lights");
  } catch (error) {
    showFailureToast(error, "Failed turning off all lights");
  }
};

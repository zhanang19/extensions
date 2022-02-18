# Philips Hue Controls

> The extension is still work in progress

## Todos

- [ ] Add pairing of Hue bridge with onboarding screens instead of preferences
- [ ] Sort our color conversion for optimistic updates

Sample code for pairing:

```
const bridge = await v3.discovery.nupnpSearch();
console.log(bridge);

const unauthenticatedApi = await v3.api.createLocal(BRIDGE_IP_ADDRESS).connect();
const createdUser = await unauthenticatedApi.users.createUser(APP_NAME, hostname());
console.log(createdUser);
```

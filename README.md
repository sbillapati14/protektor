[![Build][Build-Status-Image]][Build-Status-Url] [![Release][Release-Image]][Release-Url] [![License][License-Image]][License-Url]


# Protektor
Protektor is an isomorphic role based permission library that protects both UI resources and data models.

# Defining Resource Data Model Mappings
The main feature of Protektor is enforcing permissions for both UI resources as well as related data models, therefore, defining resource data model mapping is the first step to initialize Proteckor.  This step also gives Protektor list of all the resources to protect.

To define resource to data model name call:
```
import Protektor from 'protektor';

Protektor.resource(resourceName, dataModel)
```
resourceName is a string identifying any resource you want to protect and typically this is some UI component or view.  dataModel is a string or list of strings identifying data models needed to access information for the resource.

To retrieve data models for the resource call the same function but only with resourceName:
```
Protektor.resource(resourceName)
```
This will return data model(s) associated with the given resource.

# Define Permissions
To define access permissions within a `role` specify allowed action on the resource:
```
Protektor.allow(action, resource, roleName)

or to disallow action explicitly:

Protektor.forbid(action, resource, roleName)
```

It is possible to call allow and then forbid on the same resource, action, role.  The last call will overwrite permissions.

# Checking Permissions on Server
Protektor library supports checking permissions for the given role on the server side via `hasPermission` API:

```
Protektor.hasPermission(action, resource, roleName)

Returns true if permitted, otherwise false
```

On the server side you can also call `hasModel` API to verify that the given role has access to the data model you are trying to use:

```
Protektor.hasModel(modelName, roleName)

Returns true if the specified model is accessible by the role, otherwise false
```

Sometimes it is useful to get the actual model object if the role permits the access.  This can be accomplished with `getModel` API:

```
Protektor.getModel(modelName, roleName, modelTransformCallback)
```

modelTransformCallback is a function that is called with modelName as parameter if the access to model is permitted or undefined if not permitted.

# Checking Permissions - ReactJS Client
Protektor provides `hasPermission` render prop component that will check permissions for the role.  If the role is allowed to access to the resource children components will be rendered.

```
import { hasPermission, RoleBuilder } from 'protektor';

const currentRole = RoleBuilder.fromJSON(roleData);

.
.
.

<HasPermission to="read" access="Home" forRole={currentRole}>
  <SideNavSection
    to="/home"
    label="Home"
  />
</HasPermission>
```

Here `RoleBuilder` creates current user role from JSON.  You will need to marshal the role from the server to client first.  On the server you can retrieve Role information with toJSON API:

```
const role = Protektor.roleToJSON(roleName);
```

# Protektor Storage
By default Protektor uses default memory store.  Protektor storage can persist role and permission data to anywhere you want.  `protektor-data-adapter` package provides base adapter class that you can use to extend.

```
import Protektor from 'protektor'; 
import { Adapter } from 'protektor-data-adapter';

class SomeNewAdapter extends Adapter {}
const someNewAdapter = new SomeNewAdapter();

.
.
.

Protektor.registerAdapter(someNewAdapter);
```



[Build-Status-Url]: https://drone-server.xrtc.cloud/iris-platform/protektor
[Build-Status-Image]: https://drone-server.xrtc.cloud/api/badges/iris-platform/protektor/status.svg
[License-Url]: http://opensource.org/licenses/MIT
[License-Image]: https://img.shields.io/badge/License-MIT-blue.svg

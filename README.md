[![Build][Build-Status-Image]][Build-Status-Url] [![License][License-Image]][License-Url]


# Protektor
Protektor is an isomorphic role based permission library that protects both UI resources and data models.

# Defining Resource Data Model Mappings
The main feature of Protektor is enforcing permissions for both UI resources as well as related data models, therefore, defining resource data model mapping is the first step to initialize Proteckor.  This step also gives Protektor list of all the resources to protect.

To define resource to data model name call:
```
import Protektor from 'protektor';

Protektor.resourceModels(resourceName, dataModel)
```
resourceName is a string identifying any resource you want to protect and typically this is some UI component or view.  dataModel is a string or list of strings identifying data models needed to access information for the resource.

To retrieve data models for the resource call the same function but only with resourceName:
```
Protektor.resourceModels(resourceName)
```
This will return data model(s) associated with the given resource.

# Define Role Identifier
Role identifier is an object that uniquely identifies the role.  This object should contain all
the relevant information to uniquely identify the role.  Simplest example would be Role Identifier
with just name:

```
{
  name: 'admin'
}
```

More complex Role Identifier could also store information about role groups.  For example, maybe you
need to have roles for your administrator team and default roles for other teams that are added
automatically upon team creation.  You could handle this by creating `group` field to differentiate
between two `admin` roles:

```
admin role for administrator team:

{
  name: 'admin',
  group: 'system_administrators`
}
```

And for other teams:

```
Upon creation of each team the default admin role could be assigned:

{
  name: 'admin',
  group: 'default_team_roles'
}
```

Protektor needs to be able to search for the role identifier but it does not know what fields
or combination of fields within role identifier makes it unique search criteria.  In order
to provide Protektor with this information you must register predicate that returns unique
identity for the role.  The predicate is a function with that takes role identifier object
and returns unique id based on whatever algorithm you choose.  

Using the last example above we could write our predicate to return the slug of name and group
fields:

```
function roleId(roleIdentifier) {
  return slug(roleIdentifier.name + ' ' + roleIdentifier.group);
}

Protektor.registerRoleIdentifierPredicate(roleId)
```

Note that if you do not register role identifier predicate Protektor will scan role identifier
object and concatinate values of object's all top level keys.  Depending on your application
this may be sufficient for you needs.

# Define Permissions
To define access permissions within a `role` specify allowed action on the resource:
```
Protektor.allow({ action, resource, roleIdentifier })

or to disallow action explicitly:

Protektor.forbid({ action, resource, roleIdentifier })
```

You can also remove specific permission with:
```
Protektor.removePermission({ action, resource, roleIdentifier })
```

It is possible to call allow and then forbid on the same resource, action, role.  The last call will overwrite permissions.

# Checking Permissions On The Server
Protektor library supports checking permissions for the given role on the server side via `hasPermission` API:

```
Protektor.hasPermission({ action, resource, roleIdentifier })

Returns true if permitted, otherwise false
```

On the server side you can also call `hasModel` API to verify that the given role has access to the data model you are trying to use:

```
Protektor.hasModel({ modelName, roleIdentifier })

Returns true if the specified model is accessible by the role, otherwise false
```

Sometimes it is useful to get the actual model object if the role permits the access.  This can be accomplished with `getModel` API:

```
Protektor.getModel({ modelName, roleIdentifier, modelTransformCallback })
```

modelTransformCallback is a function that is called with modelName as parameter if the access to model is permitted or undefined if not permitted.

# Searching For Roles On The Server
Protektor provides two APIs to search for roles.  One to find a specific Role and second one to filter
out roles based on some criteria.

To find specific role call `Protektor.roleToJSON(RoleIdentifier)`.  This will return role as JSON object
that is ready to be marshalled to the client.

To find roles based on some criteria use `Protektor.filterRoles(filterComparator, roleIdentifier)`.
This function will return all roles that match criteria based on the `filterComparator` and value
provided in `roleIdentifier` object.

For example let's assume you have roles defined like this:

```
[
  {
    name: 'role1'
  },
  {
    name: 'role2'
  },
  {
    name: 'role1',
    group: 'global'
  },
  {
    name: 'role2',
    group: 'global'
  }
]
```

and you want to just get the roles that belong to global group.  You would call `filterRoles` as follows:

```
const globalRoles = await Protektor.filterRoles(
  roleIdentifier => roleIdentifier.group,
  {
    group: 'global'
  }
);
```

This would return only roles with group global:

```
[
  {
    name: 'role1',
    group: 'global'
  },
  {
    name: 'role2',
    group: 'global'
  }
]
```

# Marshalling Role To The Client
To send a role with its permissions to the client call server side API: `Protektor.roleToJSON(roleIdentifier)`.

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

Here `RoleBuilder` creates current user role from JSON.  You will need to marshal the role from the server to client first.

# RoleBuilder
RoleBuilder object is client side helper for unmarshalling JSON representation of Role that comes
from the server.  RoleBuilder returns client side representation of role described by `Role` object.

# Client Role object
Client Role object is representation of the role defined on the server and it is used with all client APIs.  It has the following APIs:

```
* roleIdentifier - returns RoleIdentifier object as defined by developer
* allowed(resource) - list of actions allowed
* forbidden(resource) - list of actions forbidden
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

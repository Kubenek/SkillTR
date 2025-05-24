## Node Keys

### Basics

Node keys are used to unlock nodes and progress higher in the tree hierarchy.

Just as nodes, the keys also have varities, which contain: "common" and "node-specific".

A node key will have a field in the database called 'unlock-id', which corresponds to one node with the exact id.

When loading the tree dashboard, all currently gained and available to use keys will be loaded into an array.

### Hover Mechanics

Upon node hover, one of the actions peformed is a check for all the available keys ids, comparing it with the hovered node:

- if one of the key ids matches the node id, the node will be highlited and the user will be able to unlock it, removing its key from their database in the process.
- although if none of the keys match the node id, the node remains dull, and pressing upon it won't do a thing.

### Getting Keys

To earn a key for a specific node, you'll need to look at the node specific quest and complete it. Once finished you can claim your reward and progress the tree.

Also, you can earn common keys, used for common nodes, more on that [here](./common-node-keys.md)
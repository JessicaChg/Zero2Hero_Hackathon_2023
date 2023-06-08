# Relation-Graph


## What is Relation-Graph

Relation-Graph is a decentralized social graph deployed on BNB Chain. It creates a blockchain-native data layer through SBTs and a standard data format, enabling developers around the world to build decentralized social graphs on blockchain.


Relation-Graph is a social graph that inherits from the Relation Protocol.Any developer can create functions and data types in its social graph layer while allowing users to preserve their social relations and contents on the social network regardless of changes to the application layer.

## The Composition of Social Graph


Relation-Graph forms an on-chain social graph by converting all user behavior into SBT. We use the user's wallet address as their identity, and create an SBT for each action the user takes on a social application, such as building relationships, publishing content, setting names, etc. For efficiency and scalability, we adopt the BNB Chain + Greenfield solution. Token creation and storage is handled by BNBChain, while content and file data are stored and recorded by Greenfield.



## The value of Relation-Graph


### User sovereignty

With a decentralized social graph, users now have more autonomy and control over how their social data should be shared and used. This improves participation and satisfaction.

### Interoperability between social networks

A decentralized social graph can facilitate interoperability between different social networks. With more users sharing and transferring data freely between social networks, we can envision a future where barriers between these networks could be removed, promoting further integration and development. Meanwhile, the increased interoperability enabled by an open standard also encourages innovations, providing better services and user experience. Furthermore, there are many privacy-preserving mechanisms on the market. With this increased interoperability, we can also leverage these technologies to better protect user data.

### Privacy matters

DeSoc solutions today are not immune to privacy issues. A decentralized social graph provides users with better control over their own social network data to preserve their privacy. With user data stored on a decentralized network instead of a centralized one, the chance of data leak is reduced.

### Self-governance for social networks

A decentralized social graph promotes self-governance for social networks. Users in these networks can organize and govern their communities to facilitate a more open and democratic social network environment.

### Data security

A decentralized social graph using blockchain technology to store and manage social network data could provide better security when it comes to safeguarding user data, with the immutability and decentralized control enabled by blockchain technology.

### Democratic decision making

In a decentralized social graph community, users can collectively decide the directions and decisions for the network to move forward. This promotes user engagement and increases network resiliency.

### Composability

For the moment decentralized societies have not taken form. That means social graph infrastructures should be open and have composability to be the pillar underpinning a decentralized future. This is critical for innovations.
Relation-Graph allows this by defining identities and social behaviors in social networks as SBTs, providing data composability between applications and smart contracts and constructing a blockchain-native social graph.

### Scalability

The Relation-Graph allows developers to deploy their own Semantic SBT contracts to expand the horizon of social graphs.

### Developer friendly

Graph database technology is important for developers dealing with traditional social networks. It allows for efficient search and recommendations. With Relation-Graph, social network data can be connected with graph databases with little trouble.



## Smart contract

We implemented the following scenario using Semantic SBT contract

- **Relationships**: Describe connections between different users via SBT contracts.
    - Follow
    - DAO
- **Publication**: Describe users' content published via SBT contracts.
    - Content

The Semantic SBT contract for each scenario has a schema that constrains the data model within the contract. The schema, which is represented by a TTL file, is stored on a decentralized storage system called Greenfield.
The file address is described using the format `gnfd://bucket/object`, and the address description is stored in the contract.

![img.png](img.png)

### Relationship

### Follow

As a factory pattern, registration center and router contract, the "FollowRegister" has the following business logic:

- deployFollowContract: To deploy the "Follow" contract.
- ownedFollowContract: To query the "Follow" contract owned by an address.

As the contract actually records a user's "follow" relationships, "Follow" can be owned by each user. When a new fan follows a user, a token will be minted by the user's "Follow" contract and distributed to the fan.

- follow: A fan will mint a token via the "Follow" contract of the person he/she follows.
- unfollow: When a fan cancels the "follow" relationship and burns the token generated by that particular relationship.


### Dao

The DAO module consists of the DaoRegister contract and the DAO contract. We use the DaoRegister contract as the factory pattern and registration center to deploy and record the DAO contracts created by users.

- deployDaoContract: To deploy the "Dao" contract.
- daoOf: Lookup the information on a DAO.


The DAO contract has the following methods:

- setDaoURI: Set the information for a DAO."The URI points to a file on Greenfield with the format of `gnfd://bucket/object`, which describes the basic information of the DAO.
- addMember: Add the specified address to dao in batches.
- join: Join a dao
- remove: Removed from a dao


### Publication

#### Content

The Content contract allows a user to publish content openly on the Relation Protocol. Users can share articles, pictures, videos, and more with it.
Meanwhile, it is based on blockchain technology, so the content published is immutable and traceable.

With the Content contract, users can publish and read their own contents. They can also comment and like the contents generated by other users.

- post: The content should be the object on Greenfield, format with `gnfd://bucket/object`.
- contentOf : View the object on Greenfield corresponding to the token.

The content uploaded to Greenfield is structured as follows:

```json
{
  "content": {
    "body": "${The body of content}",
    "title": "${The title of content}"
  }
}
```

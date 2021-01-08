# Apollo Server

[Orignal_ref](https://www.howtographql.com/graphql-js/0-introduction/)

[source_code_react_apollo](https://github.com/howtographql/react-apollo)

view databae via prisma

```shell
 npx prisma studio
 ```

## subscription

```shell
subscription {
  newVote {
    id
    link {
      url
      description
    }
    user {
      name
      email
    }
  }
}
```

```shell
subscription{
  newLink{
    id
    description
    url
    postedBy{
      name
      email
    }
    votes{
      link{
        url
        description
      }
    }
  }
}
```

## query

```shell
query{
  feed{
    id
    description
    url
  }
}
```

```shell
query{
  feed{
    id
    description
    url
    postedBy{
      name
    }
    votes{
      link{
        description
      }
    }
  }
}
```

## mutation

```shell
mutation{
  vote(linkId: 7){
    id
  }
}
```

```shell
mutation{
  post(url: "google.com", description: "google is my best friends"){
    id
    description
    url
  }
}
```

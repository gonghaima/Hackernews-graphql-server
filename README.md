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

```shell
mutation{
  signup(email: "foo@gmail.com", password: "asdf", name: "foo Homes"){
    token
    user{
      name
      email
      id
    }
  }
}
```

```shell
mutation{
  login(email: "foo@gmail.com", password: "123456"){
    token
    user{
      name
      email
      id
    }
  }
}
```

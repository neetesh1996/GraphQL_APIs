const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema= require('./graphql/schema/index');
const graphQlResolver = require('./graphql/resolvers/index')
const app = express();
const isAuth = require('./middleware/is-auth');

app.use(bodyParser.json());
app.use(isAuth);

app.use(
    '/graphql',
    graphqlHTTP({
    schema: graphQlSchema,
    rootValue:graphQlResolver,
    graphiql:true
})
);
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-ka7jt.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(3000, ()=> {
        console.log("listening at port localhost:3000/praphql")
})
})
.catch(err =>{
    console.log(err)

});


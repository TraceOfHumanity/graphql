import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import express from 'express';

const app = express();

const schema = buildSchema(`
    type Query {
        hello: String
        other: Int
        rollDice(numDice: Int!, numSides: Int): [Int]
        quoteOfTheDay: String
    }
`);

const rootValue = {
    hello: () => 'Привіт, світе!',
    other: () => 123,
    rollDice: ({ numDice, numSides: Int = 6 }) => {
        const output = [];
        for (let i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * numSides));
        }
        return output;
    },
    quoteOfTheDay: () => Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within',
}

app.use('/graphql', graphqlHTTP({ schema, rootValue, graphiql: true }));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));

// graphql({
//     schema,
//     rootValue,
//     source: '{ hello other}'
// })
//     .then((response) => {
//         console.log(response);
//     })
//     .catch((error) => {
//         console.error(error);
//     });

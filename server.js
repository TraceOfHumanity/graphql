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
        user(name: String = "John Test"): User
        getDie(numSides: Int): RandomDie
        getMessage: String
    }
    type User { 
        name: String
        age: Float
    }
    type RandomDie {
        roll(numRolls: Int!): [Int]
        numSides: Int
        rollOnce: Int
    }

    type Mutation {
        setMessage(message: String): String
    }
`);

class User {
    constructor(name, age) {
        this.name = name;
    }
    age() {
        return Math.floor(Math.random() * 100);
    }
}

class RandomDie {
    constructor(numSides) {
        this.numSides = numSides;
    }
    rollOnce() {
        return 1 + Math.floor(Math.random() * this.numSides);
    }
    roll({ numRolls }) {
        const output = [];
        for (let i = 0; i < numRolls; i++) {
            output.push(this.rollOnce());
        }
        return output;
    }
}

const fakeDatabase = {

};

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
    user: (args) => new User(args.name),
    getDie: ({ numSides }) => new RandomDie(numSides || 6),
    setMessage: ({ message }) => {
        fakeDatabase.message = message;
        return message;
    },
    getMessage: () => fakeDatabase.message,
}

app.use('/graphql', graphqlHTTP({ schema, rootValue, graphiql: true }));

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));

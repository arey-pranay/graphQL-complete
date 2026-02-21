// the resolvers always need to match the schema, so we need to have a resolver for each field in the schema.
export const resolvers = {
    Query: {
        job: () => {
            // when job is queried, this function will be executed and the return value will be sent back to the client as a response.
            return {
                id: "1",
                title: "Software Engineer", // if job { title } is queried, "Software Engineer" will be sent back as a response.
                description:
                    "A software engineer is a person who applies the principles of software engineering to the design, development, maintenance, testing, and evaluation of computer software.",
            };
        },
    },
};

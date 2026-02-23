// create client side queries to fetch the current user's profile information
import { getAccessToken } from "../auth";
import {
    ApolloClient,
    ApolloLink,
    InMemoryCache,
    concat,
    createHttpLink,
    gql,
} from "@apollo/client";
const httpLink = createHttpLink({ uri: "http://localhost:9000/graphql" });
const authLink = new ApolloLink((operation, forward) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        operation.setContext({
            headers: { Authorization: `Bearer ${accessToken}` },
        });
    }
    return forward(operation);
});
const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
});
export async function getJobs() {
    const query = gql`
        # this is the same query we were using in the sandbox at 9000/graphql, but now we are using it in our client side code to fetch the data from the server.
        query {
            jobs {
                id
                title
                date
                company {
                    id
                    name
                }
            }
        }
    `;

    // const response = await client.request(query);
    // return response.jobs;
    const response = await apolloClient.query({ query });
    return response.data.jobs;
}

export async function getJob(id) {
    const query = gql`
        query ($id: ID!) {
            job(id: $id) {
                id
                title
                description
                date
                company {
                    id
                    name
                }
            }
        }
    `;
    // const response = await client.request(query, { id });
    // return response.job;
    const response = await apolloClient.query({ query, variables: { id } });
    return response.data.job;
}

export async function getCompany(id) {
    const query = gql`
        query ($id: ID!) {
            company(id: $id) {
                id
                name
                description
                jobs {
                    id
                    title
                }
            }
        }
    `;
    // const response = await client.request(query, { id });
    // return response.company;
    const response = await apolloClient.query({ query, variables: { id } });
    return response.data.company;
}

export async function createJob(input) {
    console.log("function-----createJob called with input:");
    const mutation = gql`
        mutation ($input: CreateJobInput!) {
            createJobMutation(input: $input) {
                id # this is  the field we will be needing from the mutation response, we need the id of the newly created job to be able to navigate to the job page after creating the job.
            }
        }
    `;
    // const response = await client.request(mutation, { input });
    // return response.createJobMutation;
    const response = await apolloClient.mutate({
        mutation,
        variables: { input },
    });
    return response.data.createJobMutation;
}

export async function deleteJob(id) {
    const mutation = gql`
        mutation ($id: ID!) {
            deleteJobMutation(id: $id) {
                title # we can return any field from the deleted job, but we need to return something to confirm that the deletion was successful. Returning the title is just an example, you can return any field you want.
            }
        }
    `;

    const response = await apolloClient.mutate({
        mutation,
        variables: { id },
    });
    return response.data.deleteJobMutation;
}

export async function updateJob(input) {
    const mutation = gql`
        mutation ($input: UpdateJobInput!) {
            updateJobMutation(input: $input) {
                title
            }
        }
    `;
    // destructuring the input and sending is a nice shortcut key step
    const response = await apolloClient.mutate({
        mutation,
        variables: { input },
    });
    return response.data.updateJobMutation;
}

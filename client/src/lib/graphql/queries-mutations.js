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

// fragment is used to avoid writing the same fields repeatedly
const jobDetailsFragment = gql`
    fragment JobDetails on Job {
        id
        date
        title
        company {
            id
            name
        }
        description
    }
`;
// we can also create our queries as re-usable variables for using the same query in multiple mutations or queries
const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetails
        }
    }
    ${jobDetailsFragment}
`;

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
    const response = await apolloClient.query({
        query,
        fetchPolicy: "network-only", // the default is cache-first, which checks in cache first and then puts if not present, and returns if present. but network-only means consider only network requests for this query responses, cache is not supposed to be used for this.
    });
    return response.data.jobs;
}

export async function getJob(id) {
    const query = jobByIdQuery;
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

    const response = await apolloClient.query({ query, variables: { id } });
    return response.data.company;
}

export async function createJob(input) {
    console.log("function-----createJob called with input:");
    const mutation = gql`
        mutation ($input: CreateJobInput!) {
            createJobMutation(input: $input) {
                # these are the fields we will be needing from the mutation response, we need the details of the newly created job to be able to navigate to the job page after creating the job.
                ...JobDetails
            }
        }
        ${jobDetailsFragment}
    `;
    // const response = await client.request(mutation, { input });
    // return response.createJobMutation;
    const response = await apolloClient.mutate({
        mutation,
        variables: { input },
        // after a job is created, we redirect the user to the job's page and then call the query to get job details, It'd be better if we could just store all the job details of this job in cache
        update: (cache, { data }) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: data.createJobMutation.id },
                data,
            });
        },
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

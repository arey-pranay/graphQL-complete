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
export const apolloClient = new ApolloClient({
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
export const jobByIdQuery = gql`
    query JobById($id: ID!) {
        job(id: $id) {
            ...JobDetails
        }
    }
    ${jobDetailsFragment}
`;
export const companyByIdQuery = gql`
    query CompanyById($id: ID!) {
        company(id: $id) {
            id
            name
            description
            jobs {
                id
                date
                title
            }
        }
    }
`;
export const jobsQuery = gql`
    query Jobs {
        jobs {
            id
            date
            title
            company {
                id
                name
            }
        }
    }
`;

export const createJobMutation = gql`
    mutation CreateJob($input: CreateJobInput!) {
        job: createJobMutation(input: $input) {
            ...JobDetails
        }
    }
    ${jobDetailsFragment}
`;

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

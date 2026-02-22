import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { deleteJob, getCompany } from "../lib/graphql/queries-mutations";

function CompanyPage() {
    const { companyId } = useParams();
    const [pageState, setPageState] = useState({
        company: null,
        loading: true,
        error: null,
    });
    useEffect(() => {
        async function fetchCompany() {
            try {
                const company = await getCompany(companyId);
                setPageState({
                    company,
                    loading: false,
                    error: null,
                });
            } catch (error) {
                let message = "Failed to fetch company";

                if (error.response?.errors?.length) {
                    message = error.response.errors[0].message;
                } else if (error.message) {
                    message = error.message;
                }

                setPageState({
                    company: null,
                    loading: false,
                    error: message,
                });
            }
        }
        fetchCompany();
    }, [companyId]);
    const { company, loading, error } = pageState;
    const handleDeleteJob = async (jobId) => {
        try {
            await deleteJob(jobId);
            // After deleting the job, we need to update the company data to reflect the change. We can do this by refetching the company data.
            const updatedCompany = await getCompany(companyId);
            setPageState({
                company: updatedCompany,
                loading: false,
                error: null,
            });
        } catch (error) {
            let message = "Failed to delete job";

            if (error.response?.errors?.length) {
                message = error.response.errors[0].message;
            } else if (error.message) {
                message = error.message;
            }

            setPageState((prevState) => ({
                ...prevState,
                error: message,
            }));
        }
    };
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p className="error">{error}</p>;
    }
    return (
        <div>
            <h1 className="title">{company.name}</h1>
            <div className="box">{company.description}</div>

            {company.jobs.length > 0 ? (
                <div>
                    <h2 className="subtitle">Jobs at {company.name}</h2>
                    <ul>
                        {company.jobs.map((job) => (
                            <div key={job.id} className="">
                                <li key={job.id}>{job.title}</li>
                                <button
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="button is-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No jobs available at this company.</p>
            )}
        </div>
    );
}

export default CompanyPage;

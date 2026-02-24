import { useParams } from "react-router";
import { deleteJob } from "../lib/graphql/queries-mutations";
import { useCompany } from "../lib/graphql/hooks";
function CompanyPage() {
    const { companyId } = useParams();
    const { company, loading, error } = useCompany(companyId);
    const handleDeleteJob = async (jobId) => {
        await deleteJob(jobId);
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

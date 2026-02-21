import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../lib/graphql/queries";

function CompanyPage() {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    useEffect(() => {
        async function fetchCompany() {
            const company = await getCompany(companyId);
            setCompany(company);
        }
        fetchCompany();
    }, [companyId]);
    if (!company) {
        return <p>Loading...</p>;
    }
    return (
        <div>
            <h1 className="title">{company.name}</h1>
            <div className="box">{company.description}</div>
        </div>
    );
}

export default CompanyPage;

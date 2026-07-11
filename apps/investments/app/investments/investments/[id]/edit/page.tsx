import { InvestmentForm } from "../../../../components/InvestmentForm";
export default async function EditInvestmentPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <main className="form-page"><InvestmentForm investmentId={id} /></main>; }

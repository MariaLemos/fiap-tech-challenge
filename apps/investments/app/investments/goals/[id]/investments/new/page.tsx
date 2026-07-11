import { InvestmentForm } from "../../../../../components/InvestmentForm";
export default async function NewGoalInvestmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="form-page">
      <InvestmentForm defaultGoalId={id} />
    </main>
  );
}

import { GoalForm } from "../../../../components/GoalForm";
export default async function EditGoalPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <main className="form-page"><GoalForm goalId={id} /></main>; }

import CreateLeadForm from "@/components/Forms/CreateLead";
import Title from "@/components/Title";

export default function Edit() {
  return (
    <div className="space-y-4">
      <Title text={"Create Leads"} />
      <CreateLeadForm type={"create"} handleUpdate={handleUpdate} />
    </div>
  );
}

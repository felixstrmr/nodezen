import { Button } from "@/components/ui/button";
import { n8nClient } from "@/lib/clients/n8n-client";
import { supabaseClient } from "@/lib/clients/supabase-client";

export default function Page() {
  async function test() {
    "use server";

    const supabase = await supabaseClient();
    const { data: instance } = await supabase
      .from("instances")
      .select("*")
      .eq("id", "b040049b-3964-475f-95ca-0bee29df9f84")
      .maybeSingle()
      .throwOnError();

    if (!instance) {
      throw new Error("Instance not found");
    }

    const client = new n8nClient(instance.n8n_url, instance.n8n_api_key);

    const executions = await client.getExecutions();

    console.log(executions.length);
  }

  return (
    <div className="flex size-full flex-col rounded-lg bg-background">
      <Button onClick={test}>Test</Button>
    </div>
  );
}

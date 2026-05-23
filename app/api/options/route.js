import { supabase } from "../../../lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("options")
    .select("*")
    .order("value_grams", { ascending: true });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

export async function POST(request) {
  try {
    const { name, value_grams } = await request.json();

    const { data, error } = await supabase
      .from("options")
      .insert([{ name, value_grams }])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("options").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ success: true });
}

import { supabase } from "../../../lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");

  const { data, error } = await supabase
    .from("recipients")
    .select("*")
    .eq("year", year)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

export async function POST(request) {
  try {
    const { name, amount_grams, year } = await request.json();

    const { data, error } = await supabase
      .from("recipients")
      .insert([{ name, amount_grams, year, status: "pending" }])
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json();

    const { data, error } = await supabase
      .from("recipients")
      .update({ status })
      .eq("id", id)
      .select();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data[0]);
  } catch (error) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const { error } = await supabase.from("recipients").delete().eq("id", id);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json({ success: true });
}

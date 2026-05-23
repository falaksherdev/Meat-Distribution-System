import { supabase } from "../../../lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year");
  const all = searchParams.get("all");

  if (all === "true") {
    const { data, error } = await supabase
      .from("yearly_settings")
      .select("*")
      .order("year", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data || []);
  }

  if (year) {
    const { data, error } = await supabase
      .from("yearly_settings")
      .select("*")
      .eq("year", parseInt(year));

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (data && data.length > 0) {
      return Response.json(data[0]);
    } else {
      return Response.json({ year: parseInt(year), total_ghost_kg: 0 });
    }
  }

  return Response.json([]);
}

export async function POST(request) {
  try {
    const { year, total_ghost_kg } = await request.json();

    console.log("Saving:", year, total_ghost_kg);

    // Check if record exists
    const { data: existing } = await supabase
      .from("yearly_settings")
      .select("*")
      .eq("year", parseInt(year));

    let result;

    if (existing && existing.length > 0) {
      // Update existing
      const { data, error } = await supabase
        .from("yearly_settings")
        .update({
          total_ghost_kg: parseFloat(total_ghost_kg),
          updated_at: new Date(),
        })
        .eq("year", parseInt(year))
        .select();

      result = { data, error };
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("yearly_settings")
        .insert({
          year: parseInt(year),
          total_ghost_kg: parseFloat(total_ghost_kg),
          updated_at: new Date(),
        })
        .select();

      result = { data, error };
    }

    if (result.error) {
      console.error("Error:", result.error);
      return Response.json({ error: result.error.message }, { status: 500 });
    }

    console.log("Saved successfully:", result.data);
    return Response.json(result.data[0]);
  } catch (error) {
    console.error("POST Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

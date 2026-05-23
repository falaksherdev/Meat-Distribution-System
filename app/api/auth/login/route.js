import { supabase } from "../../../../lib/supabase";

export async function POST(request) {
  console.log("=== LOGIN API STARTED ===");

  try {
    const body = await request.json();
    console.log("Body received:", body);

    const { email, password } = body;
    console.log("Email:", email);
    console.log("Password length:", password?.length);

    // Find user by email
    console.log("Querying Supabase...");
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    console.log("Query result:", { users, error });

    if (error) {
      console.log("ERROR from Supabase:", error);
      return Response.json(
        { error: "Database error: " + error.message },
        { status: 500 },
      );
    }

    if (!users || users.length === 0) {
      console.log("User not found");
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    console.log("User found:", user.email);
    console.log("Password in DB:", user.password);

    // Direct comparison
    if (user.password !== password) {
      console.log("Password mismatch");
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("Login successful!");
    return Response.json({
      success: true,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.log("CATCH BLOCK ERROR:", error);
    console.log("Error message:", error.message);
    console.log("Error stack:", error.stack);
    return Response.json(
      { error: "Server error: " + error.message },
      { status: 500 },
    );
  }
}

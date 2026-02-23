import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function OPTIONS(req) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(req) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized"
      },
      {
        status: 401,
        headers: corsHeaders
      }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");
    const email = user.email;
    const profile = await db.collection("user").findOne(
      { email },
      {
        projection: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
          profileImage: 1,
        },
      }
    );

    console.log("profile: ", profile);
    return NextResponse.json(profile, {
      headers: corsHeaders
    })
  }
  catch (error) {
    console.log("Get Profile Exception: ", error.toString());
    return NextResponse.json(error.toString(), {
      headers: corsHeaders
    })
  }
}

export async function PATCH(req) {
  const user = verifyJWT(req);
  if (!user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401, headers: corsHeaders }
    );
  }

  const data = await req.json();
  const partialUpdate = {};

  if (data.firstname != null) partialUpdate.firstname = data.firstname;
  if (data.lastname != null) partialUpdate.lastname = data.lastname;
  if (data.email != null) partialUpdate.email = data.email;

  if (Object.keys(partialUpdate).length === 0) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("user").updateOne(
      { email: user.email },
      { $set: partialUpdate }
    );

    return NextResponse.json(result, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

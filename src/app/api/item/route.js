import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server"; 

export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
} 

export async function GET () {

    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");
        const result = await db.collection("item").find({}).toArray();
        console.log("==> result", result);
        return NextResponse.json(result, {
            headers: corsHeaders
        });
    }
    catch (exception) {
        console.log("exception", exception.toString());
        const errorMsg = exception.toString();
        return NextResponse.json({
            message: errorMsg
        }, {
            status: 400,
            headers: corsHeaders
        })
    }
}

export async function POST(req) {
  const data = await req.json();

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").insertOne({
      itemName: data.itemName,
      itemCategory: data.itemCategory,
      itemPrice: data.itemPrice,
      status: data.status ?? "ACTIVE",
    });

    return NextResponse.json(result, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (exception) {
    return NextResponse.json(
      { message: exception.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}
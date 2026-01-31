import corsHeaders from "@/lib/cors";
import { getClientPromise } from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: corsHeaders,
    });
}

export async function GET (req, { params }) {

    const { id } = await params;
    
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");
        const result = await db.collection("item").findOne({_id: new ObjectId(id)});
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

export async function PATCH(req, { params }) {
  const { id } = params;
  const data = await req.json();

  const partialUpdate = {};
  if (data.itemName != null) partialUpdate.itemName = data.itemName;
  if (data.itemCategory != null) partialUpdate.itemCategory = data.itemCategory;
  if (data.itemPrice != null) partialUpdate.itemPrice = data.itemPrice;
  if (data.status != null) partialUpdate.status = data.status;

  try {
    const client = await getClientPromise();
    const db = client.db("wad-01");

    const result = await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      { $set: partialUpdate }
    );

    return NextResponse.json(result, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (exception) {
    return NextResponse.json(
      { message: exception.toString() },
      { status: 400, headers: corsHeaders }
    );
  }
}

export async function PUT (req, { params }) {
    const { id } = await params;
    const data = await req.json(); //assume that it contain whole item data...
    const fullUpdate = {
        itemName: data.itemName,
        itemCategory: data.itemCategory,
        itemPrice: data.itemPrice,
        status: data.status
    }; 
    try {
        const client = await getClientPromise();
        const db = client.db("wad-01");
        const updatedResult = await db.collection("item").updateOne({_id: new
ObjectId(id)}, {$set: fullUpdate});
        return NextResponse.json(updatedResult, {
            status: 200, 
            headers: corsHeaders 
        }) 
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

  const newItem = {
    itemName: data.itemName,
    itemCategory: data.itemCategory,
    itemPrice: data.itemPrice,
    status: data.status ?? "active"
  };

  const client = await getClientPromise();
  const db = client.db("wad-01");

  const result = await db.collection("item").insertOne(newItem);

  return NextResponse.json(result, {
    status: 201,
    headers: corsHeaders
  });
}

export async function DELETE(req, { params }) {
  const { id } = params;

  const client = await getClientPromise();
  const db = client.db("wad-01");

  const result = await db.collection("item")
    .deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json(result, {
    status: 200,
    headers: corsHeaders
  });
}
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { productId: string } }) {
  try {
    await db.product.delete({
      where: {
        id: params.productId,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Product deletion error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (params.productId) {
      const product = await db.product.findUnique({
        where: {
          id: params.productId,
        },
      });

      if (!product) {
        return new NextResponse("Product not found", { status: 404 });
      }

      return NextResponse.json(product);
    } else {
      const products = await db.product.findMany();
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Product fetch error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { productId: string } }) {
  try {
    const body = await req.json();

    const product = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      images: body.images,
      stock: Number(body.stock),
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
    };

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        ...product,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product update error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

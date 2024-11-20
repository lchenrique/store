import { NextResponse } from "next/server";
import db from "@/lib/db";

type Params = Promise<{ productId: string }>

export async function DELETE(
  req: Request,
  context: { params: Params }
) {
  try {
    const params = await context.params;
    
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

export async function GET(
  req: Request,
  context: { params: Params }
) {
  try {
    const params = await context.params;
    
    if (params.productId) {
      const product = await db.product.findUnique({
        where: {
          id: params.productId,
        },
        include: {
          reviews: {
            include: {
              user: true
            }
          }
        }
      });

      if (!product) {
        return new NextResponse("Product not found", { status: 404 });
      }

      return NextResponse.json(product);
    } else {
      const products = await db.product.findMany({
        include: {
          reviews: {
            include: {
              user: true
            }
          }
        }
      });
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Product fetch error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  context: { params: Params }
) {
  try {
    const params = await context.params;
    const body = await req.json();

    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name: body.name,
        description: body.description,
        price: Number(body.price),
        images: body.images,
        stock: Number(body.stock),
      },
      include: {
        reviews: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product update error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

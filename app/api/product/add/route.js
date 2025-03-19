import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from "@clerk/nextjs/server"; // ✅ Correct

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: 'User not authenticated'
            }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({
                success: false,
                message: 'You are not authorized to add products'
            }, { status: 403 });
        }

        const formData = await request.formData();
        const name = formData.get('name');
        const price = formData.get('price');
        const description = formData.get('description');
        const category = formData.get('category');
        const offerPrice = formData.get('offerPrice');
        const files = formData.getAll('images');

        if (!Array.isArray(files) || files.length === 0) {
            return NextResponse.json({
                success: false,
                message: 'No files uploaded'
            }, { status: 400 });
        }

        const result = await Promise.all(
            files.map(async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: 'auto' },
                        (error, result) => {
                            if (error) {
                                console.error("Cloudinary upload failed:", error);
                                reject(new Error("Image upload failed"));
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    stream.end(buffer);
                });
            })
        );

        const image = result.map(result => result.secure_url);
        await connectDB();

        const newProduct = await Product.create({
            userId,
            name,
            price: Number(price),  // Fixed duplicate `price`
            description,
            category,
            offerPrice: Number(offerPrice),
            image,
            date: Date.now()
        });

        return NextResponse.json({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        }, { status: 201 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}

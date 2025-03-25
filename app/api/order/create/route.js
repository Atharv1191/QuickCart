
// import { inngest } from "@/config/ingest"
// import Product from "@/models/Product"
// import User from "@/models/User"
// import {getAuth} from "@clerk/nextjs/server"
// import { NextResponse } from "next/server"
// export async function POST(request){
//     try{
//         const {userId} = getAuth(request)
//         const {address,items} = await request.json()
//         if(!address || items.length === 0){
//            return NextResponse.json({success:false,message:"Invalid data"})
//         }
//         //calculate amount using items
//         const amount = items.reduce(async(acc,item)=>{
//             const product = await Product.findById(item.product);
//             return await acc + product.offerPrice*item.quantity;
//         },0)
//         await inngest.send({
//             name:'order/created',
//             data:{
//                 userId,
//                 address,
//                 items,
//                 amount:amount + Math.floor(amount*0.02),
//                 date:Date.now()
//             }
//         })
//         //clear user cart
//         const user = await User.findById(userId)
//         user.cartItems ={}
//         await User.findByIdAndUpdate(userId,{cartItems:{}})
//         return NextResponse.json({
//             success:true,
//             message:"Order placed successfully"
//         })
//     } catch(error){
//         console.log(error)
//         return NextResponse.json({
//             success:false,
//             message:error.message
//         })

//     }
// }
import { inngest } from "@/config/ingest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if (!address || items.length === 0) {
            return NextResponse.json({ success: false, message: "Invalid data" });
        }

        // ✅ Fix: Calculate amount correctly
        let amount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            amount += product.offerPrice * item.quantity;
        }

        // Add 2% fee
        amount = amount + Math.floor(amount * 0.02);

        await inngest.send({
            name: "order/created",
            data: {
                userId,
                address,
                items,
                amount,
                date: Date.now(),
            },
        });

        // ✅ Fix: Properly update the user's cart
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}

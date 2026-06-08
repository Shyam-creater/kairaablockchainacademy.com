// import { apiSlice } from "../api/apiSlice";

// export const ordersApi= apiSlice.injectEndpoints({
//     endpoints:(builder)=>({
//         getAllOrders:builder.query({
//             query:(type)=>({
//                 url:`get-orders`,
//                 method:"GET",
//                 credentials:"include",
//             })
//         }),
        
//         getRazorpayPublishablekey:builder.query({
//             query:()=>({
//                 url:`payment/razorpaypublishablekey`,
//                 method:"GET",
//                 credentials:"include"
//             })
//         }),
//         createRazorpayOrder: builder.mutation({
//             query: ({ amount }) => ({
//               url: 'create-razorpay-order',
//               method: 'POST',
//               body: { amount },
//                credentials:"include"
//             }),
//           }),
//         createOrder: builder.mutation({
//             query: ({ courseId, payment_info }) => ({
//               url: 'create-order',
//               method: 'POST',
//               body: { courseId, payment_info },
//               credentials:"include"
//             }),
//           }),
//           verifyOrder: builder.mutation({
//             query: ({ courseId, response }) => ({
//               url: 'payment/razorpay',
//               method: 'POST',
//               body: { courseId, response },
//               credentials:"include"
//             }),
//           }),
//     })
// })

// export const {useGetAllOrdersQuery,useCreateRazorpayOrderMutation,useGetRazorpayPublishablekeyQuery,useCreateOrderMutation,useVerifyOrderMutation}=ordersApi


import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrders: builder.query({
            query: () => ({
                url: 'get-orders',
                method: 'GET',
                credentials: 'include',
            })
        }),
        getRazorpayPublishablekey: builder.query({
            query: () => ({
                url: 'payment/razorpaypublishablekey',
                method: 'GET',
                credentials: 'include'
            })
        }),
        createRazorpayOrder: builder.mutation({
            query: ({ amount }) => ({
                url: 'create-razorpay-order',
                method: 'POST',
                body: { amount },
                credentials: 'include'
            }),
        }),
        createOrder: builder.mutation({
            query: ({ courseId, payment_info }) => ({
                url: 'create-order',
                method: 'POST',
                body: { courseId, payment_info },
                credentials: 'include'
            }),
        }),
        verifyOrder: builder.mutation({
            query: ({ courseId, response }) => ({
                url: 'payment/razorpay',
                method: 'POST',
                body: { courseId, response },
                credentials: 'include'
            }),
        }),
    })
});

export const {
    useGetAllOrdersQuery,
    useCreateRazorpayOrderMutation,
    useGetRazorpayPublishablekeyQuery,
    useCreateOrderMutation,
    useVerifyOrderMutation
} = ordersApi;

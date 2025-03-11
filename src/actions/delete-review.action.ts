"use server"

import { revalidateTag } from "next/cache";

export async function deleteReviewAction(_: any, formData: FormData) {
    const reviewId = formData.get("reviewId")?.toString();
    const bookId = formData.get("bookId")?.toString();

    if (!reviewId) {
        return {
            status: false,
            error: "리뷰를 삭제할 수 없습니다.",
        };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/${reviewId}`,
            {
                method: "DELETE",
            }
        );

        if (response.ok) {
            revalidateTag(`review-${bookId}`);
            return {
                status: true,
                error: "",
            };
        } else {
            throw new Error(response.statusText);
        }
    } catch (e) {
        console.error(e);
        return {
            status: false,
            error: "리뷰 삭제에 실패하였습니다.",
        };
    }
}
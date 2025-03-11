"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export default async function createReviewAction(_: any, formData: FormData) {
  const bookId = formData.get("bookId")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();

  if (!content || !author || !bookId) {
    return {
      status: false,
      error: "리뷰 내용과 작성자를 입력해 주세요.",
    };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,
      {
        method: "POST",
        body: JSON.stringify({ bookId, content, author }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      //1. 특정주소의 해당하는 페이지만 재검증 (모든 캐쉬 초기화)
      //revalidatePath(`/book/${bookId}`);

      //2. 특정 경로의 모든 동적 페이지를 재검증
      //revalidatePath(`/book/[id]`, "page");

      //3. 특정레이아웃을 갖는 모든 페이지 재검증
      //revalidatePath("/(with-searchbar)", "layout");

      //4. 모든 페이지 재검증
      //revalidatePath("/", "layout");

      //5. 태그 기준, 데이터 캐시 재검증
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
      error: "리뷰 내용과 작성자 입력을 실패하였습니다.",
    };
  }
}

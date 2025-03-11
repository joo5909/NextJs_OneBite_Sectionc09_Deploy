import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react"

async function SearchResult({ query }: { query: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${query}`
  );

  if (!response.ok) {
    throw new Error("검색 결과를 가져오는데 실패했습니다.");
  }

  const books: BookData[] = await response.json();

  if (books.length === 0) {
    return <div>검색 결과가 없습니다.</div>;
  }

  return (
    <div>
      <div>
        {books.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: `${q} 검색 결과`,
    description: `${q} 검색 결과를 확인할 수 있습니다.`,
    openGraph: {
      title: `${q} 검색 결과`,
      description: `${q} 검색 결과를 확인할 수 있습니다.`,
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    // query를 key로 추가하여 쿼리가 변경될 때마다 Suspense가 재실행되도록 함
    <Suspense key={query} fallback={<BookListSkeleton count={3} />}>
      <SearchResult query={query} />
    </Suspense>
  );
}
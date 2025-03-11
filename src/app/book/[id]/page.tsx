import { BookData, ReviewData } from "@/types";
import style from "./page.module.css";
import { notFound } from "next/navigation";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";
import Image from "next/image";
import { Metadata } from "next";

//정적으로 빌드타임에 만들어서 조금이나마 속도 향상
export function generateStaticParams() {
  return [{ id: "1" }];
}

async function BookDetail({ bookId }: { bookId: string }) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${bookId}`, { cache: "force-cache" });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
  }

  const book: BookData = await response.json();

  const { coverImgUrl, title, subTitle, author, publisher, description } = book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image src={coverImgUrl} width={240} height={300} alt={title} />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        저자: {author} | 출판사: {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}



async function ReviewList({bookId}: {bookId: string}) {

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}` ,{next: { tags: [`review-${bookId}`] }});

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const reviews: ReviewData [] = await response.json();

  return (
    <section>
      {reviews.map((review) => <ReviewItem key={review.id} {...review} />)}
    </section>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {

  const { id } = await params;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${id}`, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const book: BookData = await response.json();

  return {
    title : book.title,
    description: book.description,
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.coverImgUrl]
    }
  };
}


export default async function Page({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  return (
    <div className={style.container}>
      <BookDetail bookId={id} />
      <ReviewEditor bookId={id} />
      <ReviewList bookId={id} />
    </div>

  )
}

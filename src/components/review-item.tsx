import { ReviewData } from '@/types';
import style from './review-item.module.css';
import ReviewItemDeleteButton from './review-item-delete-button';

export default function ReviewItem({ id, bookId, content, author, createdAt }: ReviewData) {
    return (
        <div className={style.container}>
            <div className={style.author}>{author}</div>
            <div className={style.content}>{content}</div>
            <div className={style.bottomContainer}>
                <div className={style.date}>{new Date(createdAt).toLocaleDateString()}</div>
                <ReviewItemDeleteButton reviewId={id} bookId={bookId} />
            </div>
        </div>
    );
}
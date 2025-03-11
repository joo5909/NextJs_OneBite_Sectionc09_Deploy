"use client";

import style from './review-editor.module.css';
import createReviewAction from '@/actions/create-review.action';
import { useActionState, useEffect } from 'react';

export default function ReviewEditor({ bookId }: { bookId: string }) {

    const [state, formAction, isPending] = useActionState(createReviewAction, null);

    useEffect(() => {
        if (state && !state.status) {
            alert(state.error);
        }
    }, [state]);
    return (
        <section>
            <form className={style.formContainer} action={formAction}>
                <input required type="hidden" name="bookId" value={bookId}></input>
                <textarea disabled={isPending} required name="content" placeholder="리뷰 내용" autoComplete="off"></textarea>
                <div className={style.submitContainer}>
                    <input disabled={isPending} required name="author" placeholder="작성자" autoComplete="off"></input>
                    <button disabled={isPending} type="submit">
                        {isPending ? '작성중...' : '리뷰 작성'}
                    </button>
                </div>
            </form>
        </section>
    )
}

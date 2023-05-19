import { useEffect } from 'react';
import s from './Pagination.module.css';

export const Pagination = ({responseData, pageNumber, handlePagination}) => {
    
    useEffect(() => {
        handlePagination(pageNumber);
    }, [pageNumber])

    return (
        <div className={s.pagination}>

        </div>
    )
}
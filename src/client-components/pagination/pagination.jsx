'use client'
import { useCallback, useEffect, useState } from 'react';

import "./pagination.scss"

const PageItem = ({ item, page, setPage }) => {
  const [show, setShow] = useState()
  const [number, setNumber] = useState()

  useEffect(() => {
    const isObj = typeof item === "object" && item !== null;
    const display = isObj ? "..." : item
    const n = isObj ? item.value : item

    setShow(display)
    setNumber(n)

  }, [item])

  return <button className={`page-item ${page == show ? "focus" : ""}`} onClick={() => setPage(number)}>{show}</button>
}

const Pagination = ({ count, page, setPage }) => {
  const [jumpPage, setJumpPage] = useState(1);
  const [pages, setPages] = useState([]);

  // 生成页码显示逻辑
  const getPages = useCallback((page, count) => {
    const pages = [];
    pages.push(1);

    if (count < 10) {
      for (let i = 2; i <= count; i++) {
        pages.push(i);
      }
    } else if (page < 6) {
      for (let i = 2; i <= 7; i++) {
        pages.push(i);
      }
      pages.push({ type: "skip", value: page + 5 });
      pages.push(count);
    } else if (count - page <= 4) {
      pages.push({ type: "skip", value: page - 5 });
      for (let i = count - 7; i <= count; i++) {
        pages.push(i);
      }
    } else {
      pages.push({ type: "skip", value: page - 5 });
      pages.push(page - 2);
      pages.push(page - 1);
      pages.push(page);
      pages.push(page + 1);
      pages.push(page + 2);
      pages.push({ type: "skip", value: page + 5 });
      pages.push(count);
    }

    return pages;
  }, []);

  useEffect(() => {
    const pages = getPages(page, count)
    setPages(pages)
    console.log(pages)
  }, [page, count, getPages])

  return <div className="pagination">
    {page > 1 && <button className='page-item' onClick={() => setPage(page - 1)}>上一页</button>}
    {pages.map((item, i) => (
      <PageItem key={i} item={item} page={page} setPage={setPage} />
    ))}
    {page < count && <button className='page-item' onClick={() => setPage(page - 1)}>下一页</button>}
    共 {count} 页
  </div>
};

export default Pagination;
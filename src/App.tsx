import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'
import { Post } from './types'

function App() {
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}`)
      .then(res => res.json())
      .then(data => {
        setPosts(prevData => [...prevData, ...data])
        if (data.length === 0 || data.length < 10) {
          setHasMore(false)
        }
        setLoading(false)
      })
  }, [page])

  const lastPostRef = useCallback((node: HTMLParagraphElement) => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1)
      }
    })
    if (node) observer.current.observe(node);
  }, [loading, hasMore])
  

  return (
    <>
      <h1>Infinite Scroll Example</h1>
      <div>
        {
          posts.map((post, index) => {
            if (posts.length === index + 1) {
              return (
                <div key={post.id} className='container__posts'>
                  <h3>{post.id} - {post.title}</h3>
                  <p ref={lastPostRef}>{post.body}</p>
                </div>
              )
            } else {
              return (
                <div key={post.id} className='container__posts'>
                  <h3>{post.id} - {post.title}</h3>
                  <p>{post.body}</p>
                </div>
              )
            }
          })
        }
      </div>
      {loading && <h3>Loading...</h3>}
    </>
  )
}

export default App

import React , { useEffect,useState }  from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";



const News= (props) =>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalresults, setTotalresults] = useState(0)


 const capitalizeFirstLetter =(string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


  const updateNews  = async ()=> {
    props.setProgress(10);
    const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=52b5d96a0bfe4a63a8d53ec04269fb1c&page=${page}&pagesize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsdata = await data.json();
    props.setProgress(70);
    setArticles(parsdata.articles)
    setTotalresults(parsdata.totalResults)
    setLoading(false)
    
    props.setProgress(100);
  }
  useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
     // eslint-disable-next-line 
  }, [])
  
  // const handlePreclick= async ()=>{
  //   setPage(page-1)
  //   updateNews();
  // }
  // const handleNextclick= async ()=>{
  //   setPage(page+1)
  //   updateNews();
  //     }

      const fetchMoreData = async () => {
        const url =`https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=52b5d96a0bfe4a63a8d53ec04269fb1c&page=${page+1}&pagesize=${props.pageSize}`;
        setPage(page+1)
        let data = await fetch(url);
        let parsdata = await data.json()
        setArticles(articles.concat(parsdata.articles))
        setTotalresults( parsdata.totalResults)
    };

    return (
      <div className='container my-3'>
        <h1 className="text-center" style={{marginTop:'90px'}}>NewsMonkey - Top Headlines from {capitalizeFirstLetter(props.category)} catagory</h1>
        {loading && <Spinner/>}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !==totalresults}
          loader={<Spinner/>}
        >
          <div className="container">

         
        <div className="row">
         {articles.map((element)=>{
           return <div className="col-md-4" key={element.url}>
        <NewsItem  title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imgurl={element.urlToImage?element.urlToImage:"https://www.reuters.com/resizer/w79xcA557PgFmuGEScrV4Npb1PA=/1200x628/smart/filters:quality(80)/cloudfront-us-east-2.images.arcpublishing.com/reuters/IRQ3OR6DCNKZZHK2ZMWKP6PNAY.jpg"} newsurl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
        </div> 
          })}
        </div>  
           </div>    
        </InfiniteScroll>  
      </div>
    )

}
News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category:'all',
 }
 
 News.propTypes = {
   country: PropTypes.string,
   pageSize: PropTypes.number, 
   category: PropTypes.string,
 }

export default News

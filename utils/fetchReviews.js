const cheerio = require("cheerio");
const fetchReviews = async (page, newLocation) => {
  
  // let newLocation = `https://ebay.co.uk/urw/product-reviews/4046999516`
  console.log("new Location", newLocation);
  const response = await page.goto(newLocation, {
    waitUntil: "networkidle2",
  });
  let _newResponse = await response.text();
  const $ = cheerio.load(_newResponse);
  let allReviews = [];
  const reviewsContainer = $(".top-Reviews-Wrapper", "#reviewsContentWrapper")
    .find(".reviews")
    .children();
    const reviewContainerSliced = reviewsContainer.slice(0, reviewsContainer.length-1);
    const _totalReviews = $(".p-rvw-count").text().replace('reviews','');

    reviewContainerSliced &&
    reviewContainerSliced.each((i, item) => {
      // let cheerioRating = cheerio.load(item);
      let rating = $(item)
        .find(".ebay-review-section-l")
        .find(".ebay-star-rating")
        .children("meta")
        .attr("content");
    //   console.log(rating);
      let reviewTitle = $(item).find(".ebay-review-section-r h3").text();
    //   console.log(reviewTitle);
      let reviewText = $(item)
        .find(".ebay-review-section-r p[itemprop='reviewBody']")
        .text()
        .replace(`Read full review...`, "");
    //   console.log(reviewText);
      allReviews.push({
        title: reviewTitle,
        rating: rating,
        review: reviewText,
      });

      // return;
    });
  return {allReviews, totalReviews:_totalReviews};
};
module.exports = fetchReviews;

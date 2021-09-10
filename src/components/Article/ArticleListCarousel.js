import React, { Component } from "react";
import Slider from "react-slick";

import { CAROUSEL_DISPOSITIONS } from "../../config";
import { ArticleList } from "../Article/ArticleList";
import "./ArticleListCarousel.scss";

export class ArticleListCarousel extends Component {
  render() {
    const { dispositions, articles } = this.props;
    if (!articles || articles.length === 0) {
      return null;
    }

    let blocs = [];
    let count = 0;
    while (count < articles.length) {
      dispositions.forEach(function (disposition, index) {
        count += CAROUSEL_DISPOSITIONS[disposition];
        blocs.push({
          count: CAROUSEL_DISPOSITIONS[disposition],
          disposition: disposition,
        });
      });
    }
    let counter = 0,
      step = 0;
    let slides = [];
    for (const bloc of blocs) {
      if (counter < articles.length) {
        slides[step] = {
          disposition: bloc.disposition,
          articles: [],
        };
      }
      for (let i = 0; i < bloc.count; i++) {
        if (counter < articles.length) {
          slides[step].articles.push(articles[counter]);
          counter++;
        }
      }
      step++;
    }

    const settings = {
      dots: true,
      dotsClass: "slick-dots",
      infinite: true,
      arrows: false,
      speed: 500,
      autoplay: false,
    };
    return (
      <div>
        <Slider {...settings}>
          {slides.map((slide, index) => {
            return (
              <ArticleList
                key={index}
                type={slide.disposition}
                articles={slide.articles}
              />
            );
          })}
        </Slider>
      </div>
    );
  }
}

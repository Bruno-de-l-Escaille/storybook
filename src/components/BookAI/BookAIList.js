"useClient";
import React, { useEffect, useState } from "react";
import BookAI from "./BookAI";
import style from "./BookAI.module.scss";
import { getAuthAccess, getProducts } from "./api";
import { isEmpty } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import { TTPSlider } from "../../common/components/sliders/ttp-slider";
import { useResponsive } from "../../common/hooks/useResponsive";
import { I18N } from "../../i18n";
export const BookAIList = ({
  language,
  token,
  organization,
  organizationImage = "",
  user,
}) => {
  const translate = (text) => {
    return I18N[language][text];
  };
  const [products, setProducts] = useState(null);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [error, setError] = useState(null);

  const [isFetchingAuth, setIsFetchingAuth] = useState(false);
  const [userAccess, setUserAccess] = useState(null);
  const { isMobile } = useResponsive();
  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      setIsFetchingProduct(true);
      setError(null);

      try {
        const data = await getProducts(token, organization);
        setProducts(data);
        setProducts([data[0], data[1], data[0], data[1], data[1], data[0]]);
      } catch (err) {
        setError(err);
      } finally {
        setIsFetchingProduct(false);
      }
    };

    const fetchUserAccess = async () => {
      setIsFetchingAuth(true);
      try {
        const data = await getAuthAccess(token, user?.id);
        setUserAccess(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsFetchingAuth(false);
      }
    };
    fetchUserAccess();
    fetchProducts();
  }, [token, organization, user]);

  if (isFetchingProduct || isEmpty(products) || !Array.isArray(products)) {
    return <></>;
  }
  const productsLength = products.length;
  // to have more than 3 books for the slider
  console.log("productsLength", JSON.stringify(products), productsLength);
  const renderBooks = () =>
    products.map((product) => (
      <div
        className="m-b-s"
        key={product?.id}
        style={
          !isMobile && productsLength > 1
            ? {
                marginRight: "1rem",
                width: productsLength == 2 ? 595 : 390,
                height: 400,
              }
            : {}
        }
      >
        <BookAI
          product={product}
          productsLength={productsLength}
          isBought={
            !isFetchingAuth &&
            Array.isArray(userAccess) &&
            userAccess.length > 0 &&
            userAccess.some(
              (userAuth) =>
                userAuth.collection?.id === product.collection_id &&
                new Date(userAuth.expire_at).getTime() >= new Date().getTime()
            )
          }
          expireAt={
            !isFetchingAuth && Array.isArray(userAccess)
              ? (() => {
                  const expireAtStr = userAccess.filter(
                    (userAuth) =>
                      userAuth.collection?.id === product.collection_id &&
                      new Date(userAuth.expire_at).getTime() >=
                        new Date().getTime()
                  )[0]?.expire_at;
                  if (expireAtStr) {
                    const expireDate = new Date(expireAtStr);
                    return `${expireDate
                      .getDate()
                      .toString()
                      .padStart(2, "0")}/${(expireDate.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}/${expireDate.getFullYear()}`;
                  }
                  return "";
                })()
              : ""
          }
          organizationImage={
            isEmpty(organizationImage)
              ? product?.issuer?.avatarUrl ?? ""
              : organizationImage
          }
          token={token}
          user={user}
        />
      </div>
    ));
  const settings = {
    dots: true,
    dotsClass: "slick-dots",
    infinite: true,
    arrows: false,
    speed: 500,
    autoplay: false,
  };
  return (
    <div className={style.wrapperLivres}>
      <h1>{translate("livres_numerique")}</h1>
      <div className={style.cycles_slider}>
        {/* <Slider {...settings}>{renderBooks()}</Slider> */}
        <TTPSlider
          className={style.layout_custom}
          cards={renderBooks()}
          slidesPerView={3}
          slidesPerGroup={1}
          spaceBetween={5}
          speed={500}
          isAuto
          centeredSlides
          // loop
        />
      </div>
    </div>
  );
};

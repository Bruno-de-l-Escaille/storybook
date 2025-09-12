"useClient";
import React, { useEffect, useState } from "react";
import BookAI from "./BookAI";
import style from "./BookAI.module.scss";
import { getAuthAccess, getProducts } from "./api";
import { getAiUrl, getApiUrl, isEmpty } from "../../utils";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Slider from "react-slick";
import { TTPSlider } from "../../common/components/sliders/ttp-slider";
import { useResponsive } from "../../common/hooks/useResponsive";
import { I18N } from "../../i18n";
import { fetchOrganizations, getUser } from "../../api/user";
export const BookAIListComponent = ({
  language,
  token,
  organization,
  organizationImage = "",
  user,
  env,
  showFiduciareModal = true,
}) => {
  const translate = (text) => {
    return I18N[language][text];
  };
  const [products, setProducts] = useState(null);
  const [isFetchingProduct, setIsFetchingProduct] = useState(false);
  const [error, setError] = useState(null);

  const [fiduciaires, setFiduciaires] = useState([]);
  const [isFetchingFiduciaires, setIsFetchingFiduciaires] = useState(false);

  const [isFetchingAuth, setIsFetchingAuth] = useState(false);
  const [userAccess, setUserAccess] = useState([]);
  const { isMobile } = useResponsive();
  localStorage.removeItem("book_step");

  useEffect(() => {
    if (!token) return;

    const fetchProducts = async () => {
      setIsFetchingProduct(true);
      setError(null);

      try {
        const data = await getProducts(token, getAiUrl(env), organization);
        setProducts(data);
        //setProducts([data[0], data[1], data[0], data[1], data[1], data[0]]);
      } catch (err) {
        setError(err);
      } finally {
        setIsFetchingProduct(false);
      }
    };

    const fetchUserAccess = async () => {
      if (isEmpty(user) || !user?.id) {
        setUserAccess([]);
        return;
      }

      setIsFetchingAuth(true);
      try {
        const data = await getAuthAccess(token, getAiUrl(env), user?.id);
        setUserAccess(data);
      } catch (err) {
        setError(err);
        setUserAccess([]);
      } finally {
        setIsFetchingAuth(false);
      }
    };

    const fetchOrganization = async () => {
      setIsFetchingFiduciaires(true);
      try {
        const data = await fetchOrganizations(getApiUrl(env), token, user?.id);
        const organizationsData = data?.data?.data ?? [];
        const organizations = organizationsData.filter(
          (org) => org.membershipOrder?.hasFiduciaryPlan
        );
        setFiduciaires([organizations[0], organizations[1], organizations[2]]);
        setFiduciaires(organizations);
      } finally {
        setIsFetchingFiduciaires(false);
      }
    };

    fetchUserAccess();
    fetchProducts();
    fetchOrganization();
  }, [token, organization, user, env]);

  if (isFetchingProduct || isEmpty(products) || !Array.isArray(products)) {
    return <></>;
  }

  const productsLength = products.length;

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
                userAuth.collection?.id === (product?.collection_id ?? 0) &&
                new Date(userAuth.expire_at).getTime() >= new Date().getTime()
            )
          }
          expireAt={
            !isFetchingAuth && Array.isArray(userAccess)
              ? (() => {
                  const expireAtStr = userAccess.filter(
                    (userAuth) =>
                      userAuth.collection?.id ===
                        (product?.collection_id ?? 0) &&
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
          env={env}
          fiduciaires={fiduciaires}
          showFiduciareModal={showFiduciareModal}
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
          loop={productsLength > 3 ? true : false}
        />
      </div>
    </div>
  );
};
